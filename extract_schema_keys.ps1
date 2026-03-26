$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$url = 'https://abdulrahmanazam.me/'
$response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 30
$html = $response.Content

$pattern = "<script[^>]*type\s*=\s*['`"]application/ld\+json['`"]([^>]*)>([\s\S]*?)</script>"
$matches = [regex]::Matches($html, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

$lines = @()
$lines += ('URL=' + $url)
$lines += ('STATUS=' + [int]$response.StatusCode)
$lines += ('BLOCK_COUNT=' + $matches.Count)

for ($i = 0; $i -lt $matches.Count; $i++) {
    $raw = $matches[$i].Groups[2].Value.Trim()
    $compact = ($raw -replace '\s+', ' ')
    if ($compact.Length -gt 500) { $compact = $compact.Substring(0,500) + '...' }

    $lines += ('BLOCK=' + ($i + 1))
    $lines += ('RAW_PREVIEW=' + $compact)

    try {
        $j = $raw | ConvertFrom-Json
        if ($j -is [array]) {
            $entities = $j
        } elseif ($j.PSObject.Properties['@graph']) {
            $entities = @($j.'@graph')
        } else {
            $entities = @($j)
        }

        $eIndex = 0
        foreach ($e in $entities) {
            $eIndex++
            $ctx = if ($e.PSObject.Properties['@context']) { $e.'@context' } else { '' }
            $type = if ($e.PSObject.Properties['@type']) { $e.'@type' } else { '' }
            $keys = ($e.PSObject.Properties.Name -join ',')
            $lines += ('ENTITY=' + $eIndex + ';CONTEXT=' + $ctx + ';TYPE=' + $type + ';KEYS=' + $keys)
        }
    }
    catch {
        $lines += ('PARSE_ERROR=' + $_.Exception.Message)
    }

    $lines += ''
}

$outPath = Join-Path (Get-Location) 'schema_keys_output.txt'
$lines | Set-Content -Path $outPath -Encoding UTF8
Write-Output ('WROTE=' + $outPath)
