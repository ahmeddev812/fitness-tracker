"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { getLastNDays } from "@/lib/dates";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeightChartProps {
  days?: number;
}

function formatDay(dateKey: string): string {
  const parts = dateKey.split("-");
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 shadow-premium border border-border/60 text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-muted-foreground">
          {entry.name}: <span className="font-medium text-foreground">{Number(entry.value).toFixed(1)} kg</span>
        </p>
      ))}
    </div>
  );
}

export function WeightChart({ days = 30 }: WeightChartProps) {
  const { weights, isHydrated } = useFitnessData();
  const prefersReducedMotion = useReducedMotion();

  const data = useMemo(() => {
    if (!isHydrated) return [];
    const dateKeys = getLastNDays(days);
    return dateKeys.map((date) => {
      const entry = [...weights]
        .sort((a, b) => b.date.localeCompare(a.date))
        .find((w) => w.date === date);
      return {
        date,
        label: formatDay(date),
        weight: entry?.weightKg,
      };
    });
  }, [weights, isHydrated, days]);

  if (!isHydrated) {
    return (
      <Card className="p-5">
        <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4" />
        <div className="h-56 bg-muted rounded animate-pulse" />
      </Card>
    );
  }

  const hasData = data.some((d) => d.weight != null);

  if (!hasData) {
    return (
      <Card variant="elevated" className="p-5">
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Weight Trend — {days} days</p>
          <EmptyState
            title="No weight data"
            description="Log your weight to see the trend chart"
            className="py-6"
          />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.filter((d) => d.weight != null);

  const min = Math.min(...chartData.map((d) => d.weight!));
  const max = Math.max(...chartData.map((d) => d.weight!));
  const padding = Math.max((max - min) * 0.15, 0.5);

  return (
    <Card variant="elevated" className="p-5">
      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Weight Trend — {days} days</p>
        <div className="sr-only" role="img" aria-label={`Weight chart for the last ${days} days. ${chartData.length} data points recorded.`}>
          {chartData.map((d) => `${d.label}: ${d.weight} kg`).join(", ")}
        </div>
        <div className="h-56" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`weightGrad-${days}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                className="text-xs"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={Math.max(Math.floor(chartData.length / 6), 0)}
              />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 11 }}
                width={40}
                axisLine={false}
                tickLine={false}
                domain={[min - padding, max + padding]}
                tickFormatter={(v: number) => v.toFixed(0)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill={`url(#weightGrad-${days})`}
                name="Weight"
                connectNulls={false}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
