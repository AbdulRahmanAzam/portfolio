"use client";

import { useEffect } from "react";

const HEADER_OFFSET = 80;

// 1. Lenis smooth wheel scrolling for mouse/trackpad users only. It renders
//    nothing and never wraps the page, so turning it on can't re-mount the
//    content. Phones keep native scrolling and never download it.
// 2. In-page link correction for everyone: sections below the fold use
//    content-visibility, so their real height is only known once they render
//    during the scroll. When the scroll settles we nudge the target back under
//    the header if it moved.
export function SmoothScroll() {
  useEffect(() => {
    let lenis;
    let cancelled = false;

    const canSmooth =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canSmooth) {
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({
          lerp: 0.08,
          wheelMultiplier: 0.7,
          autoRaf: true,
          // Handles clicks on in-page links like <a href="#projects">
          anchors: { offset: -HEADER_OFFSET, duration: 1 },
        });
      });
    }

    let settleTimer;
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]');
      const id = link?.getAttribute("href").slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;

      let corrections = 0;
      let lastY = -1;
      clearInterval(settleTimer);
      settleTimer = setInterval(() => {
        if (window.scrollY !== lastY) {
          lastY = window.scrollY; // still moving
          return;
        }
        const drift = target.getBoundingClientRect().top - HEADER_OFFSET;
        if (Math.abs(drift) > 8 && corrections < 3) {
          corrections++;
          lastY = -1;
          if (lenis) lenis.scrollTo(target, { offset: -HEADER_OFFSET, duration: 0.6 });
          else window.scrollTo({ top: window.scrollY + drift, behavior: "smooth" });
          return;
        }
        clearInterval(settleTimer);
      }, 150);
    };
    // If the visitor starts scrolling themselves, stop correcting.
    const stop = () => clearInterval(settleTimer);
    document.addEventListener("click", onClick);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);

    return () => {
      cancelled = true;
      clearInterval(settleTimer);
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      lenis?.destroy();
    };
  }, []);

  return null;
}
