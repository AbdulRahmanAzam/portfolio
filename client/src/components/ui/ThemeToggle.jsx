import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../../hooks/use-dark-mode";
import { Switch } from "./switch";

export function ThemeToggle() {
  const { isDarkMode, toggle } = useDarkMode();

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggle}
        aria-label="Toggle theme"
        className="relative inline-flex h-6 w-11 items-center rounded-full"
      >
        <Sun className="absolute left-1 h-4 w-4 text-white transition-opacity duration-200 opacity-100 dark:opacity-0" />
        <Moon className="absolute right-1 h-4 w-4 text-white transition-opacity duration-200 opacity-0 dark:opacity-100" />
      </Switch>
    </div>
  );
}
