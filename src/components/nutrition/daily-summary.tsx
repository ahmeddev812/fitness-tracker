"use client";

import { useFitnessData } from "@/hooks/useFitnessData";
import { sumMealsForDate, getRemainingCalories, getProgressPercent, clampPercent } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { m } from "framer-motion";

interface DailySummaryProps {
  date: string;
}

export function DailySummary({ date }: DailySummaryProps) {
  const { meals, profile, isHydrated } = useFitnessData();

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4"><div className="space-y-2"><div className="h-4 w-16 bg-muted rounded animate-pulse" /><div className="h-6 w-12 bg-muted rounded animate-pulse" /><div className="h-2 w-full bg-muted rounded-full animate-pulse" /></div></Card>
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {macros.map((macro, i) => (
        <m.div
          key={macro.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Card hover className="p-4">
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">{macro.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tabular-nums">{macro.value}</span>
                <span className="text-xs text-muted-foreground">/ {macro.target} {macro.unit}</span>
              </div>
              <ProgressBar
                value={macro.target > 0 ? clampPercent(macro.percent) : 0}
                size="sm"
                variant={macro.label === "Calories" && remaining != null && remaining < 0 ? "warning" : "gradient"}
                showValue={false}
                className="mt-2"
              />
              {macro.remaining != null && (
                <p className="text-xs mt-1.5">
                  {macro.remaining < 0 ? (
                    <span className="text-destructive">Over by {Math.abs(macro.remaining)} {macro.unit}</span>
                  ) : (
                    <span className="text-muted-foreground">{macro.remaining} {macro.unit} remaining</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </m.div>
      ))}
    </div>
  );
}
