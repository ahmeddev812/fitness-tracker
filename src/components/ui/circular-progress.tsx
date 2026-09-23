"use client";

import { m } from "framer-motion";

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showValue?: boolean;
  variant?: "primary" | "success" | "warning" | "destructive" | "gradient";
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  label,
  showValue = true,
  variant = "gradient",
  className = "",
}: CircularProgressProps) {
  const rawPercent = max > 0 ? (value / max) * 100 : 0;
  const clampedPercent = Math.min(rawPercent, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercent / 100) * circumference;

  const gradientId = `cp-grad-${variant}-${size}`;

  return (
    <div
      className={["relative inline-flex items-center justify-center", className].join(" ")}
      role="progressbar"
      aria-valuenow={Math.round(rawPercent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Progress: ${Math.round(rawPercent)}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        <m.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          stroke={variant === "gradient" ? `url(#${gradientId})` : undefined}
          className={variant !== "gradient" ? [
            variant === "primary" && "stroke-primary",
            variant === "success" && "stroke-success",
            variant === "warning" && "stroke-warning",
            variant === "destructive" && "stroke-destructive",
          ].filter(Boolean).join(" ") : undefined}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      {showValue && (
        <span className="absolute text-sm font-bold text-foreground tabular-nums">
          {Math.round(rawPercent)}%
        </span>
      )}
    </div>
  );
}
