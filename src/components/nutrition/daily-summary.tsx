"use client";

import { useFitnessData } from "@/hooks/useFitnessData";
import { sumMealsForDate, getRemainingCalories, getProgressPercent, clampPercent } from "@/lib/calculations";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { m } from "framer-motion";

interface DailySummaryProps {
  date: string;
}

export function DailySummary({ date }: DailySummaryProps) {
  const { meals, profile, isHydrated } = useFitnessData();

  if (!isHydrated) {
    return (
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-8 w-20 bg-muted rounded animate-pulse" />
              <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const totals = sumMealsForDate(meals, date);
  const remaining = getRemainingCalories(profile.calorieTarget, totals.calories);
  const calPercent = getProgressPercent(totals.calories, profile.calorieTarget);
  const proPercent = getProgressPercent(totals.protein, profile.proteinTarget);
  const carbTarget = 0;
  const fatTarget = 0;

  const macros = [
    {
      label: "Calories",
      value: Math.round(totals.calories),
      target: profile.calorieTarget,
      unit: "kcal",
      percent: calPercent,
      remaining: Math.round(remaining),
    },
    {
      label: "Protein",
      value: Math.round(totals.protein),
      target: profile.proteinTarget,
      unit: "g",
      percent: proPercent,
      remaining: Math.round(profile.proteinTarget - totals.protein),
    },
    {
      label: "Carbs",
      value: Math.round(totals.carbs),
      target: carbTarget,
      unit: "g",
      percent: getProgressPercent(totals.carbs, carbTarget),
      remaining: null,
    },
    {
      label: "Fat",
      value: Math.round(totals.fat),
      target: fatTarget,
      unit: "g",
      percent: getProgressPercent(totals.fat, fatTarget),
      remaining: null,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {macros.map((macro, i) => (
        <m.div
          key={macro.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Card hover className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {macro.label}
            </p>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold leading-tight tabular-nums">{macro.value}</span>
              <span className="text-xs text-muted-foreground">
                / {macro.target > 0 ? macro.target : "—"} {macro.unit}
              </span>
            </div>
            <ProgressBar
              value={macro.target > 0 ? clampPercent(macro.percent) : 0}
              max={100}
              size="sm"
              variant={macro.label === "Calories" && macro.remaining != null && macro.remaining < 0 ? "warning" : "primary"}
              showValue={false}
              className="mt-3"
            />
            {macro.remaining != null && (
              <p className="mt-2 text-xs">
                {macro.remaining < 0 ? (
                  <span className="text-destructive">Over by {Math.abs(macro.remaining)} {macro.unit}</span>
                ) : (
                  <span className="text-muted-foreground">{macro.remaining} {macro.unit} remaining</span>
                )}
              </p>
            )}
          </Card>
        </m.div>
      ))}
    </div>
  );
}
