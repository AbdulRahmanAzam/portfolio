$ProgressPreference='SilentlyContinue'
function Resolve-Http {
param([string]$Url,[int]$MaxRedirects=10)
$current=$Url; $hop=0; $history=@()
while($hop -le $MaxRedirects){
try{
$resp=Invoke-WebRequest -Uri $current -MaximumRedirection 0 -UseBasicParsing
$code=[int]$resp.StatusCode; $history+=[pscustomobject]@{Url=$current;Status=$code}
if($code -in 301,302,303,307,308 -and $hop -lt $MaxRedirects){$loc=$resp.Headers['Location']; if($loc){if($loc -notmatch '^https?://'){$loc=([uri]::new([uri]$current,$loc)).AbsoluteUri}; $current=$loc; $hop++; continue}}
return [pscustomobject]@{StartUrl=$Url;FinalUrl=$current;StatusCode=$code;Headers=$resp.Headers;Content=$resp.Content;Error=$null;Redirects=$hop;History=$history}
}catch{
if($_.Exception.Response){$r=$_.Exception.Response; $code=[int]$r.StatusCode; $history+=[pscustomobject]@{Url=$current;Status=$code}
if($code -in 301,302,303,307,308 -and $hop -lt $MaxRedirects){$loc=$r.Headers['Location']; if($loc){if($loc -notmatch '^https?://'){$loc=([uri]::new([uri]$current,$loc)).AbsoluteUri}; $current=$loc; $hop++; continue}}
$content=$null; try{$sr=New-Object IO.StreamReader($r.GetResponseStream()); $content=$sr.ReadToEnd(); $sr.Close()}catch{}
return [pscustomobject]@{StartUrl=$Url;FinalUrl=$current;StatusCode=$code;Headers=$r.Headers;Content=$content;Error=$null;Redirects=$hop;History=$history}
}else{return [pscustomobject]@{StartUrl=$Url;FinalUrl=$current;StatusCode=$null;Headers=@{};Content=$null;Error=$_.Exception.Message;Redirects=$hop;History=$history}}}
}
return [pscustomobject]@{StartUrl=$Url;FinalUrl=$current;StatusCode=$null;Headers=@{};Content=$null;Error='Max redirects exceeded';Redirects=$MaxRedirects;History=$history}
}
function Parse-SitemapXml { param([string]$XmlText)
try{$xml=[xml]$XmlText; [pscustomobject]@{Success=$true;Root=$xml.DocumentElement.LocalName;UrlLocs=@($xml.SelectNodes("//*[local-name()='url']/*[local-name()='loc']")|%{$_.InnerText.Trim()}|?{$_});UrlLastmods=@($xml.SelectNodes("//*[local-name()='url']/*[local-name()='lastmod']")|%{$_.InnerText.Trim()});ChildSitemaps=@($xml.SelectNodes("//*[local-name()='sitemap']/*[local-name()='loc']")|%{$_.InnerText.Trim()}|?{$_});Error=$null}}
catch{[pscustomobject]@{Success=$false;Root=$null;UrlLocs=@();UrlLastmods=@();ChildSitemaps=@();Error=$_.Exception.Message}}
}
$rootUrls=@('https://abdulrahmanazam.me/','https://www.abdulrahmanazam.me/','https://abdulrahmanazam.com/','https://www.abdulrahmanazam.com/')
$robotsUrls=@('https://abdulrahmanazam.me/robots.txt','https://www.abdulrahmanazam.me/robots.txt','https://abdulrahmanazam.com/robots.txt','https://www.abdulrahmanazam.com/robots.txt')
$rootResults=@{}; foreach($u in $rootUrls){$rootResults[$u]=Resolve-Http $u}
$canonical=$null; $root200=$rootResults.Values|?{$_.StatusCode -eq 200 -and -not $_.Error}; if($root200.Count -gt 0){$canonical=($root200|Group-Object {([uri]$_.FinalUrl).Host}|Sort-Object Count -Desc|Select-Object -First 1).Name}
if(-not $canonical){$hosts=$rootResults.Values|%{try{([uri]$_.FinalUrl).Host}catch{$null}}|?{$_}; if($hosts.Count -gt 0){$canonical=($hosts|Group-Object|Sort-Object Count -Desc|Select-Object -First 1).Name}}
$robotsResults=@(); $discovered=New-Object 'System.Collections.Generic.HashSet[string]'
foreach($ru in $robotsUrls){$rr=Resolve-Http $ru; $sms=@(); if($rr.Content){$sms=@([regex]::Matches($rr.Content,'(?im)^\s*Sitemap\s*:\s*(\S+)')|%{$_.Groups[1].Value.Trim()}); foreach($s in $sms){[void]$discovered.Add($s)}}; $robotsResults+=[pscustomobject]@{Url=$ru;FinalUrl=$rr.FinalUrl;StatusCode=$rr.StatusCode;Error=$rr.Error;SitemapLines=$sms}}
@('https://abdulrahmanazam.me/sitemap.xml','https://abdulrahmanazam.me/sitemap_index.xml','https://www.abdulrahmanazam.me/sitemap.xml','https://www.abdulrahmanazam.me/sitemap_index.xml')|%{[void]$discovered.Add($_)}
$candidates=@($discovered); $reachable=@(); $parses=@(); $allLocs=New-Object 'System.Collections.Generic.List[string]'; $allLastmods=New-Object 'System.Collections.Generic.List[string]'; $seen=New-Object 'System.Collections.Generic.HashSet[string]'; $q=New-Object 'System.Collections.Generic.Queue[string]'; foreach($c in $candidates){if($seen.Add($c)){$q.Enqueue($c)}}
while($q.Count -gt 0){$sm=$q.Dequeue(); $res=Resolve-Http $sm; $isXml=$false; if($res.StatusCode -ge 200 -and $res.StatusCode -lt 400 -and -not $res.Error -and $res.Content){$ct=''; try{$ct=[string]$res.Headers['Content-Type']}catch{}; if($ct -match 'xml|text/plain|application/octet-stream' -or $res.Content.TrimStart().StartsWith('<')){$isXml=$true}}
if($isXml){$p=Parse-SitemapXml $res.Content; $parses+=[pscustomobject]@{Url=$sm;FinalUrl=$res.FinalUrl;StatusCode=$res.StatusCode;RootType=$p.Root;ParseSuccess=$p.Success;ParseError=$p.Error;UrlCount=$p.UrlLocs.Count;ChildCount=$p.ChildSitemaps.Count}; if($p.Success){$reachable+=$sm; foreach($l in $p.UrlLocs){$allLocs.Add($l)}; foreach($lm in $p.UrlLastmods){$allLastmods.Add($lm)}; if($p.Root -eq 'sitemapindex'){foreach($child in $p.ChildSitemaps){if($seen.Add($child)){$q.Enqueue($child)}}}}}
else{$parses+=[pscustomobject]@{Url=$sm;FinalUrl=$res.FinalUrl;StatusCode=$res.StatusCode;RootType=$null;ParseSuccess=$false;ParseError=$(if($res.Error){$res.Error}else{'Not reachable XML sitemap'});UrlCount=0;ChildCount=0}}}
$total=$allLocs.Count; $unique=@($allLocs|Select-Object -Unique); $uniqCount=$unique.Count; $dup=$total-$uniqCount
$nonAbs=New-Object 'System.Collections.Generic.List[string]'; $frags=New-Object 'System.Collections.Generic.List[string]'; $proto=@{http=0;https=0;other=0}; $hosts=@{}
foreach($loc in $unique){$u=$null; if(-not [uri]::TryCreate($loc,[System.UriKind]::Absolute,[ref]$u)){$nonAbs.Add($loc); continue}; if($u.Scheme -eq 'http'){$proto.http++}elseif($u.Scheme -eq 'https'){$proto.https++}else{$proto.other++}; if($u.Fragment){$frags.Add($loc)}; $h=$u.Host.ToLowerInvariant(); if(-not $hosts.ContainsKey($h)){$hosts[$h]=0}; $hosts[$h]++}
$sample=@($unique|Select-Object -First 200); $status=@{'200'=0;'3xx'=0;'4xx5xx'=0;'error'=0}; $redirHosts=@{}
foreach($u in $sample){$r=Resolve-Http $u; if($r.Error -or -not $r.StatusCode){$status.error++; continue}; if($r.StatusCode -eq 200){$status.'200'++}elseif($r.StatusCode -ge 300 -and $r.StatusCode -lt 400){$status.'3xx'++}elseif($r.StatusCode -ge 400){$status.'4xx5xx'++}; if($r.FinalUrl -and $r.FinalUrl -ne $u){try{$th=([uri]$r.FinalUrl).Host.ToLowerInvariant(); if(-not $redirHosts.ContainsKey($th)){$redirHosts[$th]=0}; $redirHosts[$th]++}catch{}}}
$canonicalRobots=$null; if($canonical){$canonicalRobots=$robotsResults|?{try{([uri]$_.FinalUrl).Host -eq $canonical}catch{$false}}|Select-Object -First 1}
$canonicalHasValid=$false; if($canonicalRobots){foreach($sm in $canonicalRobots.SitemapLines){if($reachable -contains $sm){$canonicalHasValid=$true; break}; if($parses|?{$_.Url -eq $sm -and $_.ParseSuccess}){$canonicalHasValid=$true; break}}}
$nonCanonicalIssues=@(); foreach($rr in $robotsResults){$start=([uri]$rr.Url).Host; $final=$null; try{$final=([uri]$rr.FinalUrl).Host}catch{}; if($canonical -and $start -ne $canonical){if($final -and $final -ne $canonical){$nonCanonicalIssues+="robots non-canonical host $start does not redirect to canonical ($final)"}; foreach($sm in $rr.SitemapLines){try{$smh=([uri]$sm).Host; if($smh -ne $canonical){$nonCanonicalIssues+="robots on $start advertises sitemap on $smh"}}catch{$nonCanonicalIssues+="robots on $start has invalid sitemap URL: $sm"}}}}
$lmTotal=$allLastmods.Count; $lmRatio=if($total -gt 0){[math]::Round(($lmTotal/$total)*100,2)}else{0}; $allIdent=$false; if($lmTotal -gt 0){$allIdent=(($allLastmods|Select-Object -Unique).Count -eq 1)}
$parseDates=New-Object 'System.Collections.Generic.List[datetime]'; foreach($lm in $allLastmods){$dt=[datetime]::MinValue; if([datetime]::TryParse($lm,[ref]$dt)){$parseDates.Add($dt)}}; $isoRatio=if($lmTotal -gt 0){[math]::Round(($parseDates.Count/$lmTotal)*100,2)}else{0}
$min=$null; $max=$null; $fresh=$null; if($parseDates.Count -gt 0){$min=($parseDates|Measure-Object -Minimum).Minimum; $max=($parseDates|Measure-Object -Maximum).Maximum; $fresh=[math]::Round(((Get-Date)-$max).TotalDays,1)}
$issues=New-Object 'System.Collections.Generic.List[object]'; if(-not $canonical){$issues.Add([pscustomobject]@{Severity='critical';Issue='Canonical host could not be inferred'})}; if($total -eq 0){$issues.Add([pscustomobject]@{Severity='critical';Issue='No URLs collected from reachable sitemaps'})}; if($canonical -and -not $canonicalHasValid){$issues.Add([pscustomobject]@{Severity='high';Issue='Canonical robots.txt lacks reachable sitemap URL'})}; if($frags.Count -gt 0){$issues.Add([pscustomobject]@{Severity='high';Issue="Fragment URLs in loc ($($frags.Count))"})}; if($proto.http -gt 0 -and $proto.https -gt 0){$issues.Add([pscustomobject]@{Severity='medium';Issue='Mixed protocol loc URLs'})}; if($nonAbs.Count -gt 0){$issues.Add([pscustomobject]@{Severity='high';Issue="Non-absolute loc URLs ($($nonAbs.Count))"})}; if($dup -gt 0){$issues.Add([pscustomobject]@{Severity='medium';Issue="Duplicate loc URLs ($dup)"})}; foreach($ni in ($nonCanonicalIssues|Select-Object -Unique)){$issues.Add([pscustomobject]@{Severity='medium';Issue=$ni})}; if($lmTotal -eq 0){$issues.Add([pscustomobject]@{Severity='low';Issue='No lastmod signals present'})}elseif($allIdent){$issues.Add([pscustomobject]@{Severity='low';Issue='All lastmod values are identical'})}
"=== Canonical host inference ==="
"canonical_host=$($canonical)"
foreach($u in $rootUrls){$r=$rootResults[$u]; "root url=$u status=$($r.StatusCode) final=$($r.FinalUrl) redirects=$($r.Redirects) error=$(if($r.Error){$r.Error}else{'none'})"}
"=== Robots discovery ==="
foreach($rr in $robotsResults){$s=$(if($rr.SitemapLines.Count -gt 0){$rr.SitemapLines -join ','}else{'(none)'}); "robots url=$($rr.Url) status=$($rr.StatusCode) final=$($rr.FinalUrl) sitemaps=$s error=$(if($rr.Error){$rr.Error}else{'none'})"}
"=== Sitemap files found ==="
"candidates=$($candidates.Count) reachable=$((@($reachable|Select-Object -Unique)).Count) parsed_ok=$(@($parses|? ParseSuccess).Count)"
foreach($sp in $parses){"sitemap url=$($sp.Url) status=$($sp.StatusCode) root=$(if($sp.RootType){$sp.RootType}else{'(none)'}) parse=$($sp.ParseSuccess) urls=$($sp.UrlCount) children=$($sp.ChildCount)"}
"=== URL quality checks ==="
"loc_total=$total loc_unique=$uniqCount loc_duplicates=$dup"
"non_absolute=$($nonAbs.Count) fragments=$($frags.Count) protocol_http=$($proto.http) protocol_https=$($proto.https) protocol_other=$($proto.other)"
"host_distribution=$(if($hosts.Keys.Count -gt 0){($hosts.GetEnumerator()|Sort-Object Value -Desc|%{"$($_.Key):$($_.Value)"}) -join ','}else{'(none)'})"
if($frags.Count -gt 0){"fragment_examples=$((@($frags|Select-Object -First 3)) -join ',')"}
if($nonAbs.Count -gt 0){"non_absolute_examples=$((@($nonAbs|Select-Object -First 3)) -join ',')"}
"=== HTTP status checks ==="
"sampled=$($sample.Count) status_200=$($status.'200') status_3xx=$($status.'3xx') status_4xx5xx=$($status.'4xx5xx') status_error=$($status.error)"
"redirect_target_hosts=$(if($redirHosts.Keys.Count -gt 0){($redirHosts.GetEnumerator()|Sort-Object Value -Desc|%{"$($_.Key):$($_.Value)"}) -join ','}else{'(none)'})"
"=== Update signal checks ==="
"lastmod_count=$lmTotal lastmod_presence_ratio_pct=$lmRatio all_lastmod_identical=$allIdent parseable_date_ratio_pct=$isoRatio"
"lastmod_min=$(if($min){$min.ToString('o')}else{'(none)'}) lastmod_max=$(if($max){$max.ToString('o')}else{'(none)'}) freshness_days=$(if($fresh -ne $null){$fresh}else{'(none)'})"
"=== Issues list ==="
if($issues.Count -eq 0){'severity=none issue=(none)'} else {foreach($i in $issues){"severity=$($i.Severity) issue=$($i.Issue)"}}
