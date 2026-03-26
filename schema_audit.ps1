$ProgressPreference = "SilentlyContinue"
$url = "https://abdulrahmanazam.me/"
$r = Invoke-WebRequest -UseBasicParsing -Uri $url
$html = $r.Content
Write-Output ("URL: {0} STATUS: {1}" -f $url, $r.StatusCode)

$jsonLdPattern = '<script[^>]*type=["'"'']application/ld\+json["'"''][^>]*>(.*?)</script>'
$jsonMatches = [regex]::Matches($html, $jsonLdPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Output ("JSON-LD blocks: {0}" -f $jsonMatches.Count)

$microItemscope = ([regex]::Matches($html, '\bitemscope\b', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
$microItemtype = ([regex]::Matches($html, '\bitemtype\b', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
$microItemprop = ([regex]::Matches($html, '\bitemprop\b', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
$rdfaTypeof = ([regex]::Matches($html, '\btypeof\s*=\s*["'"'']', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
$rdfaProperty = ([regex]::Matches($html, '\bproperty\s*=\s*["'"'']', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
Write-Output ("Microdata counts: itemscope={0}, itemtype={1}, itemprop={2}" -f $microItemscope, $microItemtype, $microItemprop)
Write-Output ("RDFa-like counts: typeof={0}, property={1}" -f $rdfaTypeof, $rdfaProperty)

function Expand-Entities($obj) {
  if ($null -eq $obj) { return @() }
  if ($obj -is [System.Array]) {
    $all = @()
    foreach ($i in $obj) { $all += Expand-Entities $i }
    return $all
  }
  if ($obj.PSObject.Properties.Name -contains '@graph') {
    return Expand-Entities $obj.'@graph'
  }
  return @($obj)
}

function Is-AbsoluteUrl($u) {
  if ([string]::IsNullOrWhiteSpace($u)) { return $false }
  return ($u -match '^(https?:)?//')
}

for ($i = 0; $i -lt $jsonMatches.Count; $i++) {
  $raw = $jsonMatches[$i].Groups[1].Value.Trim()
  Write-Output ("--- Block {0} ---" -f ($i + 1))
  $preview = if ($raw.Length -gt 280) { $raw.Substring(0,280) + '...' } else { $raw }
  Write-Output ("Preview: {0}" -f ($preview -replace '\s+', ' '))

  try {
    $parsed = $raw | ConvertFrom-Json
    $entities = Expand-Entities $parsed
    Write-Output ("Entities in block: {0}" -f $entities.Count)

    $j = 0
    foreach ($e in $entities) {
      $j++
      $type = $e.'@type'
      $name = $e.name
      $urlVal = $e.url
      Write-Output ("Entity {0}: @type={1}; name={2}; url={3}" -f $j, $type, $name, $urlVal)

      if ($e.PSObject.Properties.Name -contains 'sameAs') {
        $sameAs = $e.sameAs
        if ($sameAs -is [System.Array]) {
          Write-Output ("sameAs count={0}" -f $sameAs.Count)
          foreach ($s in $sameAs) {
            Write-Output (" sameAs: {0} (abs={1})" -f $s, (Is-AbsoluteUrl $s))
          }
        } else {
          Write-Output ("sameAs: {0} (abs={1})" -f $sameAs, (Is-AbsoluteUrl $sameAs))
        }
      }

      foreach ($f in @('image','description','inLanguage','mainEntityOfPage','breadcrumb','potentialAction','author','publisher')) {
        if ($e.PSObject.Properties.Name -contains $f) {
          $v = $e.$f
          if ($v -is [System.Array]) {
            Write-Output ("{0}: [array count={1}]" -f $f, $v.Count)
          } elseif ($v -is [pscustomobject]) {
            $k = ($v.PSObject.Properties.Name -join '|')
            Write-Output ("{0}: [object keys={1}]" -f $f, $k)
          } else {
            Write-Output ("{0}: {1}" -f $f, $v)
          }
        }
      }

      $keys = ($e.PSObject.Properties.Name | Sort-Object) -join ', '
      Write-Output ("keys: {0}" -f $keys)
    }
  } catch {
    Write-Output ("Parse error: {0}" -f $_.Exception.Message)
  }
}
