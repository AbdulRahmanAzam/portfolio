import json
import os
import re
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright


URL = "https://abdulrahmanazam.me/"
OUTPUT_DIR = Path("screenshots")
REPORT_PATH = OUTPUT_DIR / "visual_seo_report.json"

VIEWPORTS = [
    ("desktop", 1920, 1080),
    ("mobile", 375, 812),
    ("laptop", 1366, 768),
    ("tablet", 768, 1024),
]

JS_AUDIT = r"""
() => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const reCtaText = /(contact|get in touch|hire|book|start|let'?s talk|view project|portfolio|work with me|resume|cv|email|call|learn more)/i;

  const toRect = (el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      width: Math.round(r.width),
      height: Math.round(r.height),
      top: Math.round(r.top),
      left: Math.round(r.left),
      right: Math.round(r.right),
      bottom: Math.round(r.bottom)
    };
  };

  const inViewport = (rect) => rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;

  const isVisible = (el) => {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity || '1') < 0.05) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return false;
    return true;
  };

  const normalizeText = (el) => {
    const pieces = [
      el.innerText || '',
      el.textContent || '',
      el.getAttribute('aria-label') || '',
      el.getAttribute('title') || '',
      el.getAttribute('value') || ''
    ];
    return pieces.join(' ').replace(/\s+/g, ' ').trim();
  };

  const cssPath = (el) => {
    if (!el || !el.tagName) return '';
    const id = el.id ? `#${el.id}` : '';
    const cls = (el.className && typeof el.className === 'string')
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
      : '';
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  };

  const parseColor = (str) => {
    if (!str) return null;
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
    if (!m) return null;
    return {
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] !== undefined ? Number(m[4]) : 1
    };
  };

  const relLum = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const contrastRatio = (c1, c2) => {
    if (!c1 || !c2) return null;
    const l1 = 0.2126 * relLum(c1.r) + 0.7152 * relLum(c1.g) + 0.0722 * relLum(c1.b);
    const l2 = 0.2126 * relLum(c2.r) + 0.7152 * relLum(c2.g) + 0.0722 * relLum(c2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
  };

  const effectiveBgColor = (el) => {
    let node = el;
    while (node) {
      const c = parseColor(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0) return c;
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  const h1 = document.querySelector('h1');
  const h1Info = h1 && isVisible(h1)
    ? {
        text: normalizeText(h1).slice(0, 200),
        selector: cssPath(h1),
        rect: toRect(h1),
        inViewport: inViewport(h1.getBoundingClientRect())
      }
    : null;

  const clickableEls = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"], [role="button"]'));

  const clickable = clickableEls
    .filter((el) => isVisible(el))
    .map((el) => {
      const rect = toRect(el);
      const text = normalizeText(el);
      const cls = `${el.id || ''} ${(el.className && typeof el.className === 'string') ? el.className : ''}`;
      const classCta = /(cta|primary|btn|contact|hire|start)/i.test(cls);
      const textCta = reCtaText.test(text);
      const ctaScore = (textCta ? 5 : 0) + (classCta ? 3 : 0) + (inViewport(rect) ? 2 : 0) + ((rect.width * rect.height) > 2500 ? 1 : 0);
      return {
        selector: cssPath(el),
        text: text.slice(0, 120),
        rect,
        area: rect.width * rect.height,
        inViewport: inViewport(rect),
        likelyCta: textCta || classCta,
        ctaScore,
        touchTargetSmall: rect.width < 48 || rect.height < 48
      };
    })
    .filter((x) => x.text.length > 0 || x.area > 400)
    .sort((a, b) => b.ctaScore - a.ctaScore || a.rect.top - b.rect.top);

  const ctas = clickable.filter((x) => x.likelyCta).slice(0, 8);
  const firstFoldCtas = ctas.filter((x) => x.inViewport);

  const nav = document.querySelector('header, nav');
  const navInfo = nav && isVisible(nav)
    ? {
        selector: cssPath(nav),
        rect: toRect(nav),
        inViewport: inViewport(nav.getBoundingClientRect()),
        position: getComputedStyle(nav).position
      }
    : null;

  const menuCandidates = Array.from(document.querySelectorAll('button, [role="button"], a'))
    .filter((el) => isVisible(el))
    .filter((el) => {
      const text = normalizeText(el);
      const marker = `${text} ${el.getAttribute('aria-label') || ''} ${el.className || ''}`;
      return /(menu|hamburger|open navigation|open menu|toggle navigation)/i.test(marker);
    })
    .slice(0, 5)
    .map((el) => ({ selector: cssPath(el), text: normalizeText(el).slice(0, 80), rect: toRect(el) }));

  const paras = Array.from(document.querySelectorAll('p, li'))
    .filter((el) => isVisible(el))
    .slice(0, 25)
    .map((el) => {
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize || '0');
      const lhRaw = cs.lineHeight || '';
      const lh = lhRaw.includes('px') ? parseFloat(lhRaw) : (Number.isFinite(fs) ? fs * 1.4 : null);
      const txt = normalizeText(el);
      return {
        textLength: txt.length,
        fontSize: Number.isFinite(fs) ? fs : null,
        lineHeight: Number.isFinite(lh) ? lh : null,
      };
    });

  const average = (arr) => arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : null;

  const bodyFont = parseFloat(getComputedStyle(document.body).fontSize || '0');
  const avgParaFont = average(paras.map((p) => p.fontSize).filter((x) => x));
  const avgLineHeightRatio = average(paras.map((p) => (p.lineHeight && p.fontSize) ? (p.lineHeight / p.fontSize) : null).filter((x) => x));
  const avgTextLength = average(paras.map((p) => p.textLength).filter((x) => x));

  const h1Contrast = h1 ? contrastRatio(parseColor(getComputedStyle(h1).color), effectiveBgColor(h1)) : null;
  const firstParaEl = document.querySelector('p');
  const paraContrast = firstParaEl ? contrastRatio(parseColor(getComputedStyle(firstParaEl).color), effectiveBgColor(firstParaEl)) : null;

  const fixedHeader = navInfo && (navInfo.position === 'fixed' || navInfo.position === 'sticky') ? navInfo : null;
  const headingObscuredByHeader = Boolean(
    fixedHeader && h1Info && h1Info.rect.top < (fixedHeader.rect.height + 8)
  );

  const topFoldClickables = clickable.filter((x) => x.inViewport);
  const smallTouchCount = clickable.filter((x) => x.touchTargetSmall).length;
  const mobileSmallTouchCount = vw <= 480 ? smallTouchCount : null;

  return {
    viewport: { width: vw, height: vh },
    title: document.title,
    url: location.href,
    h1: h1Info,
    nav: navInfo,
    menuCandidates,
    ctas,
    firstFoldCtas,
    counts: {
      clickablesTotal: clickable.length,
      topFoldClickables: topFoldClickables.length,
      likelyCtas: ctas.length,
      firstFoldCtas: firstFoldCtas.length,
      smallTouchTargets: smallTouchCount,
      mobileSmallTouchTargets: mobileSmallTouchCount,
    },
    readability: {
      bodyFontSize: Number.isFinite(bodyFont) ? bodyFont : null,
      avgParagraphFontSize: avgParaFont,
      avgLineHeightRatio,
      avgTextLength,
      h1Contrast,
      firstParagraphContrast: paraContrast,
    },
    layout: {
      horizontalOverflow: document.documentElement.scrollWidth > (document.documentElement.clientWidth + 2),
      headingObscuredByHeader,
      docScrollWidth: document.documentElement.scrollWidth,
      docClientWidth: document.documentElement.clientWidth,
    },
  };
}
"""


def run_audit() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    payload = {
        "url": URL,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "viewports": {},
        "screenshots": {},
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for name, w, h in VIEWPORTS:
            context = browser.new_context(viewport={"width": w, "height": h})
            page = context.new_page()
            page.goto(URL, wait_until="networkidle", timeout=90000)
            page.wait_for_timeout(1800)

            screenshot_path = OUTPUT_DIR / f"home-{name}-{w}x{h}.png"
            page.screenshot(path=str(screenshot_path), full_page=False)

            result = page.evaluate(JS_AUDIT)
            payload["viewports"][name] = result
            payload["screenshots"][name] = str(screenshot_path).replace("\\", "/")

            context.close()

        browser.close()

    REPORT_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Saved report: {REPORT_PATH}")
    print("Screenshots:")
    for key, path in payload["screenshots"].items():
        print(f"- {key}: {path}")


if __name__ == "__main__":
    run_audit()
