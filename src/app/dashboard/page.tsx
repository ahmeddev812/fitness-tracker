"use client";

import dynamic from "next/dynamic";
import { useFitnessData } from "@/hooks/useFitnessData";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { HeroProgressCard } from "@/components/dashboard/hero-progress-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TodayHighlights } from "@/components/dashboard/today-highlights";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { EmptyState } from "@/components/ui/empty-state";

const WeeklyChart = dynamic(
  () =>
    import("@/components/dashboard/weekly-chart").then(
      (mod) => mod.WeeklyChart,
    ),
  { loading: () => <div className="h-64 rounded-2xl bg-muted/40 animate-pulse" /> },
);

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
      <div className="space-y-6 md:space-y-8">
        <HeroProgressCard />
        <QuickActions />
        <TodayHighlights />
        <ActivityFeed />
        <WeeklyChart />
      </div>
    </div>
  );
}
