"use client";

import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import { useEffect, useMemo, useState } from "react";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function useDarkMode() {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  const [theme, setTheme] = useLocalStorage("theme", isDarkOS ? "dark" : "light");
  const [mounted, setMounted] = useState(false);

  const isDarkMode = useMemo(() => theme === "dark", [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggle = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  return {
    isDarkMode: mounted ? isDarkMode : false,
    toggle,
    mounted,
  };
}
