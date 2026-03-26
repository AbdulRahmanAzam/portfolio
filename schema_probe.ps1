$ErrorActionPreference = 'Stop'
$url = 'https://abdulrahmanazam.me/'
$response = Invoke-WebRequest -UseBasicParsing -Uri $url -Method Get
$html = [string]$response.Content

Write-Output ("Downloaded: {0}" -f $url)
Write-Output ("Status: {0} {1}" -f $response.StatusCode, $response.StatusDescription)
Write-Output ("HTML length: {0}" -f $html.Length)
Write-Output ''

$jsonPattern = '<script\b[^>]*type\s*=\s*["'']application/ld\+json["''][^>]*>(.*?)</script>'
$jsonBlocks = [regex]::Matches($html, $jsonPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Output ("JSON-LD blocks: {0}" -f $jsonBlocks.Count)
Write-Output ''

$lines = $html -split "`r?`n"
$microItemscope = [regex]::Matches($html, '(?i)itemscope').Count
$microItemtype = [regex]::Matches($html, '(?i)itemtype\s*=').Count
$microItemprop = [regex]::Matches($html, '(?i)itemprop\s*=').Count
Write-Output 'Microdata indicators:'
Write-Output ("  itemscope: {0}" -f $microItemscope)
Write-Output ("  itemtype=: {0}" -f $microItemtype)
Write-Output ("  itemprop=: {0}" -f $microItemprop)
$microSamples = $lines | Where-Object { $_ -match '(?i)itemscope|itemtype\s*=|itemprop\s*=' } | Select-Object -First 3
if ($microSamples) {
  Write-Output '  Samples:'
  foreach ($s in $microSamples) {
    $t = ($s.Trim() -replace '\s+', ' ')
    if ($t.Length -gt 180) { $t = $t.Substring(0,180) + ' ...' }
    Write-Output ("    - {0}" -f $t)
  }
} else {
  Write-Output '  Samples: none'
}
Write-Output ''

$rdfaTypeof = [regex]::Matches($html, '(?i)\stypeof\s*=').Count
$rdfaProperty = [regex]::Matches($html, '(?i)\sproperty\s*=').Count
$rdfaVocab = [regex]::Matches($html, '(?i)\svocab\s*=').Count
Write-Output 'RDFa indicators:'
Write-Output ("  typeof=: {0}" -f $rdfaTypeof)
Write-Output ("  property=: {0}" -f $rdfaProperty)
Write-Output ("  vocab=: {0}" -f $rdfaVocab)
$rdfaSamples = $lines | Where-Object { $_ -match '(?i)\stypeof\s*=|\sproperty\s*=|\svocab\s*=' } | Select-Object -First 3
if ($rdfaSamples) {
  Write-Output '  Samples:'
  foreach ($s in $rdfaSamples) {
    $t = ($s.Trim() -replace '\s+', ' ')
    if ($t.Length -gt 180) { $t = $t.Substring(0,180) + ' ...' }
    Write-Output ("    - {0}" -f $t)
  }
} else {
  Write-Output '  Samples: none'
}
Write-Output ''

function Get-Keys($obj) {
  if ($null -eq $obj) { return @() }
  if ($obj -is [System.Collections.IDictionary]) { return @($obj.Keys) }
  return @($obj.PSObject.Properties | Where-Object { $_.MemberType -eq 'NoteProperty' } | Select-Object -ExpandProperty Name)
}

function Get-Value($obj, $key) {
  if ($obj -is [System.Collections.IDictionary]) { return $obj[$key] }
  $p = $obj.PSObject.Properties[$key]
  if ($null -ne $p) { return $p.Value }
  return $null
}

function Url-Style([string]$u) {
  if ([string]::IsNullOrWhiteSpace($u)) { return 'empty' }
  if ($u -match '^(?i)(https?:)?//') { return 'absolute' }
  if ($u -match '^(?i)[a-z][a-z0-9+.-]*:') { return 'absolute-scheme' }
  if ($u -match '^(?:/|\./|\.\./)') { return 'relative' }
  return 'likely-relative'
}

$idx = 0
foreach ($m in $jsonBlocks) {
  $idx++
  $raw = $m.Groups[1].Value.Trim()
  Write-Output ("--- JSON-LD block #{0} ---" -f $idx)
  if ($raw.Length -gt 500) { Write-Output ($raw.Substring(0,500) + ' ...[truncated]') } else { Write-Output $raw }

  try {
    $obj = $raw | ConvertFrom-Json -Depth 100 -ErrorAction Stop
    $types = New-Object System.Collections.ArrayList
    $urlFields = New-Object System.Collections.ArrayList

    function Traverse($node, [string]$path) {
      if ($null -eq $node) { return }
      $keys = Get-Keys $node
      if ($keys.Count -gt 0) {
        foreach ($k in $keys) {
          $v = Get-Value $node $k
          $p = if ([string]::IsNullOrEmpty($path)) { [string]$k } else { "$path.$k" }

          if ($k -eq '@type') {
            if ($v -is [string]) { [void]$types.Add($v) }
            elseif ($v -is [System.Collections.IEnumerable] -and -not ($v -is [string])) {
              foreach ($t in $v) { if ($t -is [string]) { [void]$types.Add($t) } }
            }
          }

          if ($k -match '(?i)^(@id|url|image|logo|sameAs|mainEntityOfPage|target)$') {
            if ($v -is [string]) {
              [void]$urlFields.Add([pscustomobject]@{ Path = $p; Value = $v })
            } elseif ($v -is [System.Collections.IEnumerable] -and -not ($v -is [string])) {
              foreach ($u in $v) { if ($u -is [string]) { [void]$urlFields.Add([pscustomobject]@{ Path = $p; Value = $u }) } }
            }
          }

          Traverse $v $p
        }
      } elseif ($node -is [System.Collections.IEnumerable] -and -not ($node -is [string])) {
        $i = 0
        foreach ($item in $node) {
          $nextPath = if ([string]::IsNullOrEmpty($path)) { "[{0}]" -f $i } else { "{0}[{1}]" -f $path, $i }
          Traverse $item $nextPath
          $i++
        }
      }
    }

    Traverse $obj ''

    $topKeys = New-Object System.Collections.Generic.HashSet[string]
    $rootKeys = Get-Keys $obj
    if ($rootKeys.Count -gt 0) {
      foreach ($k in $rootKeys) { [void]$topKeys.Add([string]$k) }
    } elseif ($obj -is [System.Collections.IEnumerable] -and -not ($obj -is [string])) {
      foreach ($item in $obj) {
        foreach ($k in (Get-Keys $item)) { [void]$topKeys.Add([string]$k) }
      }
    }

    $uniqTypes = $types | Select-Object -Unique
    Write-Output 'Parsed: yes'
    Write-Output ("  @type values: {0}" -f ($(if ($uniqTypes.Count -gt 0) { $uniqTypes -join ', ' } else { 'none' })))
    Write-Output ("  Top-level keys: {0}" -f ($(if ($topKeys.Count -gt 0) { ($topKeys.ToArray() | Sort-Object) -join ', ' } else { 'none' })))

    if ($urlFields.Count -gt 0) {
      $classified = foreach ($u in $urlFields) {
        [pscustomobject]@{ Path = $u.Path; Value = $u.Value; Style = Url-Style $u.Value }
      }
      $absCount = ($classified | Where-Object { $_.Style -like 'absolute*' }).Count
      $relCount = ($classified | Where-Object { $_.Style -in @('relative','likely-relative') }).Count
      Write-Output ("  URL field style: absolute={0}, relative/likely-relative={1}" -f $absCount, $relCount)
      $classified | Select-Object -First 3 | ForEach-Object {
        $v = $_.Value
        if ($v.Length -gt 80) { $v = $v.Substring(0,80) + '...' }
        Write-Output ("    - {0} => {1} ({2})" -f $_.Path, $v, $_.Style)
      }
    } else {
      Write-Output '  URL field style: none detected'
    }
  }
  catch {
    Write-Output ("Parsed: no ({0})" -f $_.Exception.Message)
  }
  Write-Output ''
}
