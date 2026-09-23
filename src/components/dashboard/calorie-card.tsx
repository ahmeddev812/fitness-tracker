"use client";

import { memo } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import { sumMealsForDate, getProgressPercent, clampPercent, getRemainingCalories } from "@/lib/calculations";
import { todayKey } from "@/lib/dates";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { m } from "framer-motion";

function CalorieCardImpl() {
  const { meals, profile, isHydrated } = useFitnessData();

  if (!isHydrated) {
    return <Card className="p-5"><div className="space-y-3"><div className="h-4 w-24 bg-muted rounded animate-pulse" /><div className="h-8 w-16 bg-muted rounded animate-pulse" /><div className="h-2.5 w-full bg-muted rounded-full animate-pulse" /></div></Card>;
  }

  const today = todayKey();
  const totals = sumMealsForDate(meals, today);
  const target = profile.calorieTarget;
  const remaining = getRemainingCalories(target, totals.calories);
  const percent = getProgressPercent(totals.calories, target);
  const isOver = remaining < 0;

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
    >
      <Card hover className="p-5">
        <CardContent>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Calories</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold tabular-nums">{Math.round(totals.calories)}</span>
                <span className="text-sm text-muted-foreground">/ {target}</span>
              </div>
            </div>
            <CircularProgress
              value={clampPercent(percent)}
              max={100}
              size={56}
              strokeWidth={5}
              showValue={false}
            />
          </div>
          <p className="text-xs mt-2">
            {isOver ? (
              <span className="text-destructive font-medium">Over by {Math.abs(Math.round(remaining))} kcal</span>
            ) : (
              <span className="text-muted-foreground">{Math.round(remaining)} kcal remaining</span>
            )}
          </p>
        </CardContent>
      </Card>
    </m.div>
  );
}

export const CalorieCard = memo(CalorieCardImpl);
CalorieCard.displayName = "CalorieCard";
