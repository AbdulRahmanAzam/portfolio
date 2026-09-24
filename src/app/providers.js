"use client";

import { FaviconManager } from "@/components/FaviconManager";
import { CursorTrail } from "@/components/CursorTrail";
import { SmoothScroll } from "@/components/SmoothScroll";

// Only small, side-effect components live here. Nothing wraps the page,
// so the server-rendered HTML is hydrated once and never re-mounted.
export function Providers({ children }) {
  return (
    <>
      <SmoothScroll />
      <FaviconManager />
      <CursorTrail />
      {children}
    </>
  );
}
