$ErrorActionPreference = 'Stop'

$urls = @(
  'https://abdulrahmanazam.me/',
  'https://abdulrahmanazam.com/',
  'https://abdulrahmanazam.me/robots.txt',
  'https://abdulrahmanazam.com/robots.txt',
  'https://abdulrahmanazam.me/llms.txt',
  'https://abdulrahmanazam.com/llms.txt',
  'https://abdulrahmanazam.me/sitemap.xml',
  'https://abdulrahmanazam.com/sitemap.xml'
)

Write-Output '=== 1) GET fetch checks ==='
foreach ($u in $urls) {
  try {
    $r = Invoke-WebRequest -UseBasicParsing -Method Get -Uri $u -MaximumRedirection 10
    $final = $r.BaseResponse.ResponseUri.AbsoluteUri
    $ct = $r.Headers['Content-Type']
    $cl = $r.Headers['Content-Length']
    if (-not $cl) {
      $cl = $r.RawContentLength
      if (-not $cl -or [int64]$cl -lt 0) { $cl = ($r.Content | Out-String).Length }
    }
    Write-Output ("URL: {0}" -f $u)
    Write-Output ("Status: {0}" -f [int]$r.StatusCode)
    Write-Output ("FinalURI: {0}" -f $final)
    Write-Output ("Content-Type: {0}" -f $ct)
    Write-Output ("Content-Length: {0}" -f $cl)
    Write-Output ''
  } catch {
    $resp = $_.Exception.Response
    if ($resp) {
      $status = [int]$resp.StatusCode
      $final = $resp.ResponseUri.AbsoluteUri
      $ct = $resp.Headers['Content-Type']
      $cl = $resp.Headers['Content-Length']
      Write-Output ("URL: {0}" -f $u)
      Write-Output ("Status: {0}" -f $status)
      Write-Output ("FinalURI: {0}" -f $final)
      Write-Output ("Content-Type: {0}" -f $ct)
      Write-Output ("Content-Length: {0}" -f $cl)
      Write-Output ''
    } else {
      Write-Output ("URL: {0}" -f $u)
      Write-Output ("Error: {0}" -f $_.Exception.Message)
      Write-Output ''
    }
  }
}

function Get-FirstMatchValue {
  param([string]$Text,[string]$Pattern,[int]$Group = 1)
  $opts = [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline
  $m = [regex]::Match($Text,$Pattern,$opts)
  if ($m.Success) { return $m.Groups[$Group].Value.Trim() }
  return $null
}

function Analyze-Home {
  param([string]$Url)
  $r = Invoke-WebRequest -UseBasicParsing -Method Get -Uri $Url -MaximumRedirection 10
  $html = [string]$r.Content

  $title = Get-FirstMatchValue -Text $html -Pattern '<title[^>]*>(.*?)</title>'

  $metaDesc = Get-FirstMatchValue -Text $html -Pattern '<meta[^>]*name\s*=\s*["'']description["''][^>]*content\s*=\s*["''](.*?)["''][^>]*>'
  if (-not $metaDesc) { $metaDesc = Get-FirstMatchValue -Text $html -Pattern '<meta[^>]*content\s*=\s*["''](.*?)["''][^>]*name\s*=\s*["'']description["''][^>]*>' }

  $canonical = Get-FirstMatchValue -Text $html -Pattern '<link[^>]*rel\s*=\s*["''][^"'']*canonical[^"'']*["''][^>]*href\s*=\s*["''](.*?)["''][^>]*>'
  if (-not $canonical) { $canonical = Get-FirstMatchValue -Text $html -Pattern '<link[^>]*href\s*=\s*["''](.*?)["''][^>]*rel\s*=\s*["''][^"'']*canonical[^"'']*["''][^>]*>' }

  $ogUrl = Get-FirstMatchValue -Text $html -Pattern '<meta[^>]*property\s*=\s*["'']og:url["''][^>]*content\s*=\s*["''](.*?)["''][^>]*>'
  if (-not $ogUrl) { $ogUrl = Get-FirstMatchValue -Text $html -Pattern '<meta[^>]*content\s*=\s*["''](.*?)["''][^>]*property\s*=\s*["'']og:url["''][^>]*>' }

  $pubTime = Get-FirstMatchValue -Text $html -Pattern '<meta[^>]*property\s*=\s*["'']article:published_time["''][^>]*content\s*=\s*["''](.*?)["''][^>]*>'
  if (-not $pubTime) { $pubTime = Get-FirstMatchValue -Text $html -Pattern '<meta[^>]*content\s*=\s*["''](.*?)["''][^>]*property\s*=\s*["'']article:published_time["''][^>]*>' }

  $jsonLdCount = [regex]::Matches($html,'<script[^>]*type\s*=\s*["'']application/ld\+json["''][^>]*>',[System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count

  $hasRoot = [regex]::IsMatch($html,'id\s*=\s*["'']root["'']',[System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  $hasNext = [regex]::IsMatch($html,'id\s*=\s*["'']__next["'']',[System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  $hasReactRoot = [regex]::IsMatch($html,'data-reactroot',[System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

  $scriptCount = [regex]::Matches($html,'<script\b',[System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
  $pCount = [regex]::Matches($html,'<p\b',[System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
  $ratio = if ($pCount -eq 0) { 'Infinity' } else { ('{0:N2}' -f ($scriptCount / [double]$pCount)) }

  $domainPattern = '(wikipedia\.org|reddit\.com|youtube\.com|linkedin\.com|github\.com)'
  $hrefMatches = [regex]::Matches($html,'<a\b[^>]*href\s*=\s*["'']([^"'']+)["'']',[System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  $outLinks = @()
  foreach ($m in $hrefMatches) {
    $h = $m.Groups[1].Value
    if ($h -match $domainPattern) { $outLinks += $h }
  }
  $outLinks = $outLinks | Sort-Object -Unique

  return [PSCustomObject]@{
    RequestedUrl = $Url
    FinalUri = $r.BaseResponse.ResponseUri.AbsoluteUri
    Host = $r.BaseResponse.ResponseUri.Host
    Title = $title
    MetaDescription = $metaDesc
    Canonical = $canonical
    OgUrl = $ogUrl
    ArticlePublishedTime = $pubTime
    JsonLdCount = $jsonLdCount
    HasRoot = $hasRoot
    HasNext = $hasNext
    HasDataReactRoot = $hasReactRoot
    ScriptCount = $scriptCount
    ParagraphCount = $pCount
    ScriptToPRatio = $ratio
    OutboundLinks = $outLinks
  }
}

Write-Output '=== 2) Homepage HTML signals ==='
$homeUrls = @('https://abdulrahmanazam.me/','https://abdulrahmanazam.com/')
$homeData = @()
foreach ($h in $homeUrls) {
  try {
    $d = Analyze-Home -Url $h
    $homeData += $d
    Write-Output ("Homepage: {0}" -f $d.RequestedUrl)
    Write-Output ("FinalURI: {0}" -f $d.FinalUri)
    Write-Output ("Title: {0}" -f $d.Title)
    Write-Output ("MetaDescription: {0}" -f $d.MetaDescription)
    Write-Output ("Canonical: {0}" -f $d.Canonical)
    Write-Output ("og:url: {0}" -f $d.OgUrl)
    Write-Output ("article:published_time: {0}" -f $(if($d.ArticlePublishedTime){$d.ArticlePublishedTime}else{'(not present)'}))
    Write-Output ("JSON-LD script count: {0}" -f $d.JsonLdCount)
    Write-Output ("SPA markers => id=root:{0}, id=__next:{1}, data-reactroot:{2}" -f $d.HasRoot,$d.HasNext,$d.HasDataReactRoot)
    Write-Output ("script tags: {0}; p tags: {1}; script:p ratio: {2}" -f $d.ScriptCount,$d.ParagraphCount,$d.ScriptToPRatio)
    Write-Output ''
  } catch {
    Write-Output ("Homepage: {0}" -f $h)
    Write-Output ("Error: {0}" -f $_.Exception.Message)
    Write-Output ''
  }
}

Write-Output '=== 3) Outbound links (distinct) ==='
$allOutbound = @()
foreach ($d in $homeData) { $allOutbound += $d.OutboundLinks }
$allOutbound = $allOutbound | Sort-Object -Unique
if ($allOutbound.Count -eq 0) {
  Write-Output '(none found matching wikipedia/reddit/youtube/linkedin/github)'
} else {
  $allOutbound | ForEach-Object { Write-Output $_ }
}
Write-Output ''

$canonicalHosts = $homeData | ForEach-Object { $_.Host } | Sort-Object -Unique
$bots = @('GPTBot','OAI-SearchBot','ClaudeBot','PerplexityBot','CCBot','anthropic-ai','cohere-ai')

Write-Output '=== 4) robots.txt on final canonical domain(s) ==='
foreach ($domainHost in $canonicalHosts) {
  $robotsUrl = "https://$domainHost/robots.txt"
  Write-Output ("Robots URL: {0}" -f $robotsUrl)
  try {
    $rr = Invoke-WebRequest -UseBasicParsing -Method Get -Uri $robotsUrl -MaximumRedirection 10
    $content = [string]$rr.Content
    Write-Output '--- robots.txt content begin ---'
    Write-Output $content
    Write-Output '--- robots.txt content end ---'
    Write-Output 'User-agent directive presence:'
    foreach ($b in $bots) {
      $exists = [regex]::IsMatch($content,"(?im)^\s*User-agent\s*:\s*$([regex]::Escape($b))\s*$")
      Write-Output ("{0}: {1}" -f $b, $(if($exists){'YES'}else{'NO'}))
    }
  } catch {
    Write-Output ("Error fetching robots.txt: {0}" -f $_.Exception.Message)
  }
  Write-Output ''
}

Write-Output '=== 5) llms.txt first 80 lines ==='
foreach ($domainHost in $canonicalHosts) {
  $llmsUrl = "https://$domainHost/llms.txt"
  Write-Output ("LLMS URL: {0}" -f $llmsUrl)
  try {
    $lr = Invoke-WebRequest -UseBasicParsing -Method Get -Uri $llmsUrl -MaximumRedirection 10
    $lines = ([string]$lr.Content) -split "`r?`n"
    $take = [Math]::Min(80, $lines.Count)
    if ($take -gt 0) {
      0..($take-1) | ForEach-Object { Write-Output ("{0,3}: {1}" -f ($_ + 1), $lines[$_]) }
    } else {
      Write-Output '(file empty)'
    }
  } catch {
    if ($_.Exception.Response -and [int]$_.Exception.Response.StatusCode -eq 404) {
      Write-Output 'missing (404)'
    } else {
      Write-Output ("missing/error: {0}" -f $_.Exception.Message)
    }
  }
  Write-Output ''
}


