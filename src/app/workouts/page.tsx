"use client";

import { useState, useMemo } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import type { Workout } from "@/types/fitness";
import { exercises as exerciseLibrary } from "@/data/exercises";
import { PageHeader } from "@/components/layout/page-header";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { WorkoutList } from "@/components/workouts/workout-list";
import { WorkoutDetail } from "@/components/workouts/workout-detail";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Plus, Filter, X, Bookmark, Play, Trash2, Dumbbell } from "lucide-react";
import { m } from "framer-motion";

const MUSCLE_GROUP_OPTIONS = [
  { value: "", label: "All muscle groups" },
  ...Array.from(new Set(exerciseLibrary.map((e) => e.muscleGroup))).map((mg) => ({
    value: mg,
    label: mg.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  })),
];

export default function WorkoutsPage() {
  const { workouts, workoutTemplates } = useFitnessData();
  const {
    addWorkout,
    updateWorkout,
    deleteWorkout,
    duplicateWorkout,
    addWorkoutTemplate,
    applyWorkoutTemplate,
    deleteWorkoutTemplate,
  } = useFitnessActions();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editWorkout, setEditWorkout] = useState<Workout | null>(null);
  const [viewWorkout, setViewWorkout] = useState<Workout | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterMuscle, setFilterMuscle] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  const filtered = useMemo(() => {
    let result = [...workouts];
    if (filterDateFrom) result = result.filter((w) => w.date >= filterDateFrom);
    if (filterDateTo) result = result.filter((w) => w.date <= filterDateTo);
    if (filterMuscle) {
      const exerciseIds = exerciseLibrary
        .filter((e) => e.muscleGroup === filterMuscle)
        .map((e) => e.id);
      result = result.filter(
        (w) =>
          w.exercises.some((e) => exerciseIds.includes(e.exerciseId)) ||
          w.category?.toLowerCase().includes(filterMuscle.replace(/_/g, " "))
      );
    }
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.category?.toLowerCase().includes(q) ||
          w.exercises.some((e) => e.exerciseName.toLowerCase().includes(q))
      );
    }
    return result;
  }, [workouts, filterDateFrom, filterDateTo, filterMuscle, filterSearch]);

  const hasFilters = filterDateFrom || filterDateTo || filterMuscle || filterSearch;

  const handleSave = (data: Omit<Workout, "id" | "createdAt" | "updatedAt">) => {
    if (editWorkout) {
      updateWorkout(editWorkout.id, data);
      toast("Workout updated", "success");
    } else {
      addWorkout(data);
      toast("Workout added", "success");
    }
    setEditWorkout(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteWorkout(deleteId);
      toast("Workout deleted", "success");
      setDeleteId(null);
    }
  };

  const handleDeleteTemplate = () => {
    if (deleteTemplateId) {
      deleteWorkoutTemplate(deleteTemplateId);
      toast("Template deleted", "success");
      setDeleteTemplateId(null);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateWorkout(id);
    toast("Workout duplicated", "success");
  };

  const handleSaveAsTemplate = (workout: Workout) => {
    addWorkoutTemplate({
      name: workout.name,
      exercises: workout.exercises,
      category: workout.category,
      notes: workout.notes,
    });
    toast("Template saved", "success");
  };

  const handleUseTemplate = (templateId: string) => {
    const workout = applyWorkoutTemplate(templateId);
    if (workout) {
      addWorkout(workout);
      toast("Workout created from template", "success");
    }
  };

  const clearFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterMuscle("");
    setFilterSearch("");
  };

  return (
    <div>
      <PageHeader title="Workouts" description="Log and track your workouts">
        <Button variant="gradient" onClick={() => { setEditWorkout(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Workout
        </Button>
      </PageHeader>

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {workoutTemplates.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
              <Bookmark className="h-4 w-4" />
              Workout Templates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {workoutTemplates.map((template) => (
                <Card key={template.id} hover>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">{template.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.exercises.length} exercise{template.exercises.length !== 1 ? "s" : ""}
                        </p>
                        {template.category && (
                          <Badge variant="secondary" className="mt-1.5">{template.category}</Badge>
                        )}
                        {template.exercises.length > 0 && (
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                            <Dumbbell className="h-3 w-3" aria-hidden="true" />
                            {template.exercises.map((e) => e.exerciseName).join(", ")}
                          </div>
                        )}
                        {template.useCount > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Used {template.useCount} time{template.useCount !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUseTemplate(template.id)}
                          aria-label={`Use template ${template.name}`}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTemplateId(template.id)}
                          aria-label={`Delete template ${template.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <Button size="sm" variant="ghost" onClick={() => setShowFilters(!showFilters)} className="mb-2">
            <Filter className="h-4 w-4 mr-1.5" /> Filters
            {hasFilters && <span className="ml-1.5 h-2 w-2 rounded-full bg-primary" />}
          </Button>
          {showFilters && (
            <Card variant="elevated" className="p-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Input
                  label="From"
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                />
                <Input
                  label="To"
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                />
                <Select
                  label="Muscle Group"
                  value={filterMuscle}
                  onChange={(e) => setFilterMuscle(e.target.value)}
                  options={MUSCLE_GROUP_OPTIONS}
                />
                <Input
                  label="Search"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Name, category, exercise..."
                />
              </div>
              {hasFilters && (
                <Button size="sm" variant="ghost" onClick={clearFilters} className="mt-3">
                  <X className="h-3.5 w-3.5 mr-1" /> Clear Filters
                </Button>
              )}
            </Card>
          )}
        </div>
      </m.div>

      {workouts.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="h-8 w-8 text-primary" aria-hidden="true" />}
          title="No workouts yet"
          description="Log your first workout and it will show up here."
          action={
            <Button variant="gradient" size="lg" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Log your first workout
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No workouts match these filters"
          description="Try adjusting your filters"
          action={
            <Button size="sm" variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <WorkoutList
          workouts={filtered}
          onView={setViewWorkout}
          onEdit={(w) => { setEditWorkout(w); setFormOpen(true); }}
          onDelete={setDeleteId}
          onDuplicate={handleDuplicate}
          onSaveTemplate={handleSaveAsTemplate}
        />
      )}

      <WorkoutForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditWorkout(null); }}
        onSave={handleSave}
        initial={editWorkout ?? undefined}
        isEdit={!!editWorkout}
      />
      <WorkoutDetail workout={viewWorkout} onClose={() => setViewWorkout(null)} />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Workout?"
        description="This action cannot be undone. All exercises and data for this workout will be removed."
        confirmLabel="Delete"
        variant="destructive"
      />
      <ConfirmDialog
        open={!!deleteTemplateId}
        onClose={() => setDeleteTemplateId(null)}
        onConfirm={handleDeleteTemplate}
        title="Delete Template?"
        description="This action cannot be undone. The template will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
