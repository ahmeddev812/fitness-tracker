"use client";

import { memo } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { sumMealsForDate, getWaterTotalForDate, getTodayWorkoutSummary, getRemainingCalories } from "@/lib/calculations";
import { todayKey } from "@/lib/dates";
import { Card } from "@/components/ui/card";
import { Dumbbell, UtensilsCrossed, Droplets, ArrowRight } from "lucide-react";

interface HighlightProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  sub: string;
  href: string;
  linkLabel: string;
  delay?: number;
}

function HighlightCard({ label, icon, value, sub, href, linkLabel, delay = 0 }: HighlightProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="h-full"
    >
      <Card hover className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <span className="text-muted-foreground [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        </div>
        <p className="mt-3 truncate text-2xl font-bold leading-tight text-foreground">{value}</p>
        <p className="mt-1 truncate text-sm text-muted-foreground">{sub}</p>
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Card>
    </m.div>
  );
}

function TodayHighlightsImpl() {
  const { workouts, meals, water, profile, isHydrated } = useFitnessData();

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted/40" />
        ))}
      </div>
    );
  }

  const today = todayKey();
  const summary = getTodayWorkoutSummary(workouts);
  const mealTotals = sumMealsForDate(meals, today);
  const remaining = getRemainingCalories(profile.calorieTarget, mealTotals.calories);
  const waterMl = getWaterTotalForDate(water, today);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
      <HighlightCard
        label="Workout"
        icon={<Dumbbell aria-hidden="true" />}
        value={summary ? summary.name : "Rest day"}
        sub={
          summary
            ? `${summary.exerciseCount} exercise${summary.exerciseCount !== 1 ? "s" : ""}${
                summary.volume > 0 ? ` · ${summary.volume.toLocaleString()} kg` : ""
              }`
            : "No workout logged yet"
        }
        href="/workouts"
        linkLabel={summary ? "View workout" : "Log workout"}
        delay={0.05}
      />
      <HighlightCard
        label="Nutrition"
        icon={<UtensilsCrossed aria-hidden="true" />}
        value={`${Math.round(mealTotals.calories)} kcal`}
        sub={`${Math.round(mealTotals.protein)}g protein · ${
          remaining < 0 ? `${Math.abs(Math.round(remaining))} over` : `${Math.round(remaining)} left`
        }`}
        href="/nutrition"
        linkLabel="View meals"
        delay={0.1}
      />
      <HighlightCard
        label="Water"
        icon={<Droplets aria-hidden="true" />}
        value={`${waterMl.toLocaleString()} ml`}
        sub={`of ${profile.waterTargetMl.toLocaleString()} ml target`}
        href="/water"
        linkLabel="View log"
        delay={0.15}
      />
    </div>
  );
}

export const TodayHighlights = memo(TodayHighlightsImpl);
TodayHighlights.displayName = "TodayHighlights";
