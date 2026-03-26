$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$urls = @(
  'https://abdulrahmanazam.me/',
  'https://www.abdulrahmanazam.me/',
  'https://abdulrahmanazam.com/',
  'https://www.abdulrahmanazam.com/',
  'https://abdulrahmanazam.me/robots.txt',
  'https://abdulrahmanazam.me/sitemap.xml',
  'https://abdulrahmanazam.me/llms.txt'
)
$headerKeys = @('strict-transport-security','content-security-policy','x-frame-options','x-content-type-options','referrer-policy','permissions-policy','x-robots-tag','cache-control','server')

function Follow-RedirectsManual {
  param([string]$StartUrl,[int]$MaxHops=10)
  $hops = @(); $cur = $StartUrl; $err = $null; $status = $null; $headers = @{}

  try { Resolve-DnsName -Name ([uri]$StartUrl).Host -Type A -ErrorAction Stop | Out-Null }
  catch { return [pscustomobject]@{start=$StartUrl;hops=$hops;finalUrl=$cur;status=$null;headers=$headers;error=$_.Exception.Message} }

  for($i=0; $i -lt $MaxHops; $i++){
    try {
      $r = Invoke-WebRequest -Uri $cur -UseBasicParsing -MaximumRedirection 0 -TimeoutSec 12 -ErrorAction Stop
      $code = [int]$r.StatusCode; $loc = $r.Headers['Location']
      $hops += [pscustomobject]@{hop=$i;url=$cur;status=$code;location=($(if($loc){$loc}else{'-'}))}
      if($code -in 301,302,303,307,308 -and $loc){
        if($loc -match '^https?://'){ $cur = $loc } else { $cur = ([uri]::new([uri]$cur,$loc)).AbsoluteUri }
        continue
      }
      $status = $code
      foreach($k in $headerKeys){ $headers[$k] = ($(if($r.Headers[$k]){$r.Headers[$k]}else{'(missing)'})) }
      break
    }
    catch {
      if($_.Exception.Response){
        $resp = $_.Exception.Response
        $code = [int]$resp.StatusCode; $loc = $resp.Headers['Location']
        $hops += [pscustomobject]@{hop=$i;url=$cur;status=$code;location=($(if($loc){$loc}else{'-'}))}
        if($code -in 301,302,303,307,308 -and $loc){
          if($loc -match '^https?://'){ $cur = $loc } else { $cur = ([uri]::new([uri]$cur,$loc)).AbsoluteUri }
          continue
        }
        $status = $code
        foreach($k in $headerKeys){ $headers[$k] = ($(if($resp.Headers[$k]){$resp.Headers[$k]}else{'(missing)'})) }
        break
      } else {
        $err = $_.Exception.Message
        break
      }
    }
  }

  [pscustomobject]@{start=$StartUrl;hops=$hops;finalUrl=$cur;status=$status;headers=$headers;error=$err}
}

function Get-Meta {
  param([string]$Html,[string]$Name)
  $p1 = '<meta[^>]+(?:name|property)=["''][ ]*' + [regex]::Escape($Name) + '["''][^>]*content=["'']([^"'']+)["'']'
  $m1 = [regex]::Match($Html,$p1,'IgnoreCase')
  if($m1.Success){ return $m1.Groups[1].Value }
  $p2 = '<meta[^>]*content=["'']([^"'']+)["''][^>]+(?:name|property)=["''][ ]*' + [regex]::Escape($Name) + '["'']'
  $m2 = [regex]::Match($Html,$p2,'IgnoreCase')
  if($m2.Success){ return $m2.Groups[1].Value }
  return '(missing)'
}

$results = foreach($u in $urls){ Follow-RedirectsManual -StartUrl $u -MaxHops 10 }

foreach($r in $results){
  Write-Output "URL: $($r.start)"
  if($r.error){ Write-Output "Error: $($r.error)"; Write-Output '---'; continue }
  foreach($h in $r.hops){ Write-Output ("Hop {0}: {1} | {2} | Location: {3}" -f $h.hop,$h.url,$h.status,$h.location) }
  Write-Output ("Final: {0} | {1}" -f $r.finalUrl,$r.status)
  Write-Output 'Headers:'
  foreach($k in $headerKeys){ Write-Output ("  {0}: {1}" -f $k,$r.headers[$k]) }
  Write-Output '---'
}

$home = $results | Where-Object start -eq 'https://abdulrahmanazam.me/' | Select-Object -First 1
if($home -and -not $home.error -and $home.status){
  $html = (Invoke-WebRequest -Uri $home.finalUrl -UseBasicParsing -TimeoutSec 12).Content
  $title='(missing)'; $tm=[regex]::Match($html,'<title[^>]*>(.*?)</title>','IgnoreCase,Singleline'); if($tm.Success){$title=($tm.Groups[1].Value -replace '\s+',' ').Trim()}
  $canonical='(missing)'; $c1=[regex]::Match($html,'<link[^>]+rel=["'']canonical["''][^>]*href=["'']([^"'']+)["'']','IgnoreCase'); if($c1.Success){$canonical=$c1.Groups[1].Value}else{$c2=[regex]::Match($html,'<link[^>]*href=["'']([^"'']+)["''][^>]+rel=["'']canonical["'']','IgnoreCase'); if($c2.Success){$canonical=$c2.Groups[1].Value}}
  Write-Output 'HOMEPAGE_META:'
  Write-Output ("  Final URL: {0}" -f $home.finalUrl)
  Write-Output ("  title: {0}" -f $title)
  Write-Output ("  meta description: {0}" -f (Get-Meta -Html $html -Name 'description'))
  Write-Output ("  canonical: {0}" -f $canonical)
  Write-Output ("  og:url: {0}" -f (Get-Meta -Html $html -Name 'og:url'))
  Write-Output ("  twitter:url: {0}" -f (Get-Meta -Html $html -Name 'twitter:url'))
  Write-Output ("  robots meta: {0}" -f (Get-Meta -Html $html -Name 'robots'))
  Write-Output '---'
}

$robots = $results | Where-Object start -eq 'https://abdulrahmanazam.me/robots.txt' | Select-Object -First 1
if($robots -and -not $robots.error -and $robots.status -eq 200){
  $rb = (Invoke-WebRequest -Uri $robots.finalUrl -UseBasicParsing -TimeoutSec 12).Content
  $sms = @([regex]::Matches($rb,'(?im)^\s*Sitemap\s*:\s*(\S+)') | ForEach-Object { $_.Groups[1].Value })
  $hosts = @([regex]::Matches($rb,'(?im)^\s*Host\s*:\s*(\S+)') | ForEach-Object { $_.Groups[1].Value })
  $targetHost = ([uri]$robots.finalUrl).Host
  Write-Output 'ROBOTS_CHECK:'
  Write-Output ("  robots URL: {0}" -f $robots.finalUrl)
  Write-Output ("  Sitemap directives: {0}" -f ($(if($sms.Count){$sms -join '; '}else{'none'})))
  Write-Output ("  Host directives: {0}" -f ($(if($hosts.Count){$hosts -join '; '}else{'none'})))
  if($sms.Count){
    $cons = foreach($s in $sms){ try{ $h=([uri]$s).Host; "{0}=>{1}" -f $s,$(if($h -eq $targetHost){'match'}else{'mismatch'}) } catch { "{0}=>invalid" -f $s } }
    Write-Output ("  Sitemap host consistency: {0}" -f ($cons -join '; '))
  }
  if($hosts.Count){
    $hcons = foreach($h in $hosts){ "{0}=>{1}" -f $h,$(if($h -eq $targetHost){'match'}else{'mismatch'}) }
    Write-Output ("  Host consistency: {0}" -f ($hcons -join '; '))
  }
  Write-Output '---'
}

$sm = $results | Where-Object start -eq 'https://abdulrahmanazam.me/sitemap.xml' | Select-Object -First 1
Write-Output 'SITEMAP_CHECK:'
if($sm.error){ Write-Output ("  Error: {0}" -f $sm.error) }
elseif($sm.status -ne 200){ Write-Output ("  Not 200. Final: {0} Status: {1}" -f $sm.finalUrl,$sm.status) }
else {
  $xml = (Invoke-WebRequest -Uri $sm.finalUrl -UseBasicParsing -TimeoutSec 12).Content
  $locs = @([regex]::Matches($xml,'<loc>\s*([^<]+)\s*</loc>','IgnoreCase') | ForEach-Object { $_.Groups[1].Value.Trim() })
  Write-Output ("  loc count: {0}" -f $locs.Count)
  $i=1
  foreach($loc in ($locs | Select-Object -First 10)){
    Write-Output ("  {0}. {1} | fragment#: {2}" -f $i,$loc,$(if($loc -match '#'){'yes'}else{'no'}))
    $i++
  }
}
