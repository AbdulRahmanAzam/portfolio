import json
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

URL = "https://abdulrahmanazam.me"
out_dir = Path("screenshots")
out_dir.mkdir(parents=True, exist_ok=True)

CTA_WORDS = ["contact","hire","book","schedule","get started","start","learn more","download","join","sign up","request","portfolio","projects","message","email","call"]
MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"

def intersect(a,b):
    return not (a['x']+a['width']<=b['x'] or b['x']+b['width']<=a['x'] or a['y']+a['height']<=b['y'] or b['y']+b['height']<=a['y'])

def audit(page, vw, vh):
    h1_visible = page.evaluate("""({vw,vh})=>[...document.querySelectorAll('h1')].some(el=>{const s=getComputedStyle(el);const r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')!==0&&r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<vh&&r.left<vw;})""", {"vw":vw,"vh":vh})
    ctas = page.evaluate("""({words,vw,vh})=>{const els=[...document.querySelectorAll('a,button,[role="button"],input[type="button"],input[type="submit"]')];const out=[];for(const el of els){const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity||'1')===0)continue;const r=el.getBoundingClientRect();if(r.width<=0||r.height<=0)continue;const t=((el.innerText||el.value||el.getAttribute('aria-label')||'').trim()).replace(/\s+/g,' ');if(!t)continue;const low=t.toLowerCase();if(!words.some(w=>low.includes(w)))continue;out.push({tag:el.tagName.toLowerCase(),text:t.slice(0,120),x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height),above_fold:r.top<vh&&r.bottom>0});}return out.slice(0,40);} """, {"words":CTA_WORDS,"vw":vw,"vh":vh})
    elems = page.evaluate("""({vw,vh})=>{const q='header,nav,h1,h2,a,button,[role="button"],.hero,[class*="hero"],[id*="hero"],section';const out=[];for(const el of [...document.querySelectorAll(q)].slice(0,180)){const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')continue;const r=el.getBoundingClientRect();if(r.width<8||r.height<8)continue;if(!(r.bottom>0&&r.right>0&&r.top<vh&&r.left<vw))continue;const d=(el.tagName||'').toLowerCase()+(el.id?`#${el.id}`:'');out.push({desc:d.slice(0,120),x:r.x,y:r.y,width:r.width,height:r.height});}return out.slice(0,70);} """, {"vw":vw,"vh":vh})
    overlaps=[]
    for i in range(len(elems)):
        for j in range(i+1,len(elems)):
            if intersect(elems[i], elems[j]):
                overlaps.append({"a":elems[i]["desc"],"b":elems[j]["desc"]})
                if len(overlaps)>=30:
                    break
        if len(overlaps)>=30:
            break
    overflow = page.evaluate("() => ({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,hasOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})")
    nav = page.evaluate("""()=>{const vis=el=>{const s=getComputedStyle(el);const r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')!==0&&r.width>0&&r.height>0;};const navVisible=[...document.querySelectorAll('nav,header [role="navigation"],[class*="nav" i]')].some(vis);let hb=[...document.querySelectorAll('button[aria-label*="menu" i],button[class*="hamburger" i],button[class*="menu-toggle" i],[role="button"][aria-label*="menu" i]')].some(vis);if(!hb){hb=[...document.querySelectorAll('button,[role="button"]')].some(el=>vis(el)&&/menu/i.test((el.innerText||'')+' '+(el.getAttribute('aria-label')||'')));}return {nav_visible:navVisible,hamburger_present:hb};}""")
    return {
        "h1_visible_in_viewport": bool(h1_visible),
        "primary_cta_candidates": ctas,
        "has_cta_above_fold": any(c.get("above_fold") for c in ctas),
        "cta_count_above_fold": sum(1 for c in ctas if c.get("above_fold")),
        "overlap_signals": {"count": len(overlaps), "samples": overlaps[:15]},
        "horizontal_overflow": overflow,
        "nav_visibility": nav["nav_visible"],
        "hamburger_presence": nav["hamburger_present"],
    }

def mobile_taps(page):
    return page.evaluate("""()=>{const els=[...document.querySelectorAll('a,button,input,select,textarea,[role="button"],[onclick],[tabindex]')];const out=[];for(const el of els){const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity||'1')===0)continue;const r=el.getBoundingClientRect();if(r.width<=0||r.height<=0)continue;if(r.width>=48&&r.height>=48)continue;const text=((el.innerText||el.value||el.getAttribute('aria-label')||'').trim()).replace(/\s+/g,' ');const snippet=(el.outerHTML||'').replace(/\s+/g,' ').slice(0,180);const selector=el.id?`#${el.id}`:el.tagName.toLowerCase();out.push({selector,text:text.slice(0,80),snippet,width:Math.round(r.width),height:Math.round(r.height),x:Math.round(r.x),y:Math.round(r.y)});}return out.slice(0,30);}""")

result = {"page_title":None,"final_url":None,"load_status":"unknown","viewports":{},"mobile_tap_targets_under_48":[],"errors":[]}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    try:
        dctx = browser.new_context(viewport={"width":1920,"height":1080})
        dpage = dctx.new_page()
        try:
            resp = dpage.goto(URL, wait_until="domcontentloaded", timeout=60000)
            dpage.wait_for_timeout(5000)
            result["load_status"] = str(resp.status if resp else "no_response")
        except PlaywrightTimeoutError:
            result["load_status"] = "timeout"
            result["errors"].append("Desktop load timeout")
        result["page_title"] = dpage.title()
        result["final_url"] = dpage.url
        dpage.screenshot(path=str(out_dir / "abdulrahmanazam-desktop.png"), full_page=False)
        result["viewports"]["desktop"] = audit(dpage,1920,1080)
        dctx.close()

        mctx = browser.new_context(viewport={"width":375,"height":812}, user_agent=MOBILE_UA, is_mobile=True, has_touch=True, device_scale_factor=3)
        mpage = mctx.new_page()
        try:
            mpage.goto(URL, wait_until="domcontentloaded", timeout=60000)
            mpage.wait_for_timeout(5000)
        except PlaywrightTimeoutError:
            result["errors"].append("Mobile load timeout")
        mpage.screenshot(path=str(out_dir / "abdulrahmanazam-mobile.png"), full_page=False)
        result["viewports"]["mobile"] = audit(mpage,375,812)
        result["mobile_tap_targets_under_48"] = mobile_taps(mpage)
        mctx.close()
    finally:
        browser.close()

(out_dir / "visual_audit.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
print(json.dumps({
    "page_title": result["page_title"],
    "final_url": result["final_url"],
    "load_status": result["load_status"],
    "desktop_cta_above_fold": result["viewports"].get("desktop",{}).get("cta_count_above_fold"),
    "mobile_cta_above_fold": result["viewports"].get("mobile",{}).get("cta_count_above_fold"),
    "mobile_tap_targets_under_48": len(result["mobile_tap_targets_under_48"]),
    "errors": result["errors"]
}, indent=2))


