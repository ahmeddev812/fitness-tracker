"use client";

import { memo } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import { getGoalProgress } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { m } from "framer-motion";

function GoalCardImpl() {
  const { goals, weights, isHydrated } = useFitnessData();

  if (!isHydrated) {
    return <Card className="p-5"><div className="space-y-3"><div className="h-4 w-24 bg-muted rounded animate-pulse" /><div className="h-8 w-32 bg-muted rounded animate-pulse" /></div></Card>;
  }

  const activeGoals = goals
    .filter((g) => g.status === "active")
    .sort((a, b) => {
      if (a.targetDate && b.targetDate) return a.targetDate.localeCompare(b.targetDate);
      if (a.targetDate) return -1;
      if (b.targetDate) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });

  const goal = activeGoals[0];

  if (!goal) {
    return (
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
      >
        <Card hover className="p-5">
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <div className="gradient-primary rounded-lg p-1.5">
                <Target className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Goal</p>
            </div>
            <EmptyState
              title="No active goals"
              description="Set a goal to track your progress"
              action={
                <Link href="/goals">
                  <Button size="sm">Set Goal</Button>
                </Link>
              }
            />
          </CardContent>
        </Card>
      </m.div>
    );
  }

  const latestWeight = weights.length > 0
    ? [...weights].sort((a, b) => b.date.localeCompare(a.date))[0]?.weightKg
    : undefined;

  const progress = getGoalProgress(goal, latestWeight);

  const goalTypeLabels: Record<string, string> = {
    muscle_gain: "Muscle Gain",
    weight_loss: "Weight Loss",
    weight_maintenance: "Weight Maintenance",
    strength: "Strength",
    general_fitness: "General Fitness",
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
    >
      <Card hover className="p-5">
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="gradient-primary rounded-lg p-1.5">
                <Target className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Goal</p>
            </div>
            <Badge variant="gradient">{goalTypeLabels[goal.type]}</Badge>
          </div>
          <p className="text-lg font-semibold">{goal.title || goalTypeLabels[goal.type]}</p>
          {progress.kind === "computed" ? (
            <div className="mt-3">
              <ProgressBar value={progress.percent} label="Progress" />
              <p className="text-xs text-muted-foreground mt-1">
                {progress.current.toFixed(1)} kg → {goal.targetValue} kg
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">Manually tracked</p>
          )}
        </CardContent>
      </Card>
    </m.div>
  );
}

export const GoalCard = memo(GoalCardImpl);
GoalCard.displayName = "GoalCard";
