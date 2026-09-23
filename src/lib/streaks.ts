import type { Workout, WaterEntry, MealEntry } from "@/types/fitness";
import { sumMealsForDate, getWaterTotalForDate } from "@/lib/calculations";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
}

export function calculateStreaks(
  workouts: Workout[],
  water: WaterEntry[],
  meals: MealEntry[],
  calorieTarget: number,
  waterTargetMl: number
): StreakData {
  const today = new Date();
  const dates: string[] = [];

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (const date of dates) {
    const hasWorkout = workouts.some((w) => w.date === date);
    const waterTotal = getWaterTotalForDate(water, date);
    const waterMet = waterTotal >= waterTargetMl * 0.8;
    const mealTotals = sumMealsForDate(meals, date);
    const caloriesMet = mealTotals.calories >= calorieTarget * 0.8;
    const isActive = hasWorkout || waterMet || caloriesMet;

    if (isActive) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      if (currentStreak === 0 && tempStreak > 0) {
        currentStreak = tempStreak;
      }
      tempStreak = 0;
    }
  }

  if (currentStreak === 0) currentStreak = tempStreak;

  return { currentStreak, longestStreak };
}

export function getStreakFireLevel(streak: number): "none" | "low" | "medium" | "high" {
  if (streak >= 30) return "high";
  if (streak >= 14) return "medium";
  if (streak >= 7) return "low";
  return "none";
}
