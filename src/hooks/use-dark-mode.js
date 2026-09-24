"use client";

import { useSyncExternalStore } from "react";

// The inline script in layout.js sets the `dark` class on <html> before the
// first paint. That class is the single source of truth: this hook only reads
// it, so hydration never flips the theme (a flip re-styles the whole page and
// fires every CSS transition at once, which was the main cause of slow loads).

function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export function useDarkMode() {
  const isDarkMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    // Skip colour transitions for the switch itself, then restore them.
    root.classList.add("theme-switching");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", JSON.stringify(next ? "dark" : "light"));
    } catch {
      // Private mode or blocked storage: the toggle still works for this visit.
    }
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
  };

  return { isDarkMode, toggle, mounted: true };
}
