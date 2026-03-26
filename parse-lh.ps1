$files=@('lh-mobile.json','lh-desktop.json')
foreach($f in $files){ if(-not (Test-Path $f)){ Write-Output "Missing:$f" } }
function Get-Audit($audits,$id){ if($audits.PSObject.Properties.Name -contains $id){ return $audits.$id }; return $null }
function MsToS($ms){ if($null -eq $ms){ return $null }; return [math]::Round(($ms/1000),2) }
function Get-Summary($path,$profile){
  $j=Get-Content $path -Raw | ConvertFrom-Json
  $a=$j.audits
  $perf=[math]::Round(($j.categories.performance.score*100),0)
  $lcp=Get-Audit $a 'largest-contentful-paint'
  $cls=Get-Audit $a 'cumulative-layout-shift'
  $inp=Get-Audit $a 'interaction-to-next-paint'
  if(-not $inp){ $inp=Get-Audit $a 'experimental-interaction-to-next-paint' }
  $tbt=Get-Audit $a 'total-blocking-time'
  $si=Get-Audit $a 'speed-index'
  $tti=Get-Audit $a 'interactive'

  $opRefs=@()
  if($j.categories.performance.auditRefs){ $opRefs=$j.categories.performance.auditRefs | Where-Object { $_.group -eq 'load-opportunities' } }
  $opps=foreach($r in $opRefs){
    $x=Get-Audit $a $r.id
    if($null -ne $x){
      $saveMs=$null; $saveBytes=$null
      if($x.details){
        if($x.details.PSObject.Properties.Name -contains 'overallSavingsMs'){ $saveMs=$x.details.overallSavingsMs }
        if($x.details.PSObject.Properties.Name -contains 'overallSavingsBytes'){ $saveBytes=$x.details.overallSavingsBytes }
      }
      if(($saveMs -gt 0) -or ($saveBytes -gt 0)){
        [pscustomobject]@{id=$r.id; title=$x.title; savingsMs=[double]($saveMs|ForEach-Object{$_}); savingsBytes=[double]($saveBytes|ForEach-Object{$_})}
      }
    }
  }
  $topOpps=$opps | Sort-Object @{Expression='savingsMs';Descending=$true}, @{Expression='savingsBytes';Descending=$true} | Select-Object -First 5

  $diagIds=@('render-blocking-resources','unused-javascript','unused-css-rules','uses-optimized-images','modern-image-formats','uses-responsive-images','offscreen-images','mainthread-work-breakdown')
  $diags=foreach($id in $diagIds){
    $x=Get-Audit $a $id
    if($x){
      $saveMs=$null; $saveBytes=$null
      if($x.details){
        if($x.details.PSObject.Properties.Name -contains 'overallSavingsMs'){ $saveMs=$x.details.overallSavingsMs }
        if($x.details.PSObject.Properties.Name -contains 'overallSavingsBytes'){ $saveBytes=$x.details.overallSavingsBytes }
      }
      [pscustomobject]@{id=$id; title=$x.title; scoreDisplayMode=$x.scoreDisplayMode; numericValue=$x.numericValue; overallSavingsMs=$saveMs; overallSavingsBytes=$saveBytes}
    }
  }

  [pscustomobject]@{
    profile=$profile; performance=$perf; lcp_s=MsToS $lcp.numericValue; cls=[math]::Round([double]$cls.numericValue,3)
    inp_ms=if($inp){[math]::Round([double]$inp.numericValue,0)}else{$null}; tbt_ms=[math]::Round([double]$tbt.numericValue,0)
    speedIndex_s=MsToS $si.numericValue; tti_s=MsToS $tti.numericValue; inpAvailable=[bool]$inp
    topOpportunities=$topOpps; diagnostics=$diags
  }
}

$m=Get-Summary 'lh-mobile.json' 'mobile'
$d=Get-Summary 'lh-desktop.json' 'desktop'
'===SUMMARY==='
$m | Select-Object profile,performance,lcp_s,cls,inp_ms,tbt_ms,speedIndex_s,tti_s,inpAvailable | Format-List
$d | Select-Object profile,performance,lcp_s,cls,inp_ms,tbt_ms,speedIndex_s,tti_s,inpAvailable | Format-List
'===OPPORTUNITIES MOBILE==='
$m.topOpportunities | Select-Object id,title,savingsMs,savingsBytes | Format-Table -AutoSize
'===OPPORTUNITIES DESKTOP==='
$d.topOpportunities | Select-Object id,title,savingsMs,savingsBytes | Format-Table -AutoSize
'===DIAGNOSTICS MOBILE==='
$m.diagnostics | Select-Object id,overallSavingsMs,overallSavingsBytes,numericValue | Format-Table -AutoSize
'===DIAGNOSTICS DESKTOP==='
$d.diagnostics | Select-Object id,overallSavingsMs,overallSavingsBytes,numericValue | Format-Table -AutoSize
