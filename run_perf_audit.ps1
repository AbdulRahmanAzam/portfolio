$ErrorActionPreference = 'Stop'
$url = 'https://abdulrahmanazam.me/'

function Get-CruxSummary {
    param($LoadingExperience)
    if (-not $LoadingExperience) { return $null }
    $keys = @('LARGEST_CONTENTFUL_PAINT_MS','CUMULATIVE_LAYOUT_SHIFT_SCORE','INTERACTION_TO_NEXT_PAINT','INTERACTION_TO_NEXT_PAINT_MS')
    $metrics = [ordered]@{}
    foreach ($k in $keys) {
        if ($LoadingExperience.metrics.$k) {
            $m = $LoadingExperience.metrics.$k
            $metrics[$k] = [ordered]@{
                category   = $m.category
                percentile = $m.percentile
            }
        }
    }
    [ordered]@{
        overall_category = $LoadingExperience.overall_category
        metrics          = $metrics
    }
}

function Get-PSISummary {
    param([string]$Strategy)
    $api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$([uri]::EscapeDataString($url))&strategy=$Strategy"
    $r = Invoke-RestMethod -Uri $api -Method Get
    $lr = $r.lighthouseResult

    $metricKeys = @('first-contentful-paint','largest-contentful-paint','speed-index','total-blocking-time','cumulative-layout-shift','interaction-to-next-paint')
    $metrics = [ordered]@{}
    foreach ($k in $metricKeys) {
        if ($lr.audits.$k) {
            $a = $lr.audits.$k
            $metrics[$k] = [ordered]@{
                displayValue = $a.displayValue
                numericValue = $a.numericValue
                score        = $a.score
            }
        }
    }

    $opps = $lr.audits.PSObject.Properties | ForEach-Object {
        $id = $_.Name
        $a = $_.Value
        $savings = $null
        if ($a.details -and $null -ne $a.details.overallSavingsMs) {
            $savings = [double]$a.details.overallSavingsMs
        } elseif ($a.details -and $null -ne $a.details.overallSavingsBytes) {
            $savings = [double]$a.details.overallSavingsBytes
        } elseif ($null -ne $a.numericValue -and $a.numericUnit -eq 'millisecond') {
            $savings = [double]$a.numericValue
        }

        if ($null -ne $savings -and $savings -gt 0) {
            [pscustomobject]@{
                id       = $id
                title    = $a.title
                savings  = [math]::Round($savings,2)
                unit     = if ($a.details -and $null -ne $a.details.overallSavingsBytes -and $null -eq $a.details.overallSavingsMs) { 'bytes' } else { 'ms' }
            }
        }
    } | Sort-Object savings -Descending | Select-Object -First 5

    [ordered]@{
        strategy                = $Strategy
        performanceScore        = [int][math]::Round($lr.categories.performance.score * 100)
        metrics                 = $metrics
        loadingExperience       = Get-CruxSummary -LoadingExperience $r.loadingExperience
        originLoadingExperience = Get-CruxSummary -LoadingExperience $r.originLoadingExperience
        topOpportunities        = $opps
    }
}

$mobile = Get-PSISummary -Strategy 'mobile'
$desktop = Get-PSISummary -Strategy 'desktop'

$timings = for ($i = 1; $i -le 3; $i++) {
    $out = curl.exe -o NUL -s -w "dns:%{time_namelookup}`nconnect:%{time_connect}`nssl:%{time_appconnect}`nttfb:%{time_starttransfer}`ntotal:%{time_total}`nbytes:%{size_download}`n" $url
    $obj = @{}
    foreach ($line in ($out -split "`n")) {
        if ($line -match ':') {
            $kv = $line.Split(':',2)
            $obj[$kv[0]] = [double]$kv[1]
        }
    }
    [pscustomobject]@{
        run     = $i
        dns     = $obj['dns']
        connect = $obj['connect']
        ssl     = $obj['ssl']
        ttfb    = $obj['ttfb']
        total   = $obj['total']
        bytes   = $obj['bytes']
    }
}

$ttfbSorted = $timings.ttfb | Sort-Object
$totalSorted = $timings.total | Sort-Object

$timingSummary = [ordered]@{
    runs = $timings
    ttfb = [ordered]@{
        min    = $ttfbSorted[0]
        median = $ttfbSorted[1]
        max    = $ttfbSorted[2]
    }
    total = [ordered]@{
        min    = $totalSorted[0]
        median = $totalSorted[1]
        max    = $totalSorted[2]
    }
}

$resp = Invoke-WebRequest -Uri $url -UseBasicParsing
$html = $resp.Content
$baseUri = [uri]$url

$complexity = [ordered]@{
    htmlBytes       = [System.Text.Encoding]::UTF8.GetByteCount($html)
    scriptTags      = ([regex]::Matches($html, '<script\\b', 'IgnoreCase')).Count
    stylesheetLinks = ([regex]::Matches($html, '<link\\b[^>]*rel\\s*=\\s*["'']?stylesheet', 'IgnoreCase')).Count
    imgTags         = ([regex]::Matches($html, '<img\\b', 'IgnoreCase')).Count
    iframeTags      = ([regex]::Matches($html, '<iframe\\b', 'IgnoreCase')).Count
}

$matches = [regex]::Matches($html, '(?:src|href)\\s*=\\s*["'']([^"'']+)["'']', 'IgnoreCase')
$hosts = New-Object System.Collections.Generic.HashSet[string]
foreach ($m in $matches) {
    $ref = $m.Groups[1].Value.Trim()
    if (-not $ref -or $ref.StartsWith('#') -or $ref.StartsWith('mailto:') -or $ref.StartsWith('tel:') -or $ref.StartsWith('javascript:')) { continue }
    if ($ref.StartsWith('//')) { $ref = "$($baseUri.Scheme):$ref" }
    try {
        $u = [uri]::new($baseUri, $ref)
        if ($u.Scheme -notin @('http','https')) { continue }
        $host = $u.Host.ToLowerInvariant()
        $baseHost = $baseUri.Host.ToLowerInvariant()
        if ($host -eq $baseHost -or $host.EndsWith(".$baseHost")) { continue }
        [void]$hosts.Add($host)
    } catch {}
}
$complexity['thirdPartyHosts'] = @($hosts | Sort-Object)

$head = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing
$headSignals = [ordered]@{
    contentEncoding = $head.Headers['content-encoding']
    cacheControl    = $head.Headers['cache-control']
    etag            = $head.Headers['etag']
    lastModified    = $head.Headers['last-modified']
    server          = $head.Headers['server']
}

$result = [ordered]@{
    pagespeed      = [ordered]@{ mobile = $mobile; desktop = $desktop }
    networkTiming  = $timingSummary
    pageComplexity = $complexity
    headSignals    = $headSignals
}

$result | ConvertTo-Json -Depth 12 | Set-Content -Path '.\\perf_audit_result.json' -Encoding UTF8
Get-Content '.\\perf_audit_result.json'
