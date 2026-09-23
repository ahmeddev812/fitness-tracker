import type {
  MealEntry,
  WaterEntry,
  WeightEntry,
  Workout,
  Goal,
} from "@/types/fitness";
import { getLastNDays, todayKey } from "./dates";

export function getRemainingCalories(target: number, consumed: number): number {
  return target - consumed;
}

export function getProgressPercent(consumed: number, target: number): number {
  if (!target || !Number.isFinite(target) || target <= 0) return 0;
  if (!Number.isFinite(consumed)) return 0;
  return (consumed / target) * 100;
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 100);
}

export function sumMealsForDate(
  meals: MealEntry[],
  date: string
): { calories: number; protein: number; carbs: number; fat: number } {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  for (const meal of meals) {
    if (meal.date === date) {
      calories += Number.isFinite(meal.calories) ? meal.calories : 0;
      protein += Number.isFinite(meal.protein) ? meal.protein : 0;
      carbs += Number.isFinite(meal.carbs) ? meal.carbs : 0;
      fat += Number.isFinite(meal.fat) ? meal.fat : 0;
    }
  }

  return { calories, protein, carbs, fat };
}

export function getWaterTotalForDate(
  entries: WaterEntry[],
  date: string
): number {
  let total = 0;
  for (const entry of entries) {
    if (entry.date === date) {
      total += Number.isFinite(entry.amountMl) ? entry.amountMl : 0;
    }
  }
  return total;
}

export function getWeightChange(entries: WeightEntry[]): {
  latest: number | null;
  previous: number | null;
  delta: number | null;
} {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  if (sorted.length === 0) return { latest: null, previous: null, delta: null };
  const latest = sorted[0].weightKg;
  if (sorted.length < 2) return { latest, previous: null, delta: null };
  const previous = sorted[1].weightKg;
  return { latest, previous, delta: latest - previous };
}

export function getWorkoutVolume(workout: Workout): number {
  let volume = 0;
  for (const ex of workout.exercises) {
    const sets = Number.isFinite(ex.sets) ? ex.sets : 0;
    const reps = Number.isFinite(ex.reps) ? ex.reps : 0;
    const weight = ex.weightKg != null && Number.isFinite(ex.weightKg) ? ex.weightKg : 0;
    volume += sets * reps * weight;
  }
  return volume;
}

export function getTodayWorkoutSummary(workouts: Workout[]): {
  name: string;
  exerciseCount: number;
  volume: number;
} | null {
  const today = todayKey();
  const todayWorkouts = workouts.filter((w) => w.date === today);
  if (todayWorkouts.length === 0) return null;

  const workout = todayWorkouts[0];
  return {
    name: workout.name,
    exerciseCount: workout.exercises.length,
    volume: getWorkoutVolume(workout),
  };
}

export interface WeeklyDataPoint {
  date: string;
  weight?: number;
  calories?: number;
}

export function getWeeklySeries(
  weights: WeightEntry[],
  meals: MealEntry[],
  days: number = 7
): WeeklyDataPoint[] {
  const dateKeys = getLastNDays(days);
  return dateKeys.map((date) => {
    const weightEntry = [...weights]
      .sort((a, b) => b.date.localeCompare(a.date))
      .find((w) => w.date === date);
    const mealTotals = sumMealsForDate(meals, date);
    return {
      date,
      weight: weightEntry?.weightKg,
      calories: mealTotals.calories > 0 ? mealTotals.calories : undefined,
    };
  });
}

export type GoalProgress =
  | { kind: "computed"; percent: number; current: number }
  | { kind: "manual" };

export function getGoalProgress(
  goal: Goal,
  currentWeightKg: number | undefined
): GoalProgress {
  if (
    goal.type === "strength" ||
    goal.type === "general_fitness" ||
    goal.startValue == null ||
    goal.targetValue == null ||
    goal.targetValue === goal.startValue
  ) {
    return { kind: "manual" };
  }

  const current = currentWeightKg;
  if (current == null || !Number.isFinite(current)) {
    return { kind: "manual" };
  }

  const range = goal.targetValue - goal.startValue;
  const progress = ((current - goal.startValue) / range) * 100;
  const clamped = Math.min(Math.max(progress, 0), 100);

  return { kind: "computed", percent: clamped, current };
}