"use client";

import { useState } from "react";
import type { Goal } from "@/types/fitness";
import { getGoalProgress } from "@/lib/calculations";
import { useFitnessData } from "@/hooks/useFitnessData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Edit3, Trash2, CheckCircle2, Archive } from "lucide-react";
import { formatDisplayDate } from "@/lib/dates";
import { m } from "framer-motion";

const GOAL_TYPE_LABELS: Record<string, string> = {
  weight_loss: "Weight Loss",
  weight_maintenance: "Weight Maintenance",
  muscle_gain: "Muscle Gain",
  strength: "Strength",
  general_fitness: "General Fitness",
  streak: "Streak",
  water: "Water Intake",
};

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onArchive?: (id: string) => void;
  showCompletionDate?: boolean;
}

export function GoalCard({ goal, onEdit, onDelete, onComplete, onArchive, showCompletionDate }: GoalCardProps) {
  const { weights } = useFitnessData();
  const latestWeight = weights.length > 0
    ? [...weights].sort((a, b) => b.date.localeCompare(a.date))[0].weightKg
    : undefined;

  const progress = getGoalProgress(goal, latestWeight);
  const isActive = goal.status === "active";
  const isCompleted = goal.status === "completed";
  const isArchived = goal.status === "archived";

  const [celebrating, setCelebrating] = useState(false);
  const shouldCelebrate = progress.kind === "computed" && progress.percent >= 100 && isActive && !isCompleted;

  if (shouldCelebrate && !celebrating) {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 1000);
  }

  return (
    <m.div
      animate={celebrating ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Card hover>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="gradient">
                  {GOAL_TYPE_LABELS[goal.type] ?? goal.type}
                </Badge>
                {isActive && (
                  <Badge>Active</Badge>
                )}
                {isCompleted && (
                  <Badge variant="secondary">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                  </Badge>
                )}
                {isArchived && (
                  <Badge variant="secondary">
                    <Archive className="h-3 w-3 mr-1" /> Archived
                  </Badge>
                )}
              </div>
              {goal.title && (
                <p className={`font-medium text-sm mt-2 ${!isActive ? "line-through" : ""}`}>
                  {goal.title}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {isActive && (
                <Button size="sm" variant="ghost" onClick={() => onComplete(goal.id)} aria-label="Mark complete">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </Button>
              )}
              {isActive && onArchive && (
                <Button size="sm" variant="ghost" onClick={() => onArchive(goal.id)} aria-label="Archive goal">
                  <Archive className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => onEdit(goal)} aria-label="Edit goal">
                <Edit3 className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(goal.id)} aria-label="Delete goal">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          </div>

          {progress.kind === "computed" ? (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{progress.current.toFixed(1)} / {goal.targetValue} kg</span>
                <span>{Math.round(progress.percent)}%</span>
              </div>
              <ProgressBar value={progress.percent} size="sm" variant={progress.percent >= 100 ? "success" : "gradient"} />
            </div>
          ) : (
            <div className="mt-2 text-xs text-muted-foreground">
              {goal.startValue != null && goal.targetValue != null ? (
                <span>{goal.startValue} → {goal.targetValue} kg</span>
              ) : (
                <span>Manual tracking</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>Started {formatDisplayDate(goal.startDate)}</span>
            {goal.targetDate && (
              <span>Target {formatDisplayDate(goal.targetDate)}</span>
            )}
            {showCompletionDate && isCompleted && goal.completedAt && (
              <span className="text-success">Completed {formatDisplayDate(goal.completedAt)}</span>
            )}
          </div>
          {goal.notes && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{goal.notes}</p>
          )}
        </CardContent>
      </Card>
    </m.div>
  );
}
