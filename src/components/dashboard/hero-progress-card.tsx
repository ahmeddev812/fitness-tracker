"use client";

import { memo, useState } from "react";
import { m } from "framer-motion";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import {
  sumMealsForDate,
  getProgressPercent,
  clampPercent,
  getWaterTotalForDate,
} from "@/lib/calculations";
import { todayKey } from "@/lib/dates";
import type { Workout } from "@/types/fitness";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { useToast } from "@/components/ui/toast";
import { Dumbbell } from "lucide-react";

function HeroProgressCardImpl() {
  const { meals, water, workouts, profile, isHydrated } = useFitnessData();
  const { addWorkout } = useFitnessActions();
  const { toast } = useToast();
  const [workoutOpen, setWorkoutOpen] = useState(false);

  if (!isHydrated) {
    return (
      <Card className="p-6">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-6 flex flex-col items-center gap-6 md:flex-row">
          <div className="h-32 w-32 animate-pulse rounded-full bg-muted" />
          <div className="w-full flex-1 space-y-5">
            <div className="h-12 animate-pulse rounded-xl bg-muted" />
            <div className="h-12 animate-pulse rounded-xl bg-muted" />
            <div className="h-12 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </Card>
    );
  }

  const today = todayKey();
  const mealTotals = sumMealsForDate(meals, today);
  const calories = Math.round(mealTotals.calories);
  const calorieTarget = profile.calorieTarget;
  const calPercent = clampPercent(getProgressPercent(calories, calorieTarget));

  const waterMl = getWaterTotalForDate(water, today);
  const waterTarget = profile.waterTargetMl;
  const waterPercent = clampPercent(getProgressPercent(waterMl, waterTarget));

  const workoutsToday = workouts.filter((w) => w.date === today).length;
  const workoutPercent = workoutsToday > 0 ? 100 : 0;

  const overall = Math.round((calPercent + waterPercent + workoutPercent) / 3);

  const handleWorkoutSave = (data: Omit<Workout, "id" | "createdAt" | "updatedAt">) => {
    addWorkout(data);
    toast("Workout added", "success");
    setWorkoutOpen(false);
  };

  const rows = [
    {
      label: "Calories",
      value: calories,
      suffix: `/ ${calorieTarget.toLocaleString()} kcal`,
      percent: calPercent,
    },
    {
      label: "Water",
      value: waterMl.toLocaleString(),
      suffix: `/ ${waterTarget.toLocaleString()} ml`,
      percent: waterPercent,
    },
    {
      label: "Workouts",
      value: workoutsToday,
      suffix: "logged today",
      percent: workoutPercent,
    },
  ];

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Today&apos;s Progress
        </p>

        <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative shrink-0 self-center md:self-auto">
            <CircularProgress
              value={overall}
              max={100}
              size={132}
              strokeWidth={10}
              showValue={false}
              label="Overall progress today"
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold leading-none tabular-nums text-foreground">
                {overall}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">%</span>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            {rows.map((row) => (
              <div key={row.label}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="min-w-0 truncate text-sm text-muted-foreground tabular-nums">
                    <span className="text-2xl font-bold text-foreground">{row.value}</span>{" "}
                    {row.suffix}
                  </span>
                </div>
                <ProgressBar
                  value={row.percent}
                  max={100}
                  size="sm"
                  variant={row.label === "Water" ? "success" : "primary"}
                  showValue={false}
                  className="mt-2"
                />
              </div>
            ))}
          </div>

          <div className="w-full md:w-auto">
            <Button
              variant="gradient"
              size="lg"
              className="w-full md:w-auto"
              onClick={() => setWorkoutOpen(true)}
              aria-label="Log a workout"
            >
              <Dumbbell className="h-5 w-5" aria-hidden="true" />
              Log Workout
            </Button>
          </div>
        </div>
      </Card>

      <WorkoutForm
        open={workoutOpen}
        onClose={() => setWorkoutOpen(false)}
        onSave={handleWorkoutSave}
      />
    </m.div>
  );
}

export const HeroProgressCard = memo(HeroProgressCardImpl);
HeroProgressCard.displayName = "HeroProgressCard";
