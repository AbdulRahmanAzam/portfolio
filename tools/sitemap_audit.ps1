$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls11 -bor [Net.SecurityProtocolType]::Tls

$baseUrl = 'https://abdulrahmanazam.me'
$robotsUrl = "$baseUrl/robots.txt"
$sitemapSeedUrl = "$baseUrl/sitemap.xml"

function Normalize-UrlForCompare {
    param([string]$Url)
    if ([string]::IsNullOrWhiteSpace($Url)) { return $null }
    try {
        $uri = [uri]$Url
        $path = $uri.AbsolutePath.TrimEnd('/')
        if ([string]::IsNullOrWhiteSpace($path)) { $path = '/' }
        return ("{0}://{1}{2}{3}" -f $uri.Scheme.ToLowerInvariant(), $uri.Authority.ToLowerInvariant(), $path, $uri.Query)
    }
    catch {
        return $Url.TrimEnd('/')
    }
}

function Get-CanonicalUrl {
    param(
        [string]$Html,
        [string]$BaseUrl
    )
    if ([string]::IsNullOrWhiteSpace($Html)) { return $null }

    $linkTags = [regex]::Matches($Html, '<link\b[^>]*>', 'IgnoreCase')
    foreach ($match in $linkTags) {
        $tag = $match.Value
        $relMatch = [regex]::Match($tag, '\brel\s*=\s*("([^"]*)"|''([^'']*)''|([^\s>]+))', 'IgnoreCase')
        if (-not $relMatch.Success) { continue }

        $relValue = $relMatch.Groups[2].Value
        if (-not $relValue) { $relValue = $relMatch.Groups[3].Value }
        if (-not $relValue) { $relValue = $relMatch.Groups[4].Value }
        if (-not $relValue) { continue }

        $relTokens = $relValue.ToLowerInvariant().Split(@(' '), [System.StringSplitOptions]::RemoveEmptyEntries)
        if ($relTokens -notcontains 'canonical') { continue }

        $hrefMatch = [regex]::Match($tag, '\bhref\s*=\s*("([^"]*)"|''([^'']*)''|([^\s>]+))', 'IgnoreCase')
        if (-not $hrefMatch.Success) { continue }

        $hrefValue = $hrefMatch.Groups[2].Value
        if (-not $hrefValue) { $hrefValue = $hrefMatch.Groups[3].Value }
        if (-not $hrefValue) { $hrefValue = $hrefMatch.Groups[4].Value }
        $hrefValue = $hrefValue.Trim()
        if (-not $hrefValue) { continue }

        try {
            if ([uri]::IsWellFormedUriString($hrefValue, [System.UriKind]::Absolute)) {
                return ([uri]$hrefValue).AbsoluteUri
            }
            elseif ($BaseUrl) {
                return (New-Object System.Uri(([uri]$BaseUrl), $hrefValue)).AbsoluteUri
            }
            else {
                return $hrefValue
            }
        }
        catch {
            return $hrefValue
        }
    }

    return $null
}

function Convert-RobotsDisallowToRegex {
    param([string]$Pattern)
    $escaped = [regex]::Escape($Pattern).Replace('\\*', '.*')
    if ($escaped.EndsWith('\\$')) {
        $escaped = $escaped.Substring(0, $escaped.Length - 2) + '$'
    }
    else {
        $escaped += '.*'
    }
    return '^' + $escaped
}

Write-Output "Downloading robots and sitemap..."
$robotsRaw = (Invoke-WebRequest -Uri $robotsUrl -UseBasicParsing -Method Get -TimeoutSec 45).Content
$sitemapRaw = (Invoke-WebRequest -Uri $sitemapSeedUrl -UseBasicParsing -Method Get -TimeoutSec 45).Content

Set-Content -Path '.\\tools\\abdulrahmanazam_robots.txt' -Value $robotsRaw -Encoding UTF8
Set-Content -Path '.\\tools\\abdulrahmanazam_sitemap.xml' -Value $sitemapRaw -Encoding UTF8

$robotsLines = $robotsRaw -split "`r?`n"
$robotsSitemaps = New-Object 'System.Collections.Generic.List[string]'
$uaStarDisallow = New-Object 'System.Collections.Generic.List[string]'
$currentAgents = New-Object 'System.Collections.Generic.List[string]'
$inRuleBlock = $false

foreach ($rawLine in $robotsLines) {
    $line = ($rawLine -replace '#.*$', '').Trim()
    if ([string]::IsNullOrWhiteSpace($line)) {
        $currentAgents.Clear()
        $inRuleBlock = $false
        continue
    }
    if ($line -notmatch '^\s*([^:]+)\s*:\s*(.*)$') { continue }

    $key = $matches[1].Trim().ToLowerInvariant()
    $val = $matches[2].Trim()

    switch ($key) {
        'sitemap' {
            if ($val) { [void]$robotsSitemaps.Add($val) }
            continue
        }
        'user-agent' {
            if ($inRuleBlock) {
                $currentAgents.Clear()
                $inRuleBlock = $false
            }
            if ($val) { [void]$currentAgents.Add($val.ToLowerInvariant()) }
            continue
        }
        default {
            $inRuleBlock = $true
            if ($key -eq 'disallow' -and $currentAgents.Contains('*') -and $val -ne '') {
                [void]$uaStarDisallow.Add($val)
            }
        }
    }
}

$visitedSitemaps = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
$urlEntries = New-Object 'System.Collections.Generic.List[object]'
$deprecatedCounts = [ordered]@{ priority = 0; changefreq = 0 }

function Parse-Sitemap {
    param([string]$SitemapUrl)

    if ([string]::IsNullOrWhiteSpace($SitemapUrl)) { return }
    if (-not $visitedSitemaps.Add($SitemapUrl)) { return }

    try {
        $xmlText = (Invoke-WebRequest -Uri $SitemapUrl -UseBasicParsing -Method Get -TimeoutSec 45).Content
    }
    catch {
        Write-Warning ("Failed to fetch sitemap: {0} ({1})" -f $SitemapUrl, $_.Exception.Message)
        return
    }

    try {
        [xml]$xmlDoc = $xmlText
    }
    catch {
        Write-Warning ("Invalid XML in sitemap: {0}" -f $SitemapUrl)
        return
    }

    if (-not $xmlDoc.DocumentElement) { return }
    $rootName = $xmlDoc.DocumentElement.LocalName.ToLowerInvariant()

    if ($rootName -eq 'sitemapindex') {
        $childNodes = $xmlDoc.SelectNodes('//*[local-name()="sitemap"]')
        foreach ($node in $childNodes) {
            $locNode = $node.SelectSingleNode('./*[local-name()="loc"]')
            if ($locNode -and $locNode.InnerText) {
                Parse-Sitemap -SitemapUrl $locNode.InnerText.Trim()
            }
        }
    }
    elseif ($rootName -eq 'urlset') {
        $urlNodes = $xmlDoc.SelectNodes('//*[local-name()="url"]')
        foreach ($node in $urlNodes) {
            $locNode = $node.SelectSingleNode('./*[local-name()="loc"]')
            if (-not $locNode) { continue }
            $loc = $locNode.InnerText.Trim()
            if (-not $loc) { continue }

            $lastmodNode = $node.SelectSingleNode('./*[local-name()="lastmod"]')
            $lastmod = if ($lastmodNode) { $lastmodNode.InnerText.Trim() } else { $null }

            if ($node.SelectSingleNode('./*[local-name()="priority"]')) { $deprecatedCounts.priority++ }
            if ($node.SelectSingleNode('./*[local-name()="changefreq"]')) { $deprecatedCounts.changefreq++ }

            $urlHost = $null
            $scheme = $null
            try {
                $uri = [uri]$loc
                $urlHost = $uri.Host
                $scheme = $uri.Scheme
            }
            catch { }

            [void]$urlEntries.Add([pscustomobject]@{
                loc = $loc
                lastmod = $lastmod
                hasFragment = $loc.Contains('#')
                host = $urlHost
                scheme = $scheme
                sitemapSource = $SitemapUrl
            })
        }
    }
    else {
        Write-Warning ("Unsupported sitemap root node '{0}' in {1}" -f $rootName, $SitemapUrl)
    }
}

Write-Output "Parsing sitemap tree..."
Parse-Sitemap -SitemapUrl $sitemapSeedUrl

$uniqueEntries = $urlEntries | Group-Object -Property loc | ForEach-Object { $_.Group[0] }

$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AllowAutoRedirect = $true
$handler.AutomaticDecompression = [System.Net.DecompressionMethods]::GZip -bor [System.Net.DecompressionMethods]::Deflate
$client = New-Object System.Net.Http.HttpClient($handler)
$client.Timeout = [TimeSpan]::FromSeconds(45)
$client.DefaultRequestHeaders.UserAgent.ParseAdd('Mozilla/5.0 (PowerShell Sitemap Audit)')

$results = New-Object 'System.Collections.Generic.List[object]'

Write-Output "Validating URLs and extracting canonicals..."
foreach ($entry in $uniqueEntries) {
    $loc = $entry.loc
    $status = $null
    $finalUrl = $loc
    $contentType = $null
    $canonicalUrl = $null
    $canonicalHost = $null
    $canonicalMatch = $null
    $err = $null

    try {
        $response = $client.GetAsync($loc).Result
        $status = [int]$response.StatusCode
        if ($response.RequestMessage -and $response.RequestMessage.RequestUri) {
            $finalUrl = $response.RequestMessage.RequestUri.AbsoluteUri
        }
        if ($response.Content -and $response.Content.Headers -and $response.Content.Headers.ContentType) {
            $contentType = $response.Content.Headers.ContentType.MediaType
        }

        if ($contentType -and $contentType.ToLowerInvariant().StartsWith('text/html')) {
            $html = $response.Content.ReadAsStringAsync().Result
            $canonicalUrl = Get-CanonicalUrl -Html $html -BaseUrl $finalUrl
            if ($canonicalUrl) {
                try { $canonicalHost = ([uri]$canonicalUrl).Host } catch { $canonicalHost = $null }
                $canonicalMatch = (Normalize-UrlForCompare $canonicalUrl) -eq (Normalize-UrlForCompare $loc)
            }
            else {
                $canonicalMatch = $false
            }
        }

        $response.Dispose()
    }
    catch {
        $baseEx = $_.Exception
        if ($baseEx -is [System.AggregateException]) { $baseEx = $baseEx.GetBaseException() }
        $err = $baseEx.Message
        $status = -1
    }

    [void]$results.Add([pscustomobject]@{
        loc = $loc
        lastmod = $entry.lastmod
        hasFragment = $entry.hasFragment
        host = $entry.host
        scheme = $entry.scheme
        status = $status
        finalUrl = $finalUrl
        contentType = $contentType
        canonicalUrl = $canonicalUrl
        canonicalHost = $canonicalHost
        canonicalMatch = $canonicalMatch
        error = $err
    })
}

$client.Dispose()

$statusByCode = [ordered]@{}
$statusClass = [ordered]@{ '200' = 0; '3xx' = 0; '4xx' = 0; '5xx' = 0; other = 0 }

foreach ($r in $results) {
    $codeKey = [string]$r.status
    if (-not $statusByCode.Contains($codeKey)) { $statusByCode[$codeKey] = 0 }
    $statusByCode[$codeKey]++

    if ($r.status -eq 200) { $statusClass['200']++ }
    elseif ($r.status -ge 300 -and $r.status -lt 400) { $statusClass['3xx']++ }
    elseif ($r.status -ge 400 -and $r.status -lt 500) { $statusClass['4xx']++ }
    elseif ($r.status -ge 500 -and $r.status -lt 600) { $statusClass['5xx']++ }
    else { $statusClass['other']++ }
}

$redirectedUrls = $results | Where-Object {
    $_.finalUrl -and ((Normalize-UrlForCompare $_.loc) -ne (Normalize-UrlForCompare $_.finalUrl))
} | Select-Object @{n='loc';e={$_.loc}}, @{n='final';e={$_.finalUrl}}, status

$non200Urls = $results | Where-Object { $_.status -ne 200 } | Select-Object loc, status, finalUrl, error
$fragmentUrls = $results | Where-Object { $_.hasFragment } | Select-Object -ExpandProperty loc
$uniqueHosts = $uniqueEntries | Where-Object { $_.host } | Select-Object -ExpandProperty host -Unique | Sort-Object
$uniqueSchemes = $uniqueEntries | Where-Object { $_.scheme } | Select-Object -ExpandProperty scheme -Unique | Sort-Object

$canonicalHostMismatches = $results | Where-Object {
    $_.contentType -and $_.contentType.ToLowerInvariant().StartsWith('text/html') -and $_.canonicalUrl -and $_.host -and $_.canonicalHost -and ($_.host.ToLowerInvariant() -ne $_.canonicalHost.ToLowerInvariant())
} | Select-Object loc, canonicalUrl, host, canonicalHost

$canonicalMissing = $results | Where-Object {
    $_.contentType -and $_.contentType.ToLowerInvariant().StartsWith('text/html') -and -not $_.canonicalUrl
} | Select-Object -ExpandProperty loc

$missingLastmod = ($uniqueEntries | Where-Object { [string]::IsNullOrWhiteSpace($_.lastmod) }).Count
$presentLastmodValues = $uniqueEntries | Where-Object { -not [string]::IsNullOrWhiteSpace($_.lastmod) } | Select-Object -ExpandProperty lastmod
$uniqueLastmodValueCount = @($presentLastmodValues | Sort-Object -Unique).Count
$invalidLastmod = 0
$validLastmodDates = New-Object 'System.Collections.Generic.List[datetimeoffset]'

foreach ($lm in $presentLastmodValues) {
    $dto = [datetimeoffset]::MinValue
    if ([datetimeoffset]::TryParse($lm, [ref]$dto)) {
        [void]$validLastmodDates.Add($dto)
    }
    else {
        $invalidLastmod++
    }
}

$minLastmod = $null
$maxLastmod = $null
if ($validLastmodDates.Count -gt 0) {
    $orderedDates = $validLastmodDates | Sort-Object
    $minLastmod = $orderedDates[0].ToString('o')
    $maxLastmod = $orderedDates[$orderedDates.Count - 1].ToString('o')
}

$robotsSitemapsUnique = @($robotsSitemaps | Sort-Object -Unique)
$discoveredSitemaps = @($visitedSitemaps.ToArray() | Sort-Object)
$missingFromRobots = @($discoveredSitemaps | Where-Object { $robotsSitemapsUnique -notcontains $_ })

$robotsDisallowRules = @($uaStarDisallow | Sort-Object -Unique)
$disallowRegexList = foreach ($rule in $robotsDisallowRules) {
    [pscustomobject]@{ rule = $rule; regex = (Convert-RobotsDisallowToRegex $rule) }
}

$urlsDisallowedByRobots = New-Object 'System.Collections.Generic.List[object]'
foreach ($entry in $uniqueEntries) {
    try {
        $u = [uri]$entry.loc
        $pathAndQuery = $u.PathAndQuery
    }
    catch {
        continue
    }

    $matched = @()
    foreach ($ruleObj in $disallowRegexList) {
        if ($pathAndQuery -match $ruleObj.regex) {
            $matched += $ruleObj.rule
        }
    }

    if ($matched.Count -gt 0) {
        [void]$urlsDisallowedByRobots.Add([pscustomobject]@{
            loc = $entry.loc
            matchedRules = $matched
        })
    }
}

$summary = [ordered]@{
    totalUrls = $uniqueEntries.Count
    statusDistribution = [ordered]@{
        byClass = $statusClass
        byCode = $statusByCode
    }
    redirectedUrls = $redirectedUrls
    non200Urls = $non200Urls
    fragmentUrlList = $fragmentUrls
    uniqueHosts = $uniqueHosts
    uniqueSchemes = $uniqueSchemes
    canonicalHostMismatches = $canonicalHostMismatches
    canonicalMissing = $canonicalMissing
    lastmodStats = [ordered]@{
        missingCount = $missingLastmod
        invalidCount = $invalidLastmod
        uniqueValueCount = $uniqueLastmodValueCount
        minDate = $minLastmod
        maxDate = $maxLastmod
        allIdentical = ($presentLastmodValues.Count -gt 0 -and $uniqueLastmodValueCount -eq 1)
    }
    robots = [ordered]@{
        sitemapDirectives = $robotsSitemapsUnique
        userAgentStarDisallowRules = $robotsDisallowRules
        discoveredSitemaps = $discoveredSitemaps
        includesSeedSitemap = ($robotsSitemapsUnique -contains $sitemapSeedUrl)
        includesAllDiscoveredSitemaps = ($missingFromRobots.Count -eq 0)
        missingDiscoveredFromRobots = $missingFromRobots
    }
    urlsDisallowedByRobots = $urlsDisallowedByRobots
    deprecatedTagsPresent = [ordered]@{
        priorityCount = $deprecatedCounts.priority
        changefreqCount = $deprecatedCounts.changefreq
        priorityPresent = ($deprecatedCounts.priority -gt 0)
        changefreqPresent = ($deprecatedCounts.changefreq -gt 0)
    }
}

Write-Output "=== SITEMAP_AUDIT_SUMMARY_JSON ==="
$summary | ConvertTo-Json -Depth 8


