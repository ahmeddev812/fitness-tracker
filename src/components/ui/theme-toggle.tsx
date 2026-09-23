"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { m } from "framer-motion";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

type ThemeValue = (typeof OPTIONS)[number]["value"];

interface ThemeToggleProps {
  /** Show text labels next to icons (use only in wide headers) */
  showLabels?: boolean;
}

export function ThemeToggle({ showLabels = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useIsClient();

  if (!mounted) {
    return (
      <div
        className={`h-8 rounded-lg glass animate-pulse ${showLabels ? "w-[140px]" : "w-[96px]"}`}
        aria-hidden="true"
      />
    );
  }

  const active = (
    theme === "light" || theme === "dark" || theme === "system" ? theme : "system"
  ) as ThemeValue;

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="relative flex h-8 shrink-0 items-center rounded-lg glass border border-border/60 p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = active === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={[
              "relative flex h-7 min-w-7 items-center justify-center gap-1 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              showLabels ? "px-2" : "px-1.5",
              selected ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {selected && (
              <m.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-md gradient-primary shadow-glow"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {showLabels && <span className="hidden lg:inline">{label}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
