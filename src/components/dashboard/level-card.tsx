"use client";

import { useMemo, memo } from "react";
import { m } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { Trophy, Zap } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getLevel, calculateXp } from "@/lib/level";

function LevelCardImpl() {
  const { workouts, meals, water, weights, goals, personalRecords } = useFitnessData();

  const xp = useMemo(
    () =>
      calculateXp({ workouts, meals, water, weights, goals, personalRecords }),
    [workouts, meals, water, weights, goals, personalRecords],
  );

  const { level, currentXp, nextLevelXp } = getLevel(xp);

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-white">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Level</p>
          <p className="text-3xl font-bold leading-tight">{level}</p>
        </div>
        <div className="ml-auto text-right">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3 text-warning" />
            {xp} XP
          </div>
        </div>
      </div>
      <ProgressBar value={currentXp} max={nextLevelXp} size="sm" showValue={false} />
      <p className="mt-1.5 text-xs text-muted-foreground">
        {currentXp} / {nextLevelXp} XP to next level
      </p>
    </m.div>
  );
}

export const LevelCard = memo(LevelCardImpl);
LevelCard.displayName = "LevelCard";
