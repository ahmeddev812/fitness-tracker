"use client";

import { m } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "warning" | "destructive" | "gradient";
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const variantStyles: Record<string, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  gradient: "gradient-primary shadow-glow",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = "md",
  variant = "gradient",
  className = "",
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const rawPercent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className={["w-full", className].join(" ")}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {Math.round(rawPercent)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(rawPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progress: ${Math.round(rawPercent)}%`}
        className={[
          "w-full overflow-hidden rounded-full bg-secondary",
          sizeStyles[size],
        ].join(" ")}
      >
        <m.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: `${percent}%`, transformOrigin: "left" }}
          className={[
            "h-full rounded-full",
            variantStyles[variant],
          ].join(" ")}
        />
      </div>
    </div>
  );
}
