"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { getLastNDays } from "@/lib/dates";
import { sumMealsForDate, getWaterTotalForDate } from "@/lib/calculations";
import { m } from "framer-motion";
import { Flame, Dumbbell, Apple, Droplets, TrendingUp } from "lucide-react";

const AnalyticsCharts = dynamic(
  () => import("@/components/charts/analytics-charts"),
  {
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-56 rounded-2xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    ),
  },
);

type Period = "7d" | "30d" | "90d";

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
      .filter(
        (d): d is { date: string; weight: number } => d.weight != null,
      );
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
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-6"><div className="space-y-2"><div className="h-4 w-16 bg-muted rounded animate-pulse" /><div className="h-6 w-12 bg-muted rounded animate-pulse" /></div></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Analytics" description="Your fitness insights">
        <div className="flex gap-1 rounded-xl bg-muted/60 p-1" role="group" aria-label="Date range">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? "primary" : "ghost"}
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className="rounded-lg text-sm"
            >
              {p === "7d" ? "7 days" : p === "30d" ? "30 days" : "90 days"}
            </Button>
          ))}
        </div>
      </PageHeader>

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-5"
      >
        <StatCard label="Workouts" value={totalWorkouts} icon={<Dumbbell className="h-4 w-4" />} delay={0} />
        <StatCard label="Meals Logged" value={totalMeals} icon={<Apple className="h-4 w-4" />} delay={0.05} />
        <StatCard label="Avg Calories" value={avgCalories} icon={<Flame className="h-4 w-4" />} delay={0.1} />
        <StatCard label="Avg Water" value={`${avgWater} ml`} icon={<Droplets className="h-4 w-4" />} delay={0.15} />
        <StatCard label="PRs Achieved" value={totalPRs} icon={<TrendingUp className="h-4 w-4" />} delay={0.2} />
      </m.div>

      <AnalyticsCharts
        calorieData={calorieData}
        macroData={macroData}
        waterData={waterData}
        workoutFreq={workoutFreq}
        weightTrend={weightTrend}
      />

      {muscleGroupData.length > 0 && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Most Trained Exercises</p>
            <div className="space-y-2">
              {muscleGroupData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-4 text-xs text-muted-foreground">{i + 1}</span>
                  <div className="h-6 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(item.count / muscleGroupData[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="w-24 truncate text-xs font-medium text-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.count}x</span>
                </div>
              ))}
            </div>
          </Card>
        </m.div>
      )}
    </div>
  );
}
