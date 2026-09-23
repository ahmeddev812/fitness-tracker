"use client";

import { useState } from "react";
import type { MealEntry, MealType } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

interface MealFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (meal: Omit<MealEntry, "id" | "createdAt">) => void;
  date: string;
  initial?: Partial<MealEntry>;
  isEdit?: boolean;
}

function validateFoodName(name: string): string | null {
  if (!name.trim()) return "Food name is required";
  return null;
}

function validateNumber(value: string, label: string, max?: number): string | null {
  if (!value && value !== "0") return `${label} is required`;
  const num = parseFloat(value);
  if (isNaN(num)) return `${label} must be a number`;
  if (num < 0) return `${label} cannot be negative`;
  if (max && num > max) return `${label} cannot exceed ${max}`;
  return null;
}

export function MealForm({ open, onClose, onSave, date, initial, isEdit = false }: MealFormProps) {
  const [mealType, setMealType] = useState<MealType>(initial?.mealType ?? "breakfast");
  const [foodName, setFoodName] = useState(initial?.foodName ?? "");
  const [quantity, setQuantity] = useState(initial?.quantity ?? "");
  const [calories, setCalories] = useState(initial?.calories?.toString() ?? "");
  const [protein, setProtein] = useState(initial?.protein?.toString() ?? "");
  const [carbs, setCarbs] = useState(initial?.carbs?.toString() ?? "");
  const [fat, setFat] = useState(initial?.fat?.toString() ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const nameErr = validateFoodName(foodName);
    if (nameErr) e.foodName = nameErr;
    const calErr = validateNumber(calories, "Calories", 20000);
    if (calErr) e.calories = calErr;
    const proErr = validateNumber(protein, "Protein");
    if (proErr) e.protein = proErr;
    const carbErr = validateNumber(carbs, "Carbs");
    if (carbErr) e.carbs = carbErr;
    const fatErr = validateNumber(fat, "Fat");
    if (fatErr) e.fat = fatErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      date,
      mealType,
      foodName: foodName.trim(),
      quantity: quantity || undefined,
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Meal" : "Add Meal"}>
      <div className="space-y-4 mt-4">
        <Select
          label="Meal Type"
          value={mealType}
          onChange={(e) => setMealType(e.target.value as MealType)}
          options={MEAL_TYPES}
        />
        <div className="space-y-1.5">
          <Input
            label="Food Name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="e.g. Chicken breast"
            error={errors.foodName}
          />
        </div>
        <Input
          label="Serving Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 150 g, 1 cup"
          hint="Optional"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Calories"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="0"
            error={errors.calories}
          />
          <Input
            label="Protein (g)"
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="0"
            error={errors.protein}
          />
          <Input
            label="Carbs (g)"
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="0"
            error={errors.carbs}
          />
          <Input
            label="Fat (g)"
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            placeholder="0"
            error={errors.fat}
          />
        </div>
        <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Meal"}</Button>
        </div>
      </div>
    </Modal>
  );
}