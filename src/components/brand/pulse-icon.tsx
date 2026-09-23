"use client";

import { useId } from "react";
import { m } from "framer-motion";

export const PULSE_WAVE_PATH =
  "M0,12 L4,12 L6,6 L9,18 L12,12 L16,12 L18,8 L21,16 L24,12";

export interface PulseIconProps {
  className?: string;
  animate?: boolean;
  tone?: "gradient" | "white";
  strokeWidth?: number;
  label?: string;
}

export function PulseIcon({
  className = "h-8 w-8",
  animate = true,
  tone = "gradient",
  strokeWidth = 2,
  label,
}: PulseIconProps) {
  const reactId = useId();
  const uid = reactId.replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `pulse-grad-${uid}`;
  const shouldAnimate = animate;
  const startColor = tone === "white" ? "#FFFFFF" : "var(--color-primary)";
  const endColor = tone === "white" ? "#FFFFFF" : "var(--color-accent)";

  return (
    <svg
      viewBox="-2 2 28 20"
      className={className}
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="0"
          y1="12"
          x2="24"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={startColor} />
          <stop offset="1" stopColor={endColor} />
        </linearGradient>
      </defs>

      <m.path
        d={PULSE_WAVE_PATH}
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={shouldAnimate ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      <m.g
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldAnimate ? 0.7 : 0, duration: 0.35 }}
      >
        <m.circle
          cx="6"
          cy="6"
          r="4"
          fill={endColor}
          opacity={0.25}
          animate={shouldAnimate ? { r: [4, 5.6, 4] } : undefined}
          transition={{
            duration: 1.5,
            repeat: shouldAnimate ? Infinity : 0,
            ease: "easeInOut",
            delay: shouldAnimate ? 1.2 : 0,
          }}
        />
        <m.circle
          cx="6"
          cy="6"
          r="1.8"
          fill={endColor}
          animate={shouldAnimate ? { r: [1.8, 2.52, 1.8] } : undefined}
          transition={{
            duration: 1.5,
            repeat: shouldAnimate ? Infinity : 0,
            ease: "easeInOut",
            delay: shouldAnimate ? 1.2 : 0,
          }}
        />
      </m.g>
    </svg>
  );
}
