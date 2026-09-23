"use client";

import { useState } from "react";
import type { Workout, ExerciseEntry } from "@/types/fitness";
import { exercises as exerciseLibrary } from "@/data/exercises";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Modal } from "@/components/ui/modal";
import { todayKey } from "@/lib/dates";
import { Trash2, Plus, Search } from "lucide-react";

interface WorkoutFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (workout: Omit<Workout, "id" | "createdAt" | "updatedAt">) => void;
  initial?: Partial<Workout>;
  isEdit?: boolean;
}

interface ExerciseRow {
  exerciseId: string;
  exerciseName: string;
  sets: string;
  reps: string;
  weightKg: string;
  restSeconds: string;
  notes: string;
}

const MUSCLE_GROUPS = [
  "chest", "back", "shoulders", "biceps", "triceps",
  "legs", "core", "cardio", "full_body",
] as const;

function emptyRow(): ExerciseRow {
  return { exerciseId: "", exerciseName: "", sets: "", reps: "", weightKg: "", restSeconds: "", notes: "" };
}

function validate(rows: ExerciseRow[]): string | null {
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r.exerciseId && !r.exerciseName) return `Exercise ${i + 1}: select an exercise`;
    if (!r.sets || parseInt(r.sets) <= 0) return `Exercise ${i + 1}: sets must be > 0`;
    if (!r.reps || parseInt(r.reps) <= 0) return `Exercise ${i + 1}: reps must be > 0`;
    if (r.weightKg && parseFloat(r.weightKg) < 0) return `Exercise ${i + 1}: weight cannot be negative`;
    if (r.restSeconds && parseFloat(r.restSeconds) < 0) return `Exercise ${i + 1}: rest cannot be negative`;
  }
  return null;
}

export function WorkoutForm({ open, onClose, onSave, initial, isEdit = false }: WorkoutFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [date, setDate] = useState(initial?.date ?? todayKey());
  const [category, setCategory] = useState(initial?.category ?? "");
  const [durationMinutes, setDurationMinutes] = useState(initial?.durationMinutes?.toString() ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [rows, setRows] = useState<ExerciseRow[]>(() => {
    if (initial?.exercises?.length) {
      return initial.exercises.map((e) => ({
        exerciseId: e.exerciseId,
        exerciseName: e.exerciseName,
        sets: String(e.sets),
        reps: String(e.reps),
        weightKg: e.weightKg?.toString() ?? "",
        restSeconds: e.restSeconds?.toString() ?? "",
        notes: e.notes ?? "",
      }));
    }
    return [emptyRow()];
  });
  const [error, setError] = useState<string | null>(null);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const updateRow = (index: number, field: keyof ExerciseRow, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const selectExercise = (index: number, id: string, exName: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, exerciseId: id, exerciseName: exName } : r)));
    setActiveRow(null);
    setExerciseSearch("");
  };

  const addCustomExercise = (index: number) => {
    if (exerciseSearch.trim()) {
      setRows((prev) => prev.map((r, i) => (i === index ? { ...r, exerciseId: `custom_${exerciseSearch.trim()}`, exerciseName: exerciseSearch.trim() } : r)));
      setActiveRow(null);
      setExerciseSearch("");
    }
  };

  const handleSave = () => {
    if (!name.trim()) { setError("Workout name is required"); return; }
    if (!date) { setError("Date is required"); return; }
    const rowError = validate(rows);
    if (rowError) { setError(rowError); return; }

    const exercises: ExerciseEntry[] = rows
      .filter((r) => r.exerciseId || r.exerciseName)
      .map((r) => ({
        exerciseId: r.exerciseId || `custom_${r.exerciseName}`,
        exerciseName: r.exerciseName || exerciseLibrary.find((e) => e.id === r.exerciseId)?.name || r.exerciseId,
        sets: parseInt(r.sets) || 0,
        reps: parseInt(r.reps) || 0,
        weightKg: r.weightKg ? parseFloat(r.weightKg) : undefined,
        restSeconds: r.restSeconds ? parseInt(r.restSeconds) : undefined,
        notes: r.notes || undefined,
      }));

    onSave({
      name: name.trim(),
      date,
      category: category || undefined,
      durationMinutes: durationMinutes ? parseInt(durationMinutes) : undefined,
      exercises,
      notes: notes || undefined,
    });
    onClose();
  };

  const filteredExercises = exerciseLibrary.filter((e) =>
    exerciseSearch && activeRow !== null
      ? e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
        e.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase())
      : true
  );

  const grouped = MUSCLE_GROUPS.reduce((acc, mg) => {
    const items = filteredExercises.filter((e) => e.muscleGroup === mg);
    if (items.length > 0) acc.push({ group: mg, items });
    return acc;
  }, [] as { group: string; items: typeof exerciseLibrary }[]);

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Workout" : "Add Workout"} className="max-w-2xl">
      <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive" role="alert">
            {error}
          </div>
        )}
        <Input label="Workout Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Push Day" />
        <DatePicker label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Strength" />
          <Input label="Duration (min)" type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} placeholder="45" />
        </div>
        <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Exercises</h3>
            <Button size="sm" variant="ghost" onClick={() => setRows((prev) => [...prev, emptyRow()])}>
              <Plus className="h-4 w-4 mr-1" /> Add Exercise
            </Button>
          </div>

          <div className="space-y-3">
            {rows.map((row, idx) => (
              <div key={idx} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 relative">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Exercise</label>
                    {row.exerciseId ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{row.exerciseName}</span>
                        <Button size="sm" variant="ghost" onClick={() => selectExercise(idx, "", "")}>Change</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <input
                              className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Search exercises..."
                              value={exerciseSearch}
                              onChange={(e) => { setExerciseSearch(e.target.value); setActiveRow(idx); }}
                              onFocus={() => setActiveRow(idx)}
                            />
                          </div>
                          <Button size="sm" variant="secondary" onClick={() => addCustomExercise(idx)} disabled={!exerciseSearch.trim()}>
                            Custom
                          </Button>
                        </div>
                        {activeRow === idx && (
                          <div className="max-h-40 overflow-y-auto rounded-lg border border-border bg-card p-2 space-y-1">
                            {grouped.map((g) => (
                              <div key={g.group}>
                                <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">{g.group.replace("_", " ")}</p>
                                {g.items.map((ex) => (
                                  <button
                                    key={ex.id}
                                    className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent/10 transition-colors"
                                    onClick={() => selectExercise(idx, ex.id, ex.name)}
                                  >
                                    {ex.name}
                                  </button>
                                ))}
                              </div>
                            ))}
                            {grouped.length === 0 && exerciseSearch && (
                              <p className="text-xs text-muted-foreground px-2 py-1">No matches. Use &quot;Custom&quot; to add.</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setRows((prev) => prev.filter((_, i) => i !== idx))} disabled={rows.length <= 1} aria-label="Remove exercise">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Input label="Sets" type="number" value={row.sets} onChange={(e) => updateRow(idx, "sets", e.target.value)} placeholder="3" />
                  <Input label="Reps" type="number" value={row.reps} onChange={(e) => updateRow(idx, "reps", e.target.value)} placeholder="10" />
                  <Input label="Weight (kg)" type="number" value={row.weightKg} onChange={(e) => updateRow(idx, "weightKg", e.target.value)} placeholder="0" step="0.5" />
                  <Input label="Rest (s)" type="number" value={row.restSeconds} onChange={(e) => updateRow(idx, "restSeconds", e.target.value)} placeholder="60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Workout"}</Button>
      </div>
    </Modal>
  );
}