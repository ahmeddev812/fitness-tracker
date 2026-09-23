"use client";

import type { ReactNode } from "react";
import { memo } from "react";
import { m } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  delay?: number;
  className?: string;
}

function StatCardImpl({
  label,
  value,
  icon,
  description,
  trend,
  trendValue,
  delay = 0,
  className = "",
}: StatCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={[
        "group relative rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:border-primary/30 hover-lift hover:shadow-premium",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
        </div>
        {icon && (
          <div className="relative">
            <div className="absolute inset-0 gradient-primary rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative gradient-primary rounded-xl p-2 text-white">
              {icon}
            </div>
          </div>
        )}
      </div>
      {(description || trendValue) && (
        <div className="mt-2 flex items-center gap-1.5">
          {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-success" aria-label="Trending up" />}
          {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-destructive" aria-label="Trending down" />}
          {trendValue && <span className="text-xs text-muted-foreground">{trendValue}</span>}
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
      )}
    </m.div>
  );
}

export const StatCard = memo(StatCardImpl);
StatCard.displayName = "StatCard";
