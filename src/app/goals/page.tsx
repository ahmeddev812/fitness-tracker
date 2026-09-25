"use client";

import { useState } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import type { Goal, GoalType } from "@/types/fitness";
import { getGoalProgress } from "@/lib/calculations";
import { PageHeader } from "@/components/layout/page-header";
import { GoalForm } from "@/components/goals/goal-form";
import { GoalCard } from "@/components/goals/goal-card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Plus, Zap, Trophy, Target } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { todayKey } from "@/lib/dates";

interface GoalTemplate {
  id: string;
  title: string;
  type: GoalType;
  targetValue?: number;
  startValue?: number;
  notes?: string;
}

const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    id: "lose-5kg",
    title: "Lose 5kg",
    type: "weight_loss",
    targetValue: 5,
  },
  {
    id: "gain-muscle",
    title: "Gain Muscle",
    type: "muscle_gain",
    startValue: 60,
    targetValue: 70,
    notes: "Increase lean muscle mass",
  },
  {
    id: "30-day-streak",
    title: "30-Day Streak",
    type: "general_fitness",
    notes: "Work out every day for 30 days",
  },
  {
    id: "drink-2.5l",
    title: "Drink 2.5L Daily",
    type: "water",
    targetValue: 2500,
    notes: "Stay hydrated every day",
  },
];

export default function GoalsPage() {
  const { goals, weights } = useFitnessData();
  const { addGoal, updateGoal, deleteGoal, completeGoal, archiveGoal } = useFitnessActions();
  const { toast } = useToast();

  const [tab, setTab] = useState("active");
  const [formOpen, setFormOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [templateInitial, setTemplateInitial] = useState<Omit<Goal, "id" | "createdAt"> | null>(null);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");
  const archivedGoals = goals.filter((g) => g.status === "archived");

  const handleSave = (data: Omit<Goal, "id" | "createdAt">) => {
    if (editGoal) {
      updateGoal(editGoal.id, data);
      toast("Goal updated", "success");
    } else {
      addGoal(data);
      toast("Goal added", "success");
    }
    setEditGoal(null);
    setTemplateInitial(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteGoal(deleteId);
      toast("Goal deleted", "success");
      setDeleteId(null);
    }
  };

  const handleComplete = (id: string) => {
    completeGoal(id);
    toast("Goal marked as completed!", "success");
  };

  const handleArchive = (id: string) => {
    archiveGoal(id);
    toast("Goal archived", "success");
  };

  const openAdd = () => {
    setEditGoal(null);
    setTemplateInitial(null);
    setFormOpen(true);
  };

  const openEdit = (g: Goal) => {
    setEditGoal(g);
    setTemplateInitial(null);
    setFormOpen(true);
  };

  const handleTemplateClick = (template: GoalTemplate) => {
    const latestWeight = weights.length > 0
      ? [...weights].sort((a, b) => b.date.localeCompare(a.date))[0].weightKg
      : undefined;

    const initialData: Omit<Goal, "id" | "createdAt"> = {
      type: template.type,
      title: template.title,
      startDate: todayKey(),
      status: "active",
    };

    if (template.type === "weight_loss" && latestWeight && !template.startValue) {
      initialData.startValue = latestWeight;
      initialData.targetValue = latestWeight - (template.targetValue ?? 5);
    } else {
      if (template.startValue != null) initialData.startValue = template.startValue;
      if (template.targetValue != null) initialData.targetValue = template.targetValue;
    }

    if (template.notes) initialData.notes = template.notes;

    setEditGoal(null);
    setTemplateInitial(initialData);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditGoal(null);
    setTemplateInitial(null);
  };

  const goalGrid = "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6";

  const templatesBlock = (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Quick Start Templates</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {GOAL_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateClick(template)}
            className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-left transition-all hover-lift hover:border-primary/30"
          >
            <Zap className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate text-sm font-medium">{template.title}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Goals" description="Set and track your fitness goals">
        <Button variant="gradient" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1.5" /> New Goal
        </Button>
      </PageHeader>

      <AnimatePresence>
        {celebratingId && (
          <m.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <m.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="bg-success/10 border border-success/30 rounded-2xl p-8 text-center"
            >
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-lg font-semibold text-success">Goal Completed!</p>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "active", label: `Active (${activeGoals.length})`, icon: <Target className="h-4 w-4" aria-hidden="true" /> },
            { value: "completed", label: `Completed (${completedGoals.length})`, icon: <Trophy className="h-4 w-4" aria-hidden="true" /> },
          ]}
        />
      </div>

      {tab === "active" && (
        <div className="space-y-8">
          {activeGoals.length > 0 ? (
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={goalGrid}
            >
              {activeGoals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onEdit={openEdit}
                  onDelete={setDeleteId}
                  onComplete={(id) => {
                    const goal = goals.find((gl) => gl.id === id);
                    const progress = goal
                      ? (() => {
                          const latest = weights.length > 0
                            ? [...weights].sort((a, b) => b.date.localeCompare(a.date))[0].weightKg
                            : undefined;
                          return getGoalProgress(goal, latest);
                        })()
                      : null;
                    handleComplete(id);
                    if (progress && progress.kind === "computed" && progress.percent >= 100) {
                      setCelebratingId(id);
                      setTimeout(() => setCelebratingId(null), 1500);
                    }
                  }}
                  onArchive={handleArchive}
                />
              ))}
            </m.div>
          ) : (
            <EmptyState
              icon={<Target className="h-8 w-8 text-primary" aria-hidden="true" />}
              title="No active goals"
              description="Pick a template below or create your own goal to start tracking."
              action={
                <Button onClick={openAdd}>
                  <Plus className="h-4 w-4 mr-1.5" /> New Goal
                </Button>
              }
            />
          )}

          {templatesBlock}
        </div>
      )}

      {tab === "completed" && (
        <div className="space-y-8">
          {completedGoals.length > 0 ? (
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={goalGrid}
            >
              {completedGoals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onEdit={openEdit}
                  onDelete={setDeleteId}
                  onComplete={handleComplete}
                  onArchive={handleArchive}
                  showCompletionDate
                />
              ))}
            </m.div>
          ) : (
            <EmptyState
              icon={<Trophy className="h-8 w-8 text-muted-foreground" aria-hidden="true" />}
              title="Nothing completed yet"
              description="Finish an active goal and it will appear here."
            />
          )}

          {archivedGoals.length > 0 && (
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-foreground">
                Archived
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {archivedGoals.length}
                </span>
              </h2>
              <div className={`${goalGrid} opacity-70`}>
                {archivedGoals.map((g) => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    onEdit={openEdit}
                    onDelete={setDeleteId}
                    onComplete={handleComplete}
                    onArchive={handleArchive}
                  />
                ))}
              </div>
            </m.div>
          )}
        </div>
      )}

      <GoalForm
        open={formOpen}
        onClose={handleFormClose}
        onSave={handleSave}
        initial={editGoal ?? templateInitial ?? undefined}
        isEdit={!!editGoal}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Goal?"
        description="This goal and all its data will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
