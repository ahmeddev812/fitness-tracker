"use client";

import { PulseIcon } from "./pulse-icon";

export interface PulseLogoProps {
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "gradient" | "white";
  showWordmark?: boolean;
  animate?: boolean;
}

const SIZE_STYLES = {
  sm: { icon: "h-7 w-7", text: "text-sm" },
  md: { icon: "h-8 w-8", text: "text-base" },
  lg: { icon: "h-10 w-10", text: "text-lg" },
  xl: { icon: "h-14 w-14", text: "text-2xl" },
} as const;

export function PulseLogo({
  className,
  iconClassName,
  size = "md",
  tone = "gradient",
  showWordmark = true,
  animate = true,
}: PulseLogoProps) {
  const styles = SIZE_STYLES[size];

  return (
    <span
      className={["inline-flex items-center gap-2 select-none font-sans", className]
        .filter(Boolean)
        .join(" ")}
    >
      <PulseIcon
        className={[styles.icon, iconClassName].filter(Boolean).join(" ")}
        tone={tone}
        animate={animate}
        label={showWordmark ? undefined : "PULSE"}
      />
      {showWordmark && (
        <span
          className={[
            "font-bold tracking-[0.05em] leading-none",
            tone === "white" ? "text-white" : "gradient-text",
            styles.text,
          ].join(" ")}
        >
          PULSE
        </span>
      )}
    </span>
  );
}
