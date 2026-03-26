$ErrorActionPreference = 'Stop'

function Get-RedirectChain {
    param([string]$StartUrl, [int]$MaxHops = 10)
    $results = @()
    $current = $StartUrl
    $errorText = $null
    for ($i = 0; $i -lt $MaxHops; $i++) {
        $resp = $null
        try {
            $req = [System.Net.HttpWebRequest]::Create($current)
            $req.Method = 'HEAD'
            $req.AllowAutoRedirect = $false
            $req.UserAgent = 'Mozilla/5.0 (Audit)'
            $resp = $req.GetResponse()
        } catch [System.Net.WebException] {
            if ($_.Exception.Response) { $resp = $_.Exception.Response } else { $errorText = $_.Exception.Message; break }
        }
        if (-not $resp) { break }
        $status = [int]$resp.StatusCode
        $location = $resp.Headers['Location']
        $results += [pscustomobject]@{ Url = $current; Status = $status; Location = $location }
        $resp.Close()
        if ($status -ge 300 -and $status -lt 400 -and $location) {
            $next = [uri]::new([uri]$current, $location).AbsoluteUri
            if ($next -eq $current) { break }
            $current = $next
        } else {
            break
        }
    }
    [pscustomobject]@{ Start = $StartUrl; Chain = $results; Final = $current; Error = $errorText }
}

function Get-HeaderValue {
    param($Headers, [string]$Name)
    $v = $Headers[$Name]
    if (-not $v) { $v = $Headers[$Name.ToLower()] }
    if ($v -is [System.Array]) { return ($v -join ', ') }
    return $v
}

$variants = @(
    'http://abdulrahmanazam.me/',
    'https://abdulrahmanazam.me/',
    'http://www.abdulrahmanazam.me/',
    'https://www.abdulrahmanazam.me/',
    'https://abdulrahmanazam.com/'
)

Write-Output '=== 1) Redirect behavior ==='
$redirects = @()
foreach ($u in $variants) {
    $r = Get-RedirectChain -StartUrl $u
    $redirects += $r
    Write-Output ("Start: {0}" -f $u)
    if ($r.Error) {
        Write-Output ("  ERROR: {0}" -f $r.Error)
    } else {
        foreach ($hop in $r.Chain) {
            Write-Output ("  {0} | {1} | Location: {2}" -f $hop.Url, $hop.Status, ($(if($hop.Location){$hop.Location}else{'-'})))
        }
        Write-Output ("  Final URL: {0}" -f $r.Final)
    }
    Write-Output ''
}

Write-Output '=== 2) Homepage HTML signals ==='
$home = Invoke-WebRequest -UseBasicParsing -Method Get -Uri 'https://abdulrahmanazam.me/'
$html = $home.Content
$canonical = ([regex]::Match($html, '<link[^>]*rel=["'"']canonical["'"'][^>]*href=["'"']([^"'"']+)', 'IgnoreCase')).Groups[1].Value
$metaRobots = ([regex]::Match($html, '<meta[^>]*name=["'"']robots["'"'][^>]*content=["'"']([^"'"']+)', 'IgnoreCase')).Groups[1].Value
$ogMatch = [regex]::Match($html, '<meta[^>]*(property|name)=["'"']og:url["'"'][^>]*content=["'"']([^"'"']+)', 'IgnoreCase')
$ogUrl = if ($ogMatch.Success) { $ogMatch.Groups[2].Value } else { '' }
$absUrls = [regex]::Matches($html, 'https?://[^\s"''<>]+', 'IgnoreCase') | ForEach-Object { $_.Value.TrimEnd('/','"','''') } | Select-Object -Unique
$internalAbs = $absUrls | Where-Object { $_ -match 'https?://(www\.)?abdulrahmanazam\.(me|com)(/|$)' }

Write-Output ("canonical: {0}" -f ($(if($canonical){$canonical}else{'(none)'})))
Write-Output ("meta robots: {0}" -f ($(if($metaRobots){$metaRobots}else{'(none)'})))
Write-Output ("og:url: {0}" -f ($(if($ogUrl){$ogUrl}else{'(none)'})))
Write-Output 'absolute internal .me/.com URLs in HTML:'
if ($internalAbs) { $internalAbs | ForEach-Object { Write-Output ("  {0}" -f $_) } } else { Write-Output '  (none)' }
Write-Output ''

Write-Output '=== 3) robots.txt ==='
$robotsResp = Invoke-WebRequest -UseBasicParsing -Method Get -Uri 'https://abdulrahmanazam.me/robots.txt'
$robotsText = $robotsResp.Content
Write-Output '-- full robots.txt --'
Write-Output $robotsText
$robotsLines = $robotsText -split "`r?`n" | Where-Object { $_.Trim() -and -not $_.Trim().StartsWith('#') }
$userAgents = $robotsLines | Where-Object { $_ -match '^\s*User-agent\s*:\s*(.+)$' } | ForEach-Object { $matches[1].Trim() }
$allowDisallow = $robotsLines | Where-Object { $_ -match '^\s*(Allow|Disallow)\s*:\s*(.*)$' }
$sitemaps = $robotsLines | Where-Object { $_ -match '^\s*Sitemap\s*:\s*(.+)$' } | ForEach-Object { $matches[1].Trim() }
Write-Output '-- parsed --'
Write-Output ("User-agent: {0}" -f ($(if($userAgents){$userAgents -join '; '}else{'(none)'})))
if ($allowDisallow) { $allowDisallow | ForEach-Object { Write-Output ("Directive: {0}" -f $_.Trim()) } } else { Write-Output 'Directive: (none)' }
if ($sitemaps) {
    foreach ($s in $sitemaps) {
        $host = ([uri]$s).Host
        $hostCheck = if ($host -ieq 'abdulrahmanazam.me') { 'matches live host' } else { 'does NOT match live host' }
        Write-Output ("Sitemap: {0} [{1}]" -f $s, $hostCheck)
    }
} else { Write-Output 'Sitemap: (none)' }
Write-Output ''

Write-Output '=== 4) sitemap.xml ==='
$sitemapResp = Invoke-WebRequest -UseBasicParsing -Method Get -Uri 'https://abdulrahmanazam.me/sitemap.xml'
$sitemapText = $sitemapResp.Content
$rootType = if ($sitemapText -match '<\s*sitemapindex\b') { 'sitemapindex' } elseif ($sitemapText -match '<\s*urlset\b') { 'urlset' } else { 'unknown' }
$locs = [regex]::Matches($sitemapText, '<loc>\s*([^<]+)\s*</loc>', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value.Trim() }
$first10 = $locs | Select-Object -First 10
$hosts = $locs | ForEach-Object { try { ([uri]$_).Host } catch { $null } } | Where-Object { $_ }
$meCount = ($hosts | Where-Object { $_ -match '\.me$' }).Count
$comCount = ($hosts | Where-Object { $_ -match '\.com$' }).Count
Write-Output ("type: {0}" -f $rootType)
Write-Output 'first 10 <loc>:'
if ($first10) { $first10 | ForEach-Object { Write-Output ("  {0}" -f $_) } } else { Write-Output '  (none)' }
Write-Output ("loc host counts: .me={0}; .com={1}; total={2}" -f $meCount, $comCount, $locs.Count)
if ($rootType -eq 'sitemapindex') {
    Write-Output 'referenced sitemap URLs status (first 10):'
    foreach ($s in $first10) {
        try {
            $h = Invoke-WebRequest -UseBasicParsing -Method Head -Uri $s -MaximumRedirection 5
            Write-Output ("  {0} -> {1}" -f $s, [int]$h.StatusCode)
        } catch {
            if ($_.Exception.Response) {
                Write-Output ("  {0} -> {1}" -f $s, [int]$_.Exception.Response.StatusCode)
            } else {
                Write-Output ("  {0} -> ERROR {1}" -f $s, $_.Exception.Message)
            }
        }
    }
} else {
    Write-Output 'referenced sitemap URLs: N/A (urlset)'
}
Write-Output ''

Write-Output '=== 5) Security/SEO headers (homepage GET) ==='
$wanted = @('Strict-Transport-Security','Content-Security-Policy','X-Frame-Options','X-Content-Type-Options','Referrer-Policy','Permissions-Policy','X-Robots-Tag','Cache-Control')
foreach ($h in $wanted) {
    $v = Get-HeaderValue -Headers $home.Headers -Name $h
    Write-Output ("{0}: {1}" -f $h, ($(if($v){$v}else{'(missing)'})))
}
Write-Output ''

Write-Output '=== 6) .me vs .com consolidation ==='
$comRedirect = $redirects | Where-Object { $_.Start -eq 'https://abdulrahmanazam.com/' } | Select-Object -First 1
Write-Output (".me canonical: {0}" -f ($(if($canonical){$canonical}else{'(none)'})))
if ($comRedirect.Error) {
    Write-Output (".com redirect check error: {0}" -f $comRedirect.Error)
} else {
    Write-Output (".com final URL: {0}" -f $comRedirect.Final)
}
$verdict = if ($comRedirect.Error) { '.com unavailable (DNS/error), cannot be indexable currently' } elseif ($comRedirect.Final -match 'abdulrahmanazam\.me') { 'Consolidates to .me via redirect' } elseif ($canonical -match '\.com') { '.me canonical points to .com' } else { 'No clear .com->.me consolidation detected' }
Write-Output ("Verdict: {0}" -f $verdict)
Write-Output ''

Write-Output '=== 7) Consistency check (.com references on .me live) ==='
$robotsHasCom = ($sitemaps | Where-Object { $_ -match 'abdulrahmanazam\.com' }).Count -gt 0
$robotsHasMe = ($sitemaps | Where-Object { $_ -match 'abdulrahmanazam\.me' }).Count -gt 0
$canonHasCom = $canonical -match 'abdulrahmanazam\.com'
$canonHasMe = $canonical -match 'abdulrahmanazam\.me'
Write-Output ("robots sitemap host: has .me={0}; has .com={1}" -f $robotsHasMe, $robotsHasCom)
Write-Output ("canonical host: has .me={0}; has .com={1}" -f $canonHasMe, $canonHasCom)
Write-Output ("sitemap <loc> host counts: .me={0}; .com={1}" -f $meCount, $comCount)
