$ProgressPreference='SilentlyContinue'
$url='https://abdulrahmanazam.me/'
$resp=Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 10 -TimeoutSec 30
$html=[string]$resp.Content
$base=[uri]$resp.BaseResponse.ResponseUri.AbsoluteUri
$strip = {
  param($s)
  $t=[regex]::Replace($s,'<script\b[\s\S]*?</script>|<style\b[\s\S]*?</style>',' ','IgnoreCase')
  $t=[regex]::Replace($t,'<[^>]+>',' ')
  $t=[regex]::Replace($t,'\s+',' ').Trim()
  [System.Net.WebUtility]::HtmlDecode($t)
}
$headingMatches=[regex]::Matches($html,'<h([1-3])\b[^>]*>([\s\S]*?)</h\1>','IgnoreCase')
$headings=foreach($m in $headingMatches){ [pscustomobject]@{ Tag=('h'+$m.Groups[1].Value); Text=(& $strip $m.Groups[2].Value) } }
$h1=($headings|Where-Object Tag -eq 'h1').Count
$h2=($headings|Where-Object Tag -eq 'h2').Count
$h3=($headings|Where-Object Tag -eq 'h3').Count
$first10=($headings|Select-Object -First 10 -ExpandProperty Text)
$qCount=($headings|Where-Object { $_.Text -like '*?*' }).Count
$blockMatches=[regex]::Matches($html,'<(p|li|blockquote|article|section|div)\b[^>]*>([\s\S]*?)</\1>','IgnoreCase')
$blocks=foreach($m in $blockMatches){
  $txt=& $strip $m.Groups[2].Value
  if($txt.Length -gt 40){
    $words=([regex]::Matches($txt,'\b[\w''-]+\b')).Count
    [pscustomobject]@{ Text=$txt; Chars=$txt.Length; Words=$words }
  }
}
$top10=$blocks|Sort-Object Words -Descending,Chars -Descending|Select-Object -First 10
$rangeHits=($blocks|Where-Object { $_.Words -ge 134 -and $_.Words -le 167 }).Count
$socialHosts=@('linkedin.com','www.linkedin.com','github.com','www.github.com','x.com','www.x.com','twitter.com','www.twitter.com','instagram.com','www.instagram.com','facebook.com','www.facebook.com','youtube.com','www.youtube.com','tiktok.com','www.tiktok.com','medium.com','www.medium.com','behance.net','www.behance.net','dribbble.com','www.dribbble.com')
$hrefs=[regex]::Matches($html,'<a\b[^>]*href=["'']([^"''#]+)["'']','IgnoreCase')|ForEach-Object{$_.Groups[1].Value}
$outbound=@()
foreach($h in $hrefs){
  if($h -match '^(mailto:|tel:|javascript:)'){ continue }
  try{
    if($h -match '^https?://'){ $u=[uri]$h } else { $u=[uri]::new($base,$h) }
    if($u.Host -and $u.Host -ne $base.Host){
      $norm=($u.Scheme+'://'+$u.Host+$u.AbsolutePath).TrimEnd('/')
      $outbound += [pscustomobject]@{ Host=$u.Host.ToLower(); Url=$norm.ToLower() }
    }
  } catch{}
}
$outbound=$outbound|Sort-Object Url -Unique
$profile=$outbound|Where-Object { $socialHosts -contains $_.Host }
$citation=$outbound|Where-Object { ($socialHosts -notcontains $_.Host) -and ( $_.Host -match '\.(gov|edu)$' -or $_.Url -match '(docs|research|news|journal|paper|study|report)' ) }
Write-Output ("HEADINGS h1={0} h2={1} h3={2} total={3}" -f $h1,$h2,$h3,$headings.Count)
Write-Output ("HEADINGS_FIRST10=" + (($first10 -join ' | ')))
Write-Output ("QUESTION_HEADINGS={0}" -f $qCount)
Write-Output ("BLOCKS_GT40={0} TOP10_WORDS={1}" -f $blocks.Count,(($top10|ForEach-Object{$_.Words}) -join ','))
Write-Output ("BLOCKS_134_167_WORDS={0}" -f $rangeHits)
$blockExamples=$top10|Select-Object -First 3|ForEach-Object{ "[{0}w/{1}c] {2}" -f $_.Words,$_.Chars,($_.Text.Substring(0,[Math]::Min(90,$_.Text.Length))) }
Write-Output ("BLOCK_EXAMPLES=" + ($blockExamples -join ' || '))
Write-Output ("OUTBOUND_TOTAL={0} CITATION_LIKE={1} PROFILE_LINKS={2}" -f $outbound.Count,$citation.Count,$profile.Count)
$citeEx=($citation|Select-Object -First 3 -ExpandProperty Url) -join ' | '
$profEx=($profile|Select-Object -First 3 -ExpandProperty Url) -join ' | '
Write-Output ("CITATION_EXAMPLES=" + $citeEx)
Write-Output ("PROFILE_EXAMPLES=" + $profEx)
