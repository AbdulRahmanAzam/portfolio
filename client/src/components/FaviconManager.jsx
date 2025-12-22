import { useEffect } from "react";
import { useDarkMode } from "../hooks/use-dark-mode";

/**
 * Keeps the favicon in sync with the app theme toggle.
 */
export function FaviconManager() {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const link = document.getElementById("favicon-dynamic") ||
      (() => {
        const l = document.createElement("link");
        l.id = "favicon-dynamic";
        l.rel = "icon";
        l.type = "image/svg+xml";
        document.head.appendChild(l);
        return l;
      })();

    link.href = isDarkMode ? "/favicon-dark.svg" : "/favicon-light.svg";
  }, [isDarkMode]);

  return null;
}
