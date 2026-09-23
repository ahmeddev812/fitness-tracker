"use client";

import { useMemo, memo } from "react";
import { m } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { Trophy, Zap } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";

const XP_PER_ACTION = {
  workout: 10,
  meal: 5,
  water: 2,
  weight: 3,
  goal: 20,
  pr: 15,
} as const;

function getLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  const levelThresholds = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250, 2800];
  let level = 1;
  for (let i = 1; i < levelThresholds.length; i++) {
    if (xp >= levelThresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  const currentLevelXp = levelThresholds[level - 1] || 0;
  const nextLevelXp = levelThresholds[level] || levelThresholds[levelThresholds.length - 1] + 500;
  return { level, currentXp: xp - currentLevelXp, nextLevelXp: nextLevelXp - currentLevelXp };
}

function LevelCardImpl() {
  const { workouts, meals, water, weights, goals, personalRecords } = useFitnessData();

  const xp = useMemo(() => {
    return (
      workouts.length * XP_PER_ACTION.workout +
      meals.length * XP_PER_ACTION.meal +
      water.length * XP_PER_ACTION.water +
      weights.length * XP_PER_ACTION.weight +
      goals.filter((g) => g.status === "completed").length * XP_PER_ACTION.goal +
      personalRecords.length * XP_PER_ACTION.pr
    );
  }, [workouts, meals, water, weights, goals, personalRecords]);

  const { level, currentXp, nextLevelXp } = getLevel(xp);

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="absolute inset-0 gradient-primary rounded-xl blur-md opacity-40" />
          <div className="relative gradient-primary rounded-xl p-2">
            <Trophy className="h-5 w-5 text-white" />
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Level</p>
          <p className="text-2xl font-bold gradient-text">{level}</p>
        </div>
        <div className="ml-auto text-right">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3 text-warning" />
            {xp} XP
          </div>
        </div>
      </div>
      <ProgressBar
        value={currentXp}
        max={nextLevelXp}
        size="sm"
        variant="gradient"
        showValue={false}
      />
      <p className="text-xs text-muted-foreground mt-1.5">
        {currentXp} / {nextLevelXp} XP to next level
      </p>
    </m.div>
  );
}

export const LevelCard = memo(LevelCardImpl);
LevelCard.displayName = "LevelCard";
