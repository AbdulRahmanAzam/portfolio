const fs = require('fs');
const m = JSON.parse(fs.readFileSync('lh-mobile.json','utf8'));
const d = JSON.parse(fs.readFileSync('lh-desktop.json','utf8'));
const get = (o, p) => p.split('.').reduce((a,k)=>a && a[k], o);
const out = [];
const val = x => (x === undefined || x === null) ? '' : x;
out.push('MOBILE_SCORE=' + val(get(m,'categories.performance.score') * 100));
out.push('MOBILE_LCP_MS=' + val(get(m,'audits.largest-contentful-paint.numericValue')));
out.push('MOBILE_CLS=' + val(get(m,'audits.cumulative-layout-shift.numericValue')));
out.push('MOBILE_TBT_MS=' + val(get(m,'audits.total-blocking-time.numericValue')));
out.push('MOBILE_SPEED_INDEX_MS=' + val(get(m,'audits.speed-index.numericValue')));
out.push('MOBILE_INTERACTIVE_MS=' + val(get(m,'audits.interactive.numericValue')));
out.push('MOBILE_UNUSED_JS_BYTES=' + val(get(m,'audits.unused-javascript.details.overallSavingsBytes')));
out.push('MOBILE_UNUSED_CSS_BYTES=' + val(get(m,'audits.unused-css-rules.details.overallSavingsBytes')));
out.push('MOBILE_IMAGE_SAVINGS_BYTES=' + val(get(m,'audits.uses-optimized-images.details.overallSavingsBytes')));
out.push('MOBILE_IMAGE_SAVINGS_MS=' + val(get(m,'audits.uses-optimized-images.details.overallSavingsMs')));
out.push('MOBILE_UNSIZED_IMAGES_SCORE=' + val(get(m,'audits.unsized-images.score')));
out.push('DESKTOP_SCORE=' + val(get(d,'categories.performance.score') * 100));
out.push('DESKTOP_LCP_MS=' + val(get(d,'audits.largest-contentful-paint.numericValue')));
out.push('DESKTOP_CLS=' + val(get(d,'audits.cumulative-layout-shift.numericValue')));
out.push('DESKTOP_TBT_MS=' + val(get(d,'audits.total-blocking-time.numericValue')));
out.push('DESKTOP_SPEED_INDEX_MS=' + val(get(d,'audits.speed-index.numericValue')));
out.push('DESKTOP_INTERACTIVE_MS=' + val(get(d,'audits.interactive.numericValue')));
out.push('DESKTOP_UNUSED_JS_BYTES=' + val(get(d,'audits.unused-javascript.details.overallSavingsBytes')));
out.push('DESKTOP_UNUSED_CSS_BYTES=' + val(get(d,'audits.unused-css-rules.details.overallSavingsBytes')));
out.push('DESKTOP_IMAGE_SAVINGS_BYTES=' + val(get(d,'audits.uses-optimized-images.details.overallSavingsBytes')));
out.push('DESKTOP_IMAGE_SAVINGS_MS=' + val(get(d,'audits.uses-optimized-images.details.overallSavingsMs')));
out.push('DESKTOP_UNSIZED_IMAGES_SCORE=' + val(get(d,'audits.unsized-images.score')));
const topOpp = (r) => Object.values(r.audits || {})
  .filter(a => a && a.details && typeof a.details.overallSavingsMs === 'number')
  .sort((a,b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
  .slice(0,5)
  .map(a => a.id)
  .join(',');
out.push('TOP_OPP_MOBILE=' + topOpp(m));
out.push('TOP_OPP_DESKTOP=' + topOpp(d));
console.log(out.join('\n'));
