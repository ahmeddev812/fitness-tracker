"use client";

import { memo, useState } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { todayKey } from "@/lib/dates";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Footprints } from "lucide-react";
import { m } from "framer-motion";

function ActivityCardImpl() {
  const { activity, isHydrated } = useFitnessData();
  const { upsertActivity } = useFitnessActions();
  const { toast } = useToast();
  const today = todayKey();
  const [steps, setSteps] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const todayActivity = activity.find((a) => a.date === today);
  const currentSteps = todayActivity?.steps ?? 0;

  if (!isHydrated) {
    return <Card className="p-5"><div className="space-y-3"><div className="h-4 w-24 bg-muted rounded animate-pulse" /><div className="h-8 w-16 bg-muted rounded animate-pulse" /></div></Card>;
  }

  const handleSave = () => {
    const numSteps = parseInt(steps, 10);
    if (isNaN(numSteps) || numSteps < 0) {
      toast("Please enter a valid step count", "error");
      return;
    }
    upsertActivity({ date: today, steps: numSteps });
    toast("Steps updated", "success");
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setSteps(currentSteps > 0 ? String(currentSteps) : "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSteps("");
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
    >
      <Card hover className="p-5">
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="gradient-primary rounded-lg p-1.5">
                <Footprints className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Steps</p>
            </div>
            {!isEditing && (
              <Button size="sm" variant="ghost" onClick={handleStartEdit}>
                Edit
              </Button>
            )}
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                type="number"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="Steps"
                aria-label="Today's steps"
                className="flex-1"
              />
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          ) : (
            <p className="text-2xl font-bold tabular-nums">
              {currentSteps > 0 ? currentSteps.toLocaleString() : "\u2014"}
            </p>
          )}
        </CardContent>
      </Card>
    </m.div>
  );
}

export const ActivityCard = memo(ActivityCardImpl);
ActivityCard.displayName = "ActivityCard";
