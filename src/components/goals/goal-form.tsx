"use client";

import { useState } from "react";
import type { Goal, GoalType, GoalStatus } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

const GOAL_TYPES = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "weight_maintenance", label: "Weight Maintenance" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "strength", label: "Strength" },
  { value: "general_fitness", label: "General Fitness" },
];

interface GoalFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: Omit<Goal, "id" | "createdAt">) => void;
  initial?: Partial<Goal>;
  isEdit?: boolean;
}

function validateNumber(value: string, label: string): string | null {
  if (!value) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return `${label} must be a number`;
  if (num < 0) return `${label} cannot be negative`;
  if (num > 1000) return `${label} must be less than 1000`;
  return null;
}

export function GoalForm({ open, onClose, onSave, initial, isEdit = false }: GoalFormProps) {
  const [type, setType] = useState<GoalType>(initial?.type ?? "weight_loss");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [startValue, setStartValue] = useState(initial?.startValue?.toString() ?? "");
  const [targetValue, setTargetValue] = useState(initial?.targetValue?.toString() ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? new Date().toISOString().split("T")[0]);
  const [targetDate, setTargetDate] = useState(initial?.targetDate ?? "");
  const [status, setStatus] = useState<GoalStatus>(initial?.status ?? "active");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const startErr = validateNumber(startValue, "Start value");
    if (startErr) e.startValue = startErr;
    const targetErr = validateNumber(targetValue, "Target value");
    if (targetErr) e.targetValue = targetErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const goal: Omit<Goal, "id" | "createdAt"> = {
      type,
      status,
      startDate,
    };
    if (title.trim()) goal.title = title.trim();
    if (startValue) goal.startValue = parseFloat(startValue);
    if (targetValue) goal.targetValue = parseFloat(targetValue);
    if (targetDate) goal.targetDate = targetDate;
    if (notes.trim()) goal.notes = notes.trim();
    onSave(goal);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Goal" : "Add Goal"}>
      <div className="space-y-4 mt-4">
        <Select
          label="Goal Type"
          value={type}
          onChange={(e) => setType(e.target.value as GoalType)}
          options={GOAL_TYPES}
        />
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Reach 75 kg by summer"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Value"
            type="number"
            value={startValue}
            onChange={(e) => setStartValue(e.target.value)}
            placeholder="e.g. 85"
            error={errors.startValue}
          />
          <Input
            label="Target Value"
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="e.g. 75"
            error={errors.targetValue}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Target Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            hint="Optional"
          />
        </div>
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as GoalStatus)}
          options={[
            { value: "active", label: "Active" },
            { value: "completed", label: "Completed" },
          ]}
        />
        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Goal"}</Button>
        </div>
      </div>
    </Modal>
  );
}