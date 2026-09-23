"use client";

import { useState } from "react";
import type { WeightEntry } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";

interface WeightFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: Omit<WeightEntry, "id">) => void;
  date: string;
  initial?: Partial<WeightEntry>;
  isEdit?: boolean;
}

function validateWeightKg(value: string): string | null {
  if (!value) return "Weight is required";
  const num = parseFloat(value);
  if (isNaN(num)) return "Must be a number";
  if (num < 20) return "Minimum 20 kg";
  if (num > 400) return "Maximum 400 kg";
  return null;
}

function validateCm(value: string, label: string): string | null {
  if (!value) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return `${label} must be a number`;
  if (num < 10) return `${label} minimum 10 cm`;
  if (num > 200) return `${label} maximum 200 cm`;
  return null;
}

export function WeightForm({ open, onClose, onSave, date, initial, isEdit = false }: WeightFormProps) {
  const [weightKg, setWeightKg] = useState(initial?.weightKg?.toString() ?? "");
  const [waistCm, setWaistCm] = useState(initial?.waistCm?.toString() ?? "");
  const [chestCm, setChestCm] = useState(initial?.chestCm?.toString() ?? "");
  const [armsCm, setArmsCm] = useState(initial?.armsCm?.toString() ?? "");
  const [thighsCm, setThighsCm] = useState(initial?.thighsCm?.toString() ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const wErr = validateWeightKg(weightKg);
    if (wErr) e.weightKg = wErr;
    const waistErr = validateCm(waistCm, "Waist");
    if (waistErr) e.waistCm = waistErr;
    const chestErr = validateCm(chestCm, "Chest");
    if (chestErr) e.chestCm = chestErr;
    const armsErr = validateCm(armsCm, "Arms");
    if (armsErr) e.armsCm = armsErr;
    const thighsErr = validateCm(thighsCm, "Thighs");
    if (thighsErr) e.thighsCm = thighsErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const entry: Omit<WeightEntry, "id"> = {
      date,
      weightKg: parseFloat(weightKg),
    };
    if (waistCm) entry.waistCm = parseFloat(waistCm);
    if (chestCm) entry.chestCm = parseFloat(chestCm);
    if (armsCm) entry.armsCm = parseFloat(armsCm);
    if (thighsCm) entry.thighsCm = parseFloat(thighsCm);
    if (notes) entry.notes = notes;
    onSave(entry);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Weight" : "Log Weight"}>
      <div className="space-y-4 mt-4">
        <Input
          label="Weight (kg)"
          type="number"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          placeholder="e.g. 75.5"
          error={errors.weightKg}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Waist (cm)"
            type="number"
            value={waistCm}
            onChange={(e) => setWaistCm(e.target.value)}
            placeholder="Optional"
            error={errors.waistCm}
          />
          <Input
            label="Chest (cm)"
            type="number"
            value={chestCm}
            onChange={(e) => setChestCm(e.target.value)}
            placeholder="Optional"
            error={errors.chestCm}
          />
          <Input
            label="Arms (cm)"
            type="number"
            value={armsCm}
            onChange={(e) => setArmsCm(e.target.value)}
            placeholder="Optional"
            error={errors.armsCm}
          />
          <Input
            label="Thighs (cm)"
            type="number"
            value={thighsCm}
            onChange={(e) => setThighsCm(e.target.value)}
            placeholder="Optional"
            error={errors.thighsCm}
          />
        </div>

        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
        />

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Log Weight"}</Button>
        </div>
      </div>
    </Modal>
  );
}