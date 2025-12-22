import { useCallback } from "react";
import { useLenis } from "lenis/react";

export function useSmoothScroll() {
  const lenis = useLenis();

  return useCallback(
    (target, options = {}) => {
      if (!target) return;

      const node = typeof target === "string" ? document.querySelector(target) : target;
      if (!node) return;

      const merged = {
        offset: -120,
        duration: 1,
        ...options,
      };

      if (node instanceof HTMLElement) {
        if (lenis) {
          lenis.scrollTo(node, merged);
          return;
        }
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenis]
  );
}
