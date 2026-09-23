"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsClient();

  if (!mounted) {
    return (
      <button
        className="h-9 w-9 rounded-lg glass flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  function toggle() {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  }

  return (
    <button
      onClick={toggle}
      className="relative h-9 w-9 rounded-lg glass hover:bg-accent/10 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Toggle theme"
      title={theme === "system" ? "System theme" : isDark ? "Dark" : "Light"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <m.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4 text-foreground" />
          </m.div>
        ) : (
          <m.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4 text-foreground" />
          </m.div>
        )}
      </AnimatePresence>

      {theme === "system" && (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
