"use client";

import { useMemo } from "react";
import type { Workout } from "@/types/fitness";
import { getWorkoutVolume } from "@/lib/calculations";
import { formatDisplayDate } from "@/lib/dates";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit3, Trash2, Clock, Dumbbell, Copy, BookmarkPlus } from "lucide-react";
import { m } from "framer-motion";

interface WorkoutListProps {
  workouts: Workout[];
  onView: (workout: Workout) => void;
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onSaveTemplate?: (workout: Workout) => void;
}

export function WorkoutList({ workouts, onView, onEdit, onDelete, onDuplicate, onSaveTemplate }: WorkoutListProps) {
  const grouped = useMemo(() => {
    const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date));
    const groups: { date: string; workouts: Workout[] }[] = [];
    for (const w of sorted) {
      const existing = groups.find((g) => g.date === w.date);
      if (existing) {
        existing.workouts.push(w);
      } else {
        groups.push({ date: w.date, workouts: [w] });
      }
    }
    return groups;
  }, [workouts]);

  if (grouped.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {grouped.map((group, gi) => (
        <m.div
          key={group.date}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: gi * 0.05 }}
        >
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            {formatDisplayDate(group.date)}
          </h3>
          <div className="space-y-3">
            {group.workouts.map((workout) => {
              const volume = getWorkoutVolume(workout);
              return (
                <Card key={workout.id} hover>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-foreground">{workout.name}</h4>
                          {workout.category && (
                            <Badge variant="gradient">{workout.category}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Dumbbell className="h-3 w-3" aria-hidden="true" />
                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
                          </span>
                          {volume > 0 && (
                            <span>{volume.toLocaleString()} kg volume</span>
                          )}
                          {workout.durationMinutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              {workout.durationMinutes} min
                            </span>
                          )}
                        </div>
                        {workout.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{workout.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => onView(workout)} aria-label={`View ${workout.name}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onEdit(workout)} aria-label={`Edit ${workout.name}`}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        {onDuplicate && (
                          <Button size="sm" variant="ghost" onClick={() => onDuplicate(workout.id)} aria-label={`Duplicate ${workout.name}`}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                        {onSaveTemplate && (
                          <Button size="sm" variant="ghost" onClick={() => onSaveTemplate(workout)} aria-label={`Save ${workout.name} as template`}>
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => onDelete(workout.id)} aria-label={`Delete ${workout.name}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </m.div>
      ))}
    </div>
  );
}
