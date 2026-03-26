$ErrorActionPreference = 'Stop'

function Get-ValueSummary {
    param([object]$Value)
    if ($null -eq $Value) { return '' }

    if ($Value -is [string]) {
        $s = $Value.Trim()
        if ($s.Length -gt 240) { return $s.Substring(0,240) + '...' }
        return $s
    }

    if (($Value -is [System.Collections.IEnumerable]) -and -not ($Value -is [string])) {
        $arr = @($Value)
        $preview = @()
        foreach ($item in $arr | Select-Object -First 3) {
            $preview += (Get-ValueSummary -Value $item)
        }
        return ('array[' + $arr.Count + ']: ' + ($preview -join ' | '))
    }

    if ($Value -is [pscustomobject] -or $Value -is [hashtable]) {
        $keyVals = @()
        foreach ($k in '@type','name','url','@id') {
            try {
                $v = $Value.$k
                if ($null -ne $v -and (Get-ValueSummary $v) -ne '') {
                    $keyVals += ($k + '=' + (Get-ValueSummary $v))
                }
            } catch {}
        }
        if ($keyVals.Count -gt 0) { return ($keyVals -join '; ') }
        try { return (($Value | ConvertTo-Json -Compress -Depth 4)) } catch { return '[object]' }
    }

    return [string]$Value
}

function New-FieldSummary {
    param([object]$Entity,[string]$FieldName)

    $fieldValue = $null
    $present = $false

    if ($Entity -is [pscustomobject] -or $Entity -is [hashtable]) {
        $prop = $Entity.PSObject.Properties[$FieldName]
        if ($null -ne $prop) {
            $present = $true
            $fieldValue = $prop.Value
        }
    }

    $valueSummary = ''
    if ($present) {
        $valueSummary = Get-ValueSummary -Value $fieldValue
    }

    return [pscustomobject]@{
        present = $present
        valueSummary = $valueSummary
    }
}

function Add-EntitiesFromJsonLd {
    param(
        [object]$Node,
        [int]$BlockIndex,
        [ref]$Collector
    )

    if ($null -eq $Node) { return }

    if (($Node -is [System.Collections.IEnumerable]) -and -not ($Node -is [string]) -and -not ($Node -is [pscustomobject]) -and -not ($Node -is [hashtable])) {
        foreach ($item in $Node) {
            Add-EntitiesFromJsonLd -Node $item -BlockIndex $BlockIndex -Collector $Collector
        }
        return
    }

    if ($Node -is [pscustomobject] -or $Node -is [hashtable]) {
        $graphProp = $Node.PSObject.Properties['@graph']
        if ($null -ne $graphProp -and $null -ne $graphProp.Value) {
            Add-EntitiesFromJsonLd -Node $graphProp.Value -BlockIndex $BlockIndex -Collector $Collector
            return
        }

        $Collector.Value += [pscustomobject]@{
            blockIndex = $BlockIndex
            raw = $Node
        }
        return
    }
}

function Count-AttributeMatches {
    param([string]$Html,[string]$Pattern)
    return ([regex]::Matches($Html,$Pattern,'IgnoreCase')).Count
}

$url = 'https://abdulrahmanazam.me/'
$response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 30
$html = $response.Content

$jsonLdPattern = "<script[^>]*type\s*=\s*['`"]application/ld\+json['`"][^>]*>([\s\S]*?)</script>"
$matches = [regex]::Matches($html,$jsonLdPattern,'IgnoreCase')

$parsedBlocks = @()
$parseErrors = @()
$entityCollector = @()

for ($i = 0; $i -lt $matches.Count; $i++) {
    $blockIndex = $i + 1
    $rawJson = $matches[$i].Groups[1].Value.Trim()

    $blockRecord = [pscustomobject]@{
        blockIndex = $blockIndex
        parseSuccess = $false
        rawLength = $rawJson.Length
        error = ''
    }

    try {
        $parsed = $rawJson | ConvertFrom-Json
        $blockRecord.parseSuccess = $true
        Add-EntitiesFromJsonLd -Node $parsed -BlockIndex $blockIndex -Collector ([ref]$entityCollector)
    }
    catch {
        $snippet = $rawJson
        if ($rawJson.Length -gt 300) {
            $snippet = $rawJson.Substring(0,300) + '...'
        }
        $blockRecord.error = $_.Exception.Message
        $parseErrors += [pscustomobject]@{
            blockIndex = $blockIndex
            error = $_.Exception.Message
            rawSnippet = $snippet
        }
    }

    $parsedBlocks += $blockRecord
}

$entities = @()
$entityCounter = 0
foreach ($entry in $entityCollector) {
    $entityCounter++
    $node = $entry.raw

    $typeVal = $null
    if ($node.PSObject.Properties['@type']) { $typeVal = $node.'@type' }
    $nameVal = $null
    if ($node.PSObject.Properties['name']) { $nameVal = $node.name }
    $urlVal = $null
    if ($node.PSObject.Properties['url']) { $urlVal = $node.url }
    $sameAsVal = $null
    if ($node.PSObject.Properties['sameAs']) { $sameAsVal = $node.sameAs }

    $entities += [pscustomobject]@{
        entityIndex = $entityCounter
        blockIndex = $entry.blockIndex
        atType = (Get-ValueSummary -Value $typeVal)
        name = (Get-ValueSummary -Value $nameVal)
        url = (Get-ValueSummary -Value $urlVal)
        sameAs = (Get-ValueSummary -Value $sameAsVal)
        fields = [pscustomobject]@{
            image = (New-FieldSummary -Entity $node -FieldName 'image')
            description = (New-FieldSummary -Entity $node -FieldName 'description')
            inLanguage = (New-FieldSummary -Entity $node -FieldName 'inLanguage')
            mainEntityOfPage = (New-FieldSummary -Entity $node -FieldName 'mainEntityOfPage')
            breadcrumb = (New-FieldSummary -Entity $node -FieldName 'breadcrumb')
            potentialAction = (New-FieldSummary -Entity $node -FieldName 'potentialAction')
            author = (New-FieldSummary -Entity $node -FieldName 'author')
            publisher = (New-FieldSummary -Entity $node -FieldName 'publisher')
        }
    }
}

$microdataCounts = [ordered]@{
    itemscope = (Count-AttributeMatches -Html $html -Pattern '\bitemscope(\s*=\s*("[^"]*"|''[^'']*''|[^\s>]+))?')
    itemtype = (Count-AttributeMatches -Html $html -Pattern '\bitemtype\s*=')
    itemprop = (Count-AttributeMatches -Html $html -Pattern '\bitemprop\s*=')
    itemid = (Count-AttributeMatches -Html $html -Pattern '\bitemid\s*=')
    itemref = (Count-AttributeMatches -Html $html -Pattern '\bitemref\s*=')
}

$rdfaCounts = [ordered]@{
    vocab = (Count-AttributeMatches -Html $html -Pattern '\bvocab\s*=')
    typeof = (Count-AttributeMatches -Html $html -Pattern '\btypeof\s*=')
    property = (Count-AttributeMatches -Html $html -Pattern '\bproperty\s*=')
    resource = (Count-AttributeMatches -Html $html -Pattern '\bresource\s*=')
    about = (Count-AttributeMatches -Html $html -Pattern '\babout\s*=')
    rel = (Count-AttributeMatches -Html $html -Pattern '\brel\s*=')
    rev = (Count-AttributeMatches -Html $html -Pattern '\brev\s*=')
    content = (Count-AttributeMatches -Html $html -Pattern '\bcontent\s*=')
    datatype = (Count-AttributeMatches -Html $html -Pattern '\bdatatype\s*=')
    prefix = (Count-AttributeMatches -Html $html -Pattern '\bprefix\s*=')
}

$report = [pscustomobject]@{
    targetUrl = $url
    fetchedAtUtc = [DateTime]::UtcNow.ToString('o')
    httpStatusCode = [int]$response.StatusCode
    htmlLength = $html.Length
    jsonLdScriptBlockCount = $matches.Count
    parsedBlockCount = (@($parsedBlocks | Where-Object { $_.parseSuccess }).Count)
    parseErrorCount = $parseErrors.Count
    parseErrors = $parseErrors
    blocks = $parsedBlocks
    entityCount = $entities.Count
    entities = $entities
    microdataAttributeCounts = $microdataCounts
    rdfaLikeAttributeCounts = $rdfaCounts
}

$jsonPath = Join-Path -Path (Get-Location) -ChildPath 'schema_audit_report.json'
$txtPath = Join-Path -Path (Get-Location) -ChildPath 'schema_audit_report.txt'

$report | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath -Encoding UTF8

$txtLines = @()
$txtLines += ('Schema Audit Summary for: ' + $url)
$txtLines += ('Fetched At (UTC): ' + $report.fetchedAtUtc)
$txtLines += ('HTTP Status: ' + $report.httpStatusCode)
$txtLines += ('HTML Length: ' + $report.htmlLength)
$txtLines += ('JSON-LD Script Blocks Found: ' + $report.jsonLdScriptBlockCount)
$txtLines += ('JSON-LD Blocks Parsed: ' + $report.parsedBlockCount)
$txtLines += ('JSON-LD Parse Errors: ' + $report.parseErrorCount)
$txtLines += ''
$txtLines += 'Microdata Attribute Counts:'
foreach ($k in $microdataCounts.Keys) { $txtLines += ('- ' + $k + ': ' + $microdataCounts[$k]) }
$txtLines += ''
$txtLines += 'RDFa-like Attribute Counts:'
foreach ($k in $rdfaCounts.Keys) { $txtLines += ('- ' + $k + ': ' + $rdfaCounts[$k]) }
$txtLines += ''
$txtLines += ('Entity Count: ' + $entities.Count)
$txtLines += ''

foreach ($e in $entities) {
    $txtLines += ('Entity #' + $e.entityIndex + ' (Block ' + $e.blockIndex + ')')
    $txtLines += ('  @type: ' + $e.atType)
    $txtLines += ('  name: ' + $e.name)
    $txtLines += ('  url: ' + $e.url)
    $txtLines += ('  sameAs: ' + $e.sameAs)
    foreach ($fieldName in 'image','description','inLanguage','mainEntityOfPage','breadcrumb','potentialAction','author','publisher') {
        $field = $e.fields.$fieldName
        $txtLines += ('  ' + $fieldName + ': present=' + $field.present + '; value=' + $field.valueSummary)
    }
    $txtLines += ''
}

if ($parseErrors.Count -gt 0) {
    $txtLines += 'Parse Errors:'
    foreach ($err in $parseErrors) {
        $txtLines += ('- Block ' + $err.blockIndex + ': ' + $err.error)
    }
}

$txtLines | Set-Content -Path $txtPath -Encoding UTF8

Write-Output ('JSON_REPORT_PATH=' + $jsonPath)
Write-Output ('TEXT_REPORT_PATH=' + $txtPath)
Write-Output ('ENTITY_COUNT=' + $entities.Count)
Write-Output ('JSONLD_BLOCKS=' + $matches.Count)
Write-Output 'DONE'

