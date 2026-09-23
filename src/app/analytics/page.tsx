"use client";

import { useState, useMemo } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  getLastNDays,
} from "@/lib/dates";
import {
  sumMealsForDate,
  getWaterTotalForDate,
} from "@/lib/calculations";
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
import { m } from "framer-motion";
import {
  Flame,
  Dumbbell,
  Apple,
  Droplets,
  TrendingUp,
} from "lucide-react";

type Period = "7d" | "30d" | "90d";

const PIE_COLORS = [
  "var(--color-primary)",
  "oklch(0.63 0.19 145)",
  "oklch(0.77 0.16 75)",
];

function GlassTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
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

export default function AnalyticsPage() {
  const { workouts, meals, water, weights, personalRecords, isHydrated } = useFitnessData();
  const [period, setPeriod] = useState<Period>("30d");

  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const dateKeys = useMemo(() => getLastNDays(days), [days]);

  const calorieData = useMemo(() => {
    return dateKeys.map((date) => ({
      date: date.slice(5),
      calories: sumMealsForDate(meals, date).calories,
    }));
  }, [meals, dateKeys]);

  const macroData = useMemo(() => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    for (const date of dateKeys) {
      const t = sumMealsForDate(meals, date);
      totalProtein += t.protein;
      totalCarbs += t.carbs;
      totalFat += t.fat;
    }
    return [
      { name: "Protein", value: Math.round(totalProtein) },
      { name: "Carbs", value: Math.round(totalCarbs) },
      { name: "Fat", value: Math.round(totalFat) },
    ].filter((d) => d.value > 0);
  }, [meals, dateKeys]);

  const waterData = useMemo(() => {
    return dateKeys.map((date) => ({
      date: date.slice(5),
      water: getWaterTotalForDate(water, date),
    }));
  }, [water, dateKeys]);

  const workoutFreq = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const w of workouts) {
      if (dateKeys.includes(w.date)) {
        counts[w.date] = (counts[w.date] || 0) + 1;
      }
    }
    return dateKeys.map((d) => ({
      date: d.slice(5),
      workouts: counts[d] || 0,
    }));
  }, [workouts, dateKeys]);

  const muscleGroupData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const w of workouts) {
      if (dateKeys.includes(w.date)) {
        for (const ex of w.exercises) {
          const name = ex.exerciseName;
          counts[name] = (counts[name] || 0) + 1;
        }
      }
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, [workouts, dateKeys]);

  const weightTrend = useMemo(() => {
    return dateKeys
      .map((date) => {
        const entry = [...weights]
          .sort((a, b) => b.date.localeCompare(a.date))
          .find((w) => w.date === date);
        return { date: date.slice(5), weight: entry?.weightKg };
      })
      .filter((d) => d.weight != null);
  }, [weights, dateKeys]);

  const totalWorkouts = workouts.filter((w) => dateKeys.includes(w.date)).length;
  const totalMeals = meals.filter((m) => dateKeys.includes(m.date)).length;
  const avgCalories = calorieData.length > 0
    ? Math.round(calorieData.reduce((s, d) => s + d.calories, 0) / calorieData.filter((d) => d.calories > 0).length || 0)
    : 0;
  const avgWater = waterData.length > 0
    ? Math.round(waterData.reduce((s, d) => s + d.water, 0) / waterData.filter((d) => d.water > 0).length || 0)
    : 0;
  const totalPRs = personalRecords.filter((r) => dateKeys.includes(r.date)).length;

  if (!isHydrated) {
    return (
      <div>
        <PageHeader title="Analytics" description="Your fitness insights" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4"><div className="space-y-2"><div className="h-4 w-16 bg-muted rounded animate-pulse" /><div className="h-6 w-12 bg-muted rounded animate-pulse" /></div></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Analytics" description="Your fitness insights">
        <div className="flex gap-1 bg-muted/60 rounded-xl p-1">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? "gradient" : "ghost"}
              onClick={() => setPeriod(p)}
              className="rounded-lg text-xs"
            >
              {p}
            </Button>
          ))}
        </div>
      </PageHeader>

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6"
      >
        <StatCard label="Workouts" value={totalWorkouts} icon={<Dumbbell className="h-4 w-4" />} delay={0} />
        <StatCard label="Meals Logged" value={totalMeals} icon={<Apple className="h-4 w-4" />} delay={0.05} />
        <StatCard label="Avg Calories" value={avgCalories} icon={<Flame className="h-4 w-4" />} delay={0.1} />
        <StatCard label="Avg Water" value={`${avgWater} ml`} icon={<Droplets className="h-4 w-4" />} delay={0.15} />
        <StatCard label="PRs Achieved" value={totalPRs} icon={<TrendingUp className="h-4 w-4" />} delay={0.2} />
      </m.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card variant="elevated" className="p-5">
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Calories Over Time</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calorieData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<GlassTooltip />} />
                    <Bar dataKey="calories" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Calories" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </m.div>

        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card variant="elevated" className="p-5">
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Macro Split</p>
              {macroData.length > 0 ? (
                <div className="h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={macroData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                        {macroData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<GlassTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState title="No macro data" description="Log meals to see macro split" className="py-8" />
              )}
              <div className="flex justify-center gap-4 mt-2">
                {macroData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    {d.name}: {d.value}g
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </m.div>

        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card variant="elevated" className="p-5">
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Water Intake</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<GlassTooltip />} />
                    <Bar dataKey="water" fill="var(--color-info)" radius={[4, 4, 0, 0]} name="Water (ml)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </m.div>

        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card variant="elevated" className="p-5">
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Workout Frequency</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workoutFreq}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={20} allowDecimals={false} />
                    <Tooltip content={<GlassTooltip />} />
                    <Bar dataKey="workouts" fill="var(--color-accent)" radius={[4, 4, 0, 0]} name="Workouts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </m.div>
      </div>

      {weightTrend.length > 0 && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
          <Card variant="elevated" className="p-5">
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Weight Trend</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightTrend}>
                    <defs>
                      <linearGradient id="weightGradAnalytics" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<GlassTooltip />} />
                        <Area type="monotone" dataKey="weight" stroke="var(--color-primary)" strokeWidth={2} fill="url(#weightGradAnalytics)" name="Weight (kg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </m.div>
      )}

      {muscleGroupData.length > 0 && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card variant="elevated" className="p-5">
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Most Trained Exercises</p>
              <div className="space-y-2">
                {muscleGroupData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1 h-6 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-primary rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / muscleGroupData[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground w-24 truncate">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.count}x</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </m.div>
      )}
    </div>
  );
}
