"use client";

import { memo } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import { getTodayWorkoutSummary } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Dumbbell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { m } from "framer-motion";

function WorkoutCardImpl() {
  const { workouts, isHydrated } = useFitnessData();

  if (!isHydrated) {
    return <Card className="p-5"><div className="space-y-3"><div className="h-4 w-32 bg-muted rounded animate-pulse" /><div className="h-8 w-48 bg-muted rounded animate-pulse" /></div></Card>;
  }

  const summary = getTodayWorkoutSummary(workouts);

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
    >
      <Card hover className="p-5">
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <div className="gradient-primary rounded-lg p-1.5">
              <Dumbbell className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Today&apos;s Workout</p>
          </div>
          {summary ? (
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold">{summary.name}</p>
                <p className="text-sm text-muted-foreground">
                  {summary.exerciseCount} exercise{summary.exerciseCount !== 1 ? "s" : ""}
                  {summary.volume > 0 && <> · {summary.volume.toLocaleString()} kg total</>}
                </p>
              </div>
              <Link href="/workouts" className="text-primary hover:text-primary/80 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <EmptyState
              title="No workout today"
              description="Start your fitness journey"
              action={
                <Link href="/workouts">
                  <Button size="sm">Add Workout</Button>
                </Link>
              }
            />
          )}
        </CardContent>
      </Card>
    </m.div>
  );
}

export const WorkoutCard = memo(WorkoutCardImpl);
WorkoutCard.displayName = "WorkoutCard";
