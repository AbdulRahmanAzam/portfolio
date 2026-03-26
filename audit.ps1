$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$sitemapUrl = 'https://abdulrahmanazam.me/sitemap.xml'
Write-Output "Sitemap: $sitemapUrl"

$sm = Invoke-WebRequest -Uri $sitemapUrl -UseBasicParsing -MaximumRedirection 10 -TimeoutSec 30
$locs = [regex]::Matches([string]$sm.Content, '<loc>\s*([^<]+?)\s*</loc>', 'IgnoreCase') |
    ForEach-Object { $_.Groups[1].Value.Trim() } |
    Where-Object { $_ } |
    Select-Object -Unique -First 30

Write-Output "URL list (count=$($locs.Count)):"
$locs | ForEach-Object { Write-Output $_ }

$stats = [ordered]@{
    Crawled     = 0
    Low         = 0
    Medium      = 0
    Strong      = 0
    MissingMeta = 0
    MissingH1   = 0
    WithSchema  = 0
}

Write-Output "Per-URL metrics:"
foreach ($u in $locs) {
    try {
        $r = Invoke-WebRequest -Uri $u -UseBasicParsing -MaximumRedirection 10 -TimeoutSec 30
        $html = [string]$r.Content
        $status = [int]$r.StatusCode

        $titleMatch = [regex]::Match($html, '<title[^>]*>([\s\S]*?)</title>', 'IgnoreCase')
        $title = if ($titleMatch.Success) { ($titleMatch.Groups[1].Value -replace '\s+', ' ').Trim() } else { '' }

        $metaMatch = [regex]::Match($html, '<meta[^>]+name=["'']description["''][^>]*content=["'']([\s\S]*?)["'']', 'IgnoreCase')
        if (-not $metaMatch.Success) {
            $metaMatch = [regex]::Match($html, '<meta[^>]+content=["'']([\s\S]*?)["''][^>]*name=["'']description["'']', 'IgnoreCase')
        }
        $metaLen = if ($metaMatch.Success) { ($metaMatch.Groups[1].Value.Trim()).Length } else { 0 }

        $h1Count = ([regex]::Matches($html, '<h1\b', 'IgnoreCase')).Count
        $h2Count = ([regex]::Matches($html, '<h2\b', 'IgnoreCase')).Count

        $clean = $html -replace '(?is)<script\b[^>]*>.*?</script>', ' '
        $clean = $clean -replace '(?is)<style\b[^>]*>.*?</style>', ' '
        $clean = $clean -replace '(?is)<noscript\b[^>]*>.*?</noscript>', ' '
        $clean = $clean -replace '(?is)<[^>]+>', ' '
        $clean = [System.Net.WebUtility]::HtmlDecode($clean)
        $words = ([regex]::Matches($clean, '\b[\p{L}\p{N}\-_]+\b')).Count

        $hasSchema  = [regex]::IsMatch($html, '<script[^>]+type=["'']application/ld\+json["'']', 'IgnoreCase')
        $hasContact = [regex]::IsMatch($html, 'contact|e-?mail|@|phone|tel:|address|whatsapp', 'IgnoreCase')
        $hasTrust   = [regex]::IsMatch($html, 'privacy|terms|disclaimer|cookie', 'IgnoreCase')
        $hasFresh   = [regex]::IsMatch($html, '<time\b|20\d{2}', 'IgnoreCase')

        $stats.Crawled++
        if ($words -lt 300) { $stats.Low++ } elseif ($words -lt 800) { $stats.Medium++ } else { $stats.Strong++ }
        if ($metaLen -eq 0) { $stats.MissingMeta++ }
        if ($h1Count -eq 0) { $stats.MissingH1++ }
        if ($hasSchema) { $stats.WithSchema++ }

        $titleShort = $title -replace '\|', '/'
        if ($titleShort.Length -gt 70) { $titleShort = $titleShort.Substring(0, 70) + '…' }

        Write-Output ("{0} | sc={1} | title='{2}' | md={3} | h1={4} | h2={5} | w={6} | schema={7} | contact={8} | trust={9} | fresh={10}" -f $u, $status, $titleShort, $metaLen, $h1Count, $h2Count, $words, [int]$hasSchema, [int]$hasContact, [int]$hasTrust, [int]$hasFresh)
    }
    catch {
        Write-Output ("ERROR | {0} | {1}" -f $u, $_.Exception.Message)
    }
}

Write-Output "Aggregate:"
Write-Output ("pages crawled={0}; low(<300)={1}; medium(300-799)={2}; strong(800+)={3}; missing meta description={4}; missing h1={5}; pages with schema={6}" -f $stats.Crawled, $stats.Low, $stats.Medium, $stats.Strong, $stats.MissingMeta, $stats.MissingH1, $stats.WithSchema)
