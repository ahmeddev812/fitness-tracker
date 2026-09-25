"use client";

import { memo, useState } from "react";
import { useFitnessActions } from "@/hooks/useFitnessData";
import { todayKey } from "@/lib/dates";
import type { Workout } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { useToast } from "@/components/ui/toast";
import { Apple, Droplets, Scale, Dumbbell } from "lucide-react";
import { m } from "framer-motion";

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

const ACTIONS = [
  { key: "workout", label: "Log Workout", Icon: Dumbbell },
  { key: "meal", label: "Log Meal", Icon: Apple },
  { key: "water", label: "Add Water", Icon: Droplets },
  { key: "weight", label: "Log Weight", Icon: Scale },
] as const;

function QuickActionsImpl() {
  const { addWaterEntry, addMeal, addWeightEntry, addWorkout } = useFitnessActions();
  const { toast } = useToast();
  const [openModal, setOpenModal] = useState<string | null>(null);

  const [waterAmount, setWaterAmount] = useState("");
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [mealCalories, setMealCalories] = useState("");
  const [mealProtein, setMealProtein] = useState("");
  const [mealCarbs, setMealCarbs] = useState("");
  const [mealFat, setMealFat] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const resetForms = () => {
    setWaterAmount("");
    setMealName("");
    setMealType("breakfast");
    setMealCalories("");
    setMealProtein("");
    setMealCarbs("");
    setMealFat("");
    setWeightKg("");
  };

  const handleWaterAdd = () => {
    const amount = parseInt(waterAmount, 10);
    if (isNaN(amount) || amount <= 0 || amount > 5000) {
      toast("Enter a valid amount (1-5000 ml)", "error");
      return;
    }
    addWaterEntry({ date: todayKey(), amountMl: amount });
    toast(`+${amount} ml water logged`, "success");
    resetForms();
    setOpenModal(null);
  };

  const handleMealAdd = () => {
    if (!mealName.trim()) {
      toast("Food name is required", "error");
      return;
    }
    const cal = parseFloat(mealCalories);
    const pro = parseFloat(mealProtein);
    const carb = parseFloat(mealCarbs);
    const fat = parseFloat(mealFat);
    if (isNaN(cal) || cal < 0) {
      toast("Enter valid calories", "error");
      return;
    }
    addMeal({
      date: todayKey(),
      mealType: mealType as "breakfast" | "lunch" | "dinner" | "snack",
      foodName: mealName.trim(),
      calories: cal,
      protein: isNaN(pro) ? 0 : pro,
      carbs: isNaN(carb) ? 0 : carb,
      fat: isNaN(fat) ? 0 : fat,
    });
    toast("Meal logged", "success");
    resetForms();
    setOpenModal(null);
  };

  const handleWeightAdd = () => {
    const w = parseFloat(weightKg);
    if (isNaN(w) || w <= 0 || w > 400) {
      toast("Enter a valid weight (1-400 kg)", "error");
      return;
    }
    addWeightEntry({ date: todayKey(), weightKg: w });
    toast("Weight logged", "success");
    resetForms();
    setOpenModal(null);
  };

  const handleWorkoutSave = (data: Omit<Workout, "id" | "createdAt" | "updatedAt">) => {
    addWorkout(data);
    toast("Workout added", "success");
    setOpenModal(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {ACTIONS.map(({ key, label, Icon }, i) => (
          <m.button
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            onClick={() => setOpenModal(key)}
            className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 glass-strong p-4 transition-all duration-300 hover-lift hover:border-primary/30"
          >
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary/15">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              {label}
            </span>
          </m.button>
        ))}
      </div>

      <WorkoutForm
        open={openModal === "workout"}
        onClose={() => setOpenModal(null)}
        onSave={handleWorkoutSave}
      />

      <Modal open={openModal === "water"} onClose={() => { setOpenModal(null); resetForms(); }} title="Add Water">
        <div className="space-y-4 mt-4">
          <Input
            label="Amount (ml)"
            type="number"
            value={waterAmount}
            onChange={(e) => setWaterAmount(e.target.value)}
            placeholder="250"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setOpenModal(null); resetForms(); }}>Cancel</Button>
            <Button onClick={handleWaterAdd}>Add</Button>
          </div>
        </div>
      </Modal>

      <Modal open={openModal === "meal"} onClose={() => { setOpenModal(null); resetForms(); }} title="Add Meal">
        <div className="space-y-4 mt-4">
          <Select
            label="Meal Type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            options={MEAL_TYPES}
          />
          <Input
            label="Food Name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder="e.g. Chicken breast"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Calories" type="number" value={mealCalories} onChange={(e) => setMealCalories(e.target.value)} placeholder="0" />
            <Input label="Protein (g)" type="number" value={mealProtein} onChange={(e) => setMealProtein(e.target.value)} placeholder="0" />
            <Input label="Carbs (g)" type="number" value={mealCarbs} onChange={(e) => setMealCarbs(e.target.value)} placeholder="0" />
            <Input label="Fat (g)" type="number" value={mealFat} onChange={(e) => setMealFat(e.target.value)} placeholder="0" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setOpenModal(null); resetForms(); }}>Cancel</Button>
            <Button onClick={handleMealAdd}>Add</Button>
          </div>
        </div>
      </Modal>

      <Modal open={openModal === "weight"} onClose={() => { setOpenModal(null); resetForms(); }} title="Add Weight">
        <div className="space-y-4 mt-4">
          <Input
            label="Weight (kg)"
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="75.0"
            step="0.1"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setOpenModal(null); resetForms(); }}>Cancel</Button>
            <Button onClick={handleWeightAdd}>Add</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export const QuickActions = memo(QuickActionsImpl);
QuickActions.displayName = "QuickActions";
