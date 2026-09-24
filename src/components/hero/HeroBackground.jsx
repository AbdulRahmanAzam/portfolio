"use client";

import { useEffect, useState } from "react";

// The three.js network is desktop-only decoration. It is downloaded after the
// page is idle, so it never competes with the first paint or with phones.
export function HeroBackground() {
  const [Background, setBackground] = useState(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || window.innerWidth < 1024) return;

    let cancelled = false;
    const load = () =>
      import("../NeuralNetworkBackground").then((m) => {
        if (!cancelled) setBackground(() => m.NeuralNetworkBackground);
      });

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 3000 })
      : setTimeout(load, 1500);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, []);

  return Background ? <Background className="opacity-30" /> : null;
}
