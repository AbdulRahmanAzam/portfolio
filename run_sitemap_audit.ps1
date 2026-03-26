$ErrorActionPreference='Stop'
$ProgressPreference='SilentlyContinue'
$root=(Get-Location).Path

foreach($n in @('lighthouse','chrome','chromium')){try{Get-Process -Name $n -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue | Out-Null}catch{}}
try{Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue | Where-Object{ $_.CommandLine -match 'lighthouse' } | ForEach-Object{ try{Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue | Out-Null}catch{} }}catch{}

function IW([string]$u,[string]$m='GET',[int]$t=20){
  try{
    $r=Invoke-WebRequest -Uri $u -Method $m -UseBasicParsing -MaximumRedirection 10 -TimeoutSec $t -Headers @{'User-Agent'='Mozilla/5.0 SitemapAudit'} -ErrorAction Stop
    [pscustomobject]@{ok=$true;code=[int]$r.StatusCode;final=if($r.BaseResponse.ResponseUri){$r.BaseResponse.ResponseUri.AbsoluteUri}else{$u};ct=[string]$r.Headers['Content-Type'];body=[string]$r.Content;err=$null}
  }catch{
    $code=$null;$final=$u;try{if($_.Exception.Response){if($_.Exception.Response.StatusCode){$code=[int]$_.Exception.Response.StatusCode};if($_.Exception.Response.ResponseUri){$final=$_.Exception.Response.ResponseUri.AbsoluteUri}}}catch{}
    [pscustomobject]@{ok=$false;code=$code;final=$final;ct='';body='';err=$_.Exception.Message}
  }
}

function CheckUrl([string]$u){$r=IW $u 'HEAD' 15;if((!$r.ok)-or(!$r.code)-or($r.code -in @(405,501))){$r=IW $u 'GET' 20};$r}

$base='https://abdulrahmanazam.me'
$robotsUrl="$base/robots.txt"
$defaultSitemap="$base/sitemap.xml"

$rb=IW $robotsUrl 'GET' 20
$lines=@();if($rb.body){$lines=$rb.body -split "`r?`n"}
$robotsSitemaps=New-Object System.Collections.Generic.List[string]
$disallows=New-Object System.Collections.Generic.List[string]
$agents=@();$uaCont=$false
foreach($raw in $lines){
  $line=($raw -replace '\s+#.*$','').Trim();if(!$line){continue}
  if($line -match '^(?i)User-agent\s*:\s*(.+)$'){ $a=$Matches[1].Trim().ToLower(); if($uaCont){$agents+=$a}else{$agents=@($a)}; $uaCont=$true; continue }
  if($line -match '^(?i)Sitemap\s*:\s*(.+)$'){ $robotsSitemaps.Add($Matches[1].Trim()); $uaCont=$false; continue }
  if($line -match '^(?i)Disallow\s*:\s*(.*)$'){ $d=$Matches[1].Trim(); if($agents -contains '*'){$disallows.Add($d)}; $uaCont=$false; continue }
  $uaCont=$false
}

$seed=@($defaultSitemap)+@($robotsSitemaps.ToArray())|Where-Object{$_}|Select-Object -Unique
$q=New-Object System.Collections.Generic.Queue[string];$seed|ForEach-Object{$q.Enqueue($_)}
$visited=@{}
$fetchErr=New-Object System.Collections.Generic.List[string]
$rawEntries=New-Object System.Collections.Generic.List[object]
while($q.Count -gt 0){
  $sm=$q.Dequeue();if($visited.ContainsKey($sm)){continue};$visited[$sm]=$true
  $sr=IW $sm 'GET' 25
  if((!$sr.ok)-or(!$sr.body)){ $fetchErr.Add("$sm :: $($sr.code) :: $($sr.err)"); continue }
  try{$xml=[xml]$sr.body}catch{$fetchErr.Add("$sm :: XML parse failed");continue}
  $rootName='';try{$rootName=$xml.DocumentElement.LocalName}catch{}
  if($rootName -eq 'sitemapindex'){
    $xml.SelectNodes("//*[local-name()='sitemap']/*[local-name()='loc']") | ForEach-Object{ $u=$_.InnerText.Trim(); if($u){$q.Enqueue($u)} }
    continue
  }
  $urls=$xml.SelectNodes("//*[local-name()='url']")
  if(!$urls -or $urls.Count -eq 0){$fetchErr.Add("$sm :: unsupported structure");continue}
  foreach($u in $urls){
    $loc=$u.SelectSingleNode("*[local-name()='loc']");if(!$loc){continue}
    $lm=$u.SelectSingleNode("*[local-name()='lastmod']")
    $cf=$u.SelectSingleNode("*[local-name()='changefreq']")
    $pr=$u.SelectSingleNode("*[local-name()='priority']")
    $rawEntries.Add([pscustomobject]@{loc=$loc.InnerText.Trim();lastmod=if($lm){$lm.InnerText.Trim()}else{$null};changefreq=if($cf){$cf.InnerText.Trim()}else{$null};priority=if($pr){$pr.InnerText.Trim()}else{$null};source=$sm})
  }
}

$seen=@{}
$entries=New-Object System.Collections.Generic.List[object]
foreach($e in $rawEntries){if($e.loc -and -not $seen.ContainsKey($e.loc)){$seen[$e.loc]=$true;$entries.Add($e)}}
