"use client";

import { useRef, useEffect, useState } from "react";

// Read base theme color from CSS var
function getBaseHsl() {
  const rs = getComputedStyle(document.documentElement);
  const raw = rs.getPropertyValue("--cursor-trail").trim() || "217 90% 54%";
  const parts = raw.split(/\s+/);
  let h = 217, s = 90, l = 54;
  if (parts.length >= 3) {
    h = parseFloat(parts[0]);
    s = parseFloat(parts[1]);
    l = parseFloat(parts[2]);
  }
  const isDark = document.documentElement.classList.contains("dark");
  return { h, s, l, isDark };
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

// Compute per-circle color from base theme HSL
function colorFor(index, total, base) {
  const t = total > 1 ? index / (total - 1) : 0;
  const hueDrift = base.isDark ? -6 : 8;
  const h = base.h + hueDrift * t;
  const s = clamp(base.isDark ? base.s + 8 * (1 - t) : base.s - 6 * t, 20, 100);
  const l = clamp(base.isDark ? base.l + 10 * (1 - t) : base.l - 14 * t, 8, 95);
  const alpha = clamp(0.15 + (1 - t) * 0.6, 0.15, 0.75);
  return `hsl(${h} ${s}% ${l}% / ${alpha})`;
}

const CIRCLES = 32;

export function CursorTrail() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const circleRefs = useRef([]);
  const coordsRef = useRef({ x: 0, y: 0 });
  const startedRef = useRef(false);
  const rafRef = useRef();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isCoarse) return;

    coordsRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const circles = circleRefs.current;
    const positions = Array.from({ length: circles.length }, () => ({ x: coordsRef.current.x, y: coordsRef.current.y }));

    const applyColors = () => {
      const base = getBaseHsl();
      circles.forEach((el, index) => {
        if (!el) return;
        el.style.backgroundColor = colorFor(index, circles.length, base);
      });
    };
    
    applyColors();
    
    const mo = new MutationObserver((m) => {
      for (const rec of m) {
        if (rec.type === "attributes" && rec.attributeName === "class") {
          applyColors();
        }
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const animate = () => {
      let x = coordsRef.current.x;
      let y = coordsRef.current.y;

      for (let i = 0; i < circles.length; i++) {
        const el = circles[i];
        if (!el) continue;

        const px = x - 12;
        const py = y - 12;
        const scale = (circles.length - i) / circles.length;
        el.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${scale})`;

        positions[i].x = x;
        positions[i].y = y;

        const next = positions[i + 1] || positions[0];
        x += (next.x - x) * 0.3;
        y += (next.y - y) * 0.3;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      coordsRef.current.x = e.clientX;
      coordsRef.current.y = e.clientY;
      if (!startedRef.current) {
        startedRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      document.removeEventListener("pointermove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      mo.disconnect();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div ref={containerRef} aria-hidden="true">
      {Array.from({ length: CIRCLES }, (_, i) => (
        <div
          key={i}
          className="cursor-circle"
          ref={(el) => {
            if (el) circleRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}

export default CursorTrail;
