"use client";

import dynamic from "next/dynamic";
import { m } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CalorieCard } from "@/components/dashboard/calorie-card";
import { ProteinCard } from "@/components/dashboard/protein-card";
import { WaterCard } from "@/components/dashboard/water-card";
import { ActivityCard } from "@/components/dashboard/activity-card";
import { WorkoutCard } from "@/components/dashboard/workout-card";
import { WeightCard } from "@/components/dashboard/weight-card";
import { GoalCard } from "@/components/dashboard/goal-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { LevelCard } from "@/components/dashboard/level-card";
import { EmptyState } from "@/components/ui/empty-state";
import { sumMealsForDate, getRemainingCalories } from "@/lib/calculations";
import { getWaterTotalForDate } from "@/lib/calculations";
import { todayKey } from "@/lib/dates";
import { Dumbbell, UtensilsCrossed, Droplets, Flame } from "lucide-react";

const WeeklyChart = dynamic(
  () =>
    import("@/components/dashboard/weekly-chart").then(
      (mod) => mod.WeeklyChart,
    ),
  { loading: () => <div className="h-64 rounded-2xl bg-muted/40 animate-pulse" /> },
);

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function SummaryStrip() {
  const { workouts, meals, water, profile, isHydrated } = useFitnessData();

  if (!isHydrated) {
    return (
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-32 bg-muted rounded-lg animate-pulse shrink-0" />
        ))}
      </div>
    );
  }

  const today = todayKey();
  const workoutsToday = workouts.filter((w) => w.date === today).length;
  const mealsToday = meals.filter((m) => m.date === today).length;
  const waterMl = getWaterTotalForDate(water, today);
  const waterTarget = profile.waterTargetMl;
  const waterPercent = waterTarget > 0 ? Math.min(Math.round((waterMl / waterTarget) * 100), 100) : 0;
  const mealTotals = sumMealsForDate(meals, today);
  const remaining = getRemainingCalories(profile.calorieTarget, mealTotals.calories);

  const items = [
    { icon: Dumbbell, label: "Workouts", value: String(workoutsToday) },
    { icon: UtensilsCrossed, label: "Meals", value: String(mealsToday) },
    { icon: Droplets, label: "Water", value: `${waterPercent}%` },
    { icon: Flame, label: "Cal Left", value: `${Math.round(remaining)}` },
  ];

  return (
    <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 px-3 py-2 rounded-xl glass-strong text-sm shrink-0"
        >
          <item.icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{item.label}</span>
          <span className="font-semibold tabular-nums">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function hasAnyData(
  workouts: ReturnType<typeof useFitnessData>["workouts"],
  meals: ReturnType<typeof useFitnessData>["meals"],
  water: ReturnType<typeof useFitnessData>["water"],
  weights: ReturnType<typeof useFitnessData>["weights"],
  goals: ReturnType<typeof useFitnessData>["goals"],
): boolean {
  return workouts.length > 0 || meals.length > 0 || water.length > 0 || weights.length > 0 || goals.length > 0;
}

export default function DashboardPage() {
  const { workouts, meals, water, weights, goals, isHydrated } = useFitnessData();

  if (isHydrated && !hasAnyData(workouts, meals, water, weights, goals)) {
    return (
      <div>
        <DashboardHeader />
        <EmptyState
          title="Start your journey"
          description="Log your first workout, meal, or water entry to see your progress come alive."
          action={
            <div className="mt-2">
              <QuickActions />
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader />
      <SummaryStrip />
      <QuickActions />
      <m.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
      >
        <m.div variants={fadeUp}><CalorieCard /></m.div>
        <m.div variants={fadeUp}><ProteinCard /></m.div>
        <m.div variants={fadeUp}><WaterCard /></m.div>
        <m.div variants={fadeUp}><ActivityCard /></m.div>
        <m.div variants={fadeUp}><WorkoutCard /></m.div>
        <m.div variants={fadeUp}><WeightCard /></m.div>
        <m.div variants={fadeUp}><GoalCard /></m.div>
        <m.div variants={fadeUp}><LevelCard /></m.div>
        <m.div variants={fadeUp} className="md:col-span-2 lg:col-span-2">
          <WeeklyChart />
        </m.div>
        <m.div variants={fadeUp} className="md:col-span-2 lg:col-span-3">
          <ActivityFeed />
        </m.div>
      </m.div>
    </div>
  );
}
