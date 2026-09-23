"use client";

import { memo } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import { sumMealsForDate, getProgressPercent, clampPercent } from "@/lib/calculations";
import { todayKey } from "@/lib/dates";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { m } from "framer-motion";

function ProteinCardImpl() {
  const { meals, profile, isHydrated } = useFitnessData();

  if (!isHydrated) {
    return <Card className="p-5"><div className="space-y-3"><div className="h-4 w-20 bg-muted rounded animate-pulse" /><div className="h-8 w-20 bg-muted rounded animate-pulse" /><div className="h-2.5 w-full bg-muted rounded-full animate-pulse" /></div></Card>;
  }

  const today = todayKey();
  const totals = sumMealsForDate(meals, today);
  const target = profile.proteinTarget;
  const percent = getProgressPercent(totals.protein, target);

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
    >
      <Card hover className="p-5">
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Protein</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold tabular-nums">{Math.round(totals.protein)}</span>
            <span className="text-sm text-muted-foreground">/ {target}g</span>
          </div>
          <ProgressBar value={clampPercent(percent)} label="Daily target" showValue={false} />
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round(percent)}% of target
          </p>
        </CardContent>
      </Card>
    </m.div>
  );
}

export const ProteinCard = memo(ProteinCardImpl);
ProteinCard.displayName = "ProteinCard";
