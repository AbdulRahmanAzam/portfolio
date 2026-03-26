import json
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = "https://abdulrahmanazam.me"
OUT_DIR = Path("screenshots")
OUT_DIR.mkdir(parents=True, exist_ok=True)

MOBILE_UA = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 "
    "Mobile/15E148 Safari/604.1"
)


def metrics(page, vh):
    js = """
    ({vh}) => {
      const vw = window.innerWidth;
      const txt = (el) => (el?.innerText || el?.textContent || el?.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 100);
      const vis = (el) => {
        if (!el) return false;
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.left < vw && r.top < vh;
      };
      const r = (el) => el.getBoundingClientRect();
      const above = (el) => {
        const b = r(el);
        return b.top < vh && b.bottom > 0;
      };

      const h1 = document.querySelector('h1');
      const h1Visible = !!h1 && vis(h1) && above(h1);

      const ctaWords = ['contact','hire','book','schedule','get started','start','download','view','portfolio','projects','email','call','work with me',"let's talk"];
      const controls = Array.from(document.querySelectorAll('a,button,[role="button"],input[type="submit"],input[type="button"]'));
      const ctas = controls.map(el => {
        const t = txt(el).toLowerCase();
        const box = r(el);
        const isCta = ctaWords.some(w => t.includes(w)) || el.tagName.toLowerCase() === 'button';
        return {
          tag: el.tagName.toLowerCase(),
          text: txt(el),
          x: Math.round(box.left),
          y: Math.round(box.top),
          w: Math.round(box.width),
          h: Math.round(box.height),
          visible: vis(el),
          aboveFold: vis(el) && above(el),
          isCta
        };
      }).filter(x => x.visible && x.isCta);

      const smallTaps = controls
        .map(el => {
          const box = r(el);
          return {
            tag: el.tagName.toLowerCase(),
            text: txt(el),
            width: Math.round(box.width),
            height: Math.round(box.height),
            x: Math.round(box.left),
            y: Math.round(box.top)
          };
        })
        .filter(x => x.width > 0 && x.height > 0 && (x.width < 48 || x.height < 48))
        .slice(0, 30);

      const navCandidates = Array.from(document.querySelectorAll('nav,[role="navigation"],header nav'));
      const navVisible = navCandidates.some(vis);
      const menuCandidates = Array.from(document.querySelectorAll('button,[role="button"],a'));
      const hamburgerVisible = menuCandidates.some(el => {
        const t = (txt(el) + ' ' + (el.getAttribute('aria-label') || '')).toLowerCase();
        return vis(el) && t.includes('menu');
      });

      const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;

      return {
        h1Visible,
        ctaCount: ctas.length,
        ctaAboveFoldCount: ctas.filter(c => c.aboveFold).length,
        hasCtaAboveFold: ctas.some(c => c.aboveFold),
        ctaSamples: ctas.slice(0, 10),
        navVisible,
        hamburgerVisible,
        horizontalOverflow: overflow,
        smallTapTargets: smallTaps
      };
    }
    """
    return page.evaluate(js, {"vh": vh})


report = {"url": URL, "ok": False, "error": None}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    try:
        desktop = browser.new_page(viewport={"width": 1920, "height": 1080})
        desktop.goto(URL, wait_until="domcontentloaded", timeout=90000)
        desktop.wait_for_timeout(4000)
        desktop.screenshot(path=str(OUT_DIR / "abdulrahmanazam-desktop.png"), full_page=False)
        desktop_metrics = metrics(desktop, 1080)

        mobile = browser.new_page(
            viewport={"width": 375, "height": 812},
            user_agent=MOBILE_UA,
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
        )
        mobile.goto(URL, wait_until="domcontentloaded", timeout=90000)
        mobile.wait_for_timeout(5000)
        mobile.screenshot(path=str(OUT_DIR / "abdulrahmanazam-mobile.png"), full_page=False)
        mobile_metrics = metrics(mobile, 812)

        report.update(
            {
                "ok": True,
                "title": desktop.title(),
                "finalUrl": desktop.url,
                "desktop": desktop_metrics,
                "mobile": mobile_metrics,
            }
        )
    except Exception as e:
        report["error"] = str(e)
    finally:
        browser.close()

(OUT_DIR / "visual_audit.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, indent=2))

