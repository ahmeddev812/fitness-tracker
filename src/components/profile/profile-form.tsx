"use client";

import { useState } from "react";
import type { UserProfile, ActivityLevel } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "light", label: "Light (1-3 days/week)" },
  { value: "moderate", label: "Moderate (3-5 days/week)" },
  { value: "active", label: "Active (6-7 days/week)" },
  { value: "very_active", label: "Very Active (2x/day)" },
];

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
}

function validateNumber(value: string, label: string, min?: number, max?: number): string | null {
  if (!value) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return `${label} must be a number`;
  if (min != null && num < min) return `${label} must be at least ${min}`;
  if (max != null && num > max) return `${label} must be at most ${max}`;
  return null;
}

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age?.toString() ?? "");
  const [heightCm, setHeightCm] = useState(profile.heightCm?.toString() ?? "");
  const [currentWeightKg, setCurrentWeightKg] = useState(profile.currentWeightKg?.toString() ?? "");
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel ?? "moderate");
  const [calorieTarget, setCalorieTarget] = useState(profile.calorieTarget.toString());
  const [proteinTarget, setProteinTarget] = useState(profile.proteinTarget.toString());
  const [waterTargetMl, setWaterTargetMl] = useState(profile.waterTargetMl.toString());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    const ageErr = validateNumber(age, "Age", 10, 120);
    if (ageErr) e.age = ageErr;
    const heightErr = validateNumber(heightCm, "Height", 50, 250);
    if (heightErr) e.heightCm = heightErr;
    const weightErr = validateNumber(currentWeightKg, "Weight", 20, 400);
    if (weightErr) e.currentWeightKg = weightErr;
    const calErr = validateNumber(calorieTarget, "Calorie target", 0, 10000);
    if (calErr) e.calorieTarget = calErr;
    const proErr = validateNumber(proteinTarget, "Protein target", 0, 1000);
    if (proErr) e.proteinTarget = proErr;
    const waterErr = validateNumber(waterTargetMl, "Water target", 0, 20000);
    if (waterErr) e.waterTargetMl = waterErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      name: name.trim(),
      age: age ? parseInt(age) : undefined,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      currentWeightKg: currentWeightKg ? parseFloat(currentWeightKg) : undefined,
      activityLevel,
      calorieTarget: parseFloat(calorieTarget) || 2200,
      proteinTarget: parseFloat(proteinTarget) || 140,
      waterTargetMl: parseFloat(waterTargetMl) || 2500,
    });
    toast("Profile updated", "success");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          error={errors.name}
        />
        <Input
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="e.g. 28"
          error={errors.age}
        />
        <Input
          label="Height (cm)"
          type="number"
          value={heightCm}
          onChange={(e) => setHeightCm(e.target.value)}
          placeholder="e.g. 175"
          error={errors.heightCm}
        />
        <Input
          label="Current Weight (kg)"
          type="number"
          value={currentWeightKg}
          onChange={(e) => setCurrentWeightKg(e.target.value)}
          placeholder="e.g. 75"
          error={errors.currentWeightKg}
        />
      </div>

      <Select
        label="Activity Level"
        value={activityLevel}
        onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
        options={ACTIVITY_LEVELS}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Calorie Target (kcal)"
          type="number"
          value={calorieTarget}
          onChange={(e) => setCalorieTarget(e.target.value)}
          error={errors.calorieTarget}
        />
        <Input
          label="Protein Target (g)"
          type="number"
          value={proteinTarget}
          onChange={(e) => setProteinTarget(e.target.value)}
          error={errors.proteinTarget}
        />
        <Input
          label="Water Target (ml)"
          type="number"
          value={waterTargetMl}
          onChange={(e) => setWaterTargetMl(e.target.value)}
          error={errors.waterTargetMl}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Profile</Button>
      </div>
    </div>
  );
}