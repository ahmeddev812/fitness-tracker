"use client";

import { m } from "framer-motion";
import { PulseIcon } from "./pulse-icon";

export interface PulseLoaderProps {
  className?: string;
  variant?: "inline" | "center";
  size?: "sm" | "md" | "lg";
  label?: string;
}

const ICON_SIZES = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
} as const;

export function PulseLoader({
  className,
  variant = "inline",
  size = "md",
  label,
}: PulseLoaderProps) {
  if (variant === "center") {
    return (
      <div
        className={["flex flex-col items-center gap-4", className]
          .filter(Boolean)
          .join(" ")}
        role="status"
        aria-live="polite"
        aria-label={label ?? "Loading"}
      >
        <div className="relative flex items-center justify-center">
          <m.span
            className="absolute h-20 w-20 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            aria-hidden="true"
          />
          <m.span
            className="relative block"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <PulseIcon className={ICON_SIZES[size]} />
          </m.span>
        </div>
        <span className="gradient-text font-bold tracking-[0.05em] text-sm">
          PULSE
        </span>
        {label && (
          <span className="text-xs text-muted-foreground" aria-hidden="true">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={["inline-flex items-center gap-2", className]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-label={label ?? "Loading"}
    >
      <m.span
        className="block"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <PulseIcon className={ICON_SIZES[size]} />
      </m.span>
      <span className="gradient-text font-bold tracking-[0.05em] text-xs">
        PULSE
      </span>
    </div>
  );
}
