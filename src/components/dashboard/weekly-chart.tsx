"use client";

import { memo, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { getWeeklySeries } from "@/lib/calculations";
import { ChartCard } from "@/components/ui/chart-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDay(dateKey: string): string {
  const parts = dateKey.split("-");
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return SHORT_DAYS[d.getDay()];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 shadow-premium border border-border/60 text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-medium text-foreground">{typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function WeeklyChartImpl() {
  const { weights, meals, isHydrated } = useFitnessData();
  const prefersReducedMotion = useReducedMotion();

  const data = useMemo(() => {
    if (!isHydrated) return [];
    return getWeeklySeries(weights, meals, 7);
  }, [weights, meals, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4" />
        <div className="h-48 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  const hasWeightData = data.some((d) => d.weight != null);
  const hasCalorieData = data.some((d) => d.calories != null);

  if (!hasWeightData && !hasCalorieData) {
    return (
      <ChartCard title="Weekly Trend" description="Last 7 days">
        <EmptyState
          title="No data yet"
          description="Log weight or meals to see your weekly trend"
          className="py-8"
        />
      </ChartCard>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    day: formatDay(d.date),
  }));

  return (
    <ChartCard title="Weekly Trend" description="Last 7 days">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.63 0.19 145)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="oklch(0.63 0.19 145)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} width={40} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {hasWeightData && (
              <Area
                type="monotone"
                dataKey="weight"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#gradWeight)"
                name="Weight (kg)"
                connectNulls={false}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={300}
              />
            )}
            {hasCalorieData && (
              <Area
                type="monotone"
                dataKey="calories"
                stroke="oklch(0.63 0.19 145)"
                strokeWidth={2}
                fill="url(#gradCalories)"
                name="Calories"
                connectNulls={false}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={300}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export const WeeklyChart = memo(WeeklyChartImpl);
WeeklyChart.displayName = "WeeklyChart";
