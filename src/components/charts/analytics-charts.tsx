"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { m } from "framer-motion";

function GlassTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 shadow-premium border border-border/60 text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-muted-foreground">
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}:{" "}
          <span className="font-medium text-foreground">
            {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

const PIE_COLORS = [
  "var(--color-primary)",
  "oklch(0.63 0.19 145)",
  "oklch(0.77 0.16 75)",
];

interface AnalyticsChartsProps {
  calorieData: Array<{ date: string; calories: number }>;
  macroData: Array<{ name: string; value: number }>;
  waterData: Array<{ date: string; water: number }>;
  workoutFreq: Array<{ date: string; workouts: number }>;
  weightTrend: Array<{ date: string; weight: number }>;
}

const INITIAL_CHARTS = 2;

function ChartSection({
  title,
  delay = 0,
  children,
}: {
  title: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {children}
    </m.div>
  );
}

export default function AnalyticsCharts({
  calorieData,
  macroData,
  waterData,
  workoutFreq,
  weightTrend,
}: AnalyticsChartsProps) {
  const [showAll, setShowAll] = useState(false);

  const charts: Array<{ key: string; title: string; node: React.ReactNode }> = [
    {
      key: "calories",
      title: "Calories Over Time",
      node: (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calorieData} accessibilityLayer>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<GlassTooltip />} />
              <Bar
                dataKey="calories"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                name="Calories"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      key: "macros",
      title: "Macro Split",
      node:
        macroData.length > 0 ? (
          <>
            <div className="flex h-48 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                    isAnimationActive={false}
                  >
                    {macroData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<GlassTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              {macroData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  {d.name}: {d.value}g
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No macro data"
            description="Log meals to see macro split"
            className="py-8"
          />
        ),
    },
    {
      key: "water",
      title: "Water Intake",
      node: (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterData} accessibilityLayer>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<GlassTooltip />} />
              <Bar
                dataKey="water"
                fill="var(--color-info)"
                radius={[4, 4, 0, 0]}
                name="Water (ml)"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      key: "frequency",
      title: "Workout Frequency",
      node: (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workoutFreq} accessibilityLayer>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={20}
                allowDecimals={false}
              />
              <Tooltip content={<GlassTooltip />} />
              <Bar
                dataKey="workouts"
                fill="var(--color-accent)"
                radius={[4, 4, 0, 0]}
                name="Workouts"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
  ];

  if (weightTrend.length > 0) {
    charts.push({
      key: "weight",
      title: "Weight Trend",
      node: (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightTrend} accessibilityLayer>
              <defs>
                <linearGradient id="weightGradAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<GlassTooltip />} />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#weightGradAnalytics)"
                name="Weight (kg)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ),
    });
  }

  const visible = showAll ? charts : charts.slice(0, INITIAL_CHARTS);
  const hidden = charts.length - visible.length;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6">
        {visible.map((chart, i) => (
          <ChartSection key={chart.key} title={chart.title} delay={Math.min(i, 4) * 0.05}>
            {chart.node}
          </ChartSection>
        ))}
      </div>
      {hidden > 0 && (
        <div className="mt-5 flex justify-center">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            Show {hidden} more chart{hidden !== 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  );
}
