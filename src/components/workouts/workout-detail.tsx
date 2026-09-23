"use client";

import type { Workout } from "@/types/fitness";
import { getWorkoutVolume } from "@/lib/calculations";
import { formatDisplayDate } from "@/lib/dates";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, TrendingUp } from "lucide-react";

interface WorkoutDetailProps {
  workout: Workout | null;
  onClose: () => void;
}

function estimate1RM(weightKg: number, reps: number): number {
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}

export function WorkoutDetail({ workout, onClose }: WorkoutDetailProps) {
  if (!workout) return null;

  const volume = getWorkoutVolume(workout);

  return (
    <Modal open={!!workout} onClose={onClose} title={workout.name} className="max-w-lg">
      <div className="space-y-4 mt-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">{formatDisplayDate(workout.date)}</span>
          {workout.category && <Badge variant="secondary">{workout.category}</Badge>}
          {workout.durationMinutes && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {workout.durationMinutes} min
            </span>
          )}
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}</span>
          {volume > 0 && <span>{volume.toLocaleString()} kg volume</span>}
        </div>

        {workout.notes && (
          <p className="text-sm text-muted-foreground">{workout.notes}</p>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Exercises</h4>
          {workout.exercises.map((ex, idx) => {
            const has1RM = ex.weightKg != null && ex.weightKg > 0 && ex.reps > 0;
            const oneRM = has1RM ? estimate1RM(ex.weightKg!, ex.reps) : null;
            return (
              <div key={idx} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    <span className="font-medium text-sm">{ex.exerciseName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {ex.sets} × {ex.reps}
                    {ex.weightKg != null && ex.weightKg > 0 ? ` @ ${ex.weightKg} kg` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 ml-5 text-xs text-muted-foreground">
                  {oneRM != null && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" aria-hidden="true" />
                      Est. 1RM: {oneRM} kg
                    </span>
                  )}
                  {ex.notes && <span>{ex.notes}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
