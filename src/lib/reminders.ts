import type { AppSettings } from "@/types/fitness";
import { scopeKey } from "@/lib/storage";

export interface ReminderCheck {
  type: "water" | "meal" | "workout";
  message: string;
}

export function checkReminders(settings: AppSettings): ReminderCheck[] {
  if (typeof window === "undefined") return [];
  if (!settings.notificationsEnabled) return [];

  const now = new Date();
  const hour = now.getHours();
  const checks: ReminderCheck[] = [];

  if (settings.notificationsEnabled) {
    const interval = settings.waterReminderIntervalHours || 2;
    const lastWaterCheck = parseInt(localStorage.getItem(scopeKey("fitness_last_water_reminder")) || "0", 10);
    const nowMs = now.getTime();
    if (nowMs - lastWaterCheck > interval * 60 * 60 * 1000) {
      checks.push({ type: "water", message: "Time to drink water! Stay hydrated." });
      localStorage.setItem(scopeKey("fitness_last_water_reminder"), String(nowMs));
    }
  }

  if (settings.mealReminderEnabled) {
    if (hour === 8 || hour === 12 || hour === 19) {
      const lastMealCheck = localStorage.getItem(scopeKey("fitness_last_meal_reminder")) || "";
      const todayKey = now.toISOString().split("T")[0];
      if (lastMealCheck !== `${todayKey}-${hour}`) {
        const mealName = hour === 8 ? "breakfast" : hour === 12 ? "lunch" : "dinner";
        checks.push({ type: "meal", message: `Don't forget to log your ${mealName}!` });
        localStorage.setItem(scopeKey("fitness_last_meal_reminder"), `${todayKey}-${hour}`);
      }
    }
  }

  if (settings.workoutReminderEnabled) {
    if (hour === 17 || hour === 18) {
      const lastWorkoutCheck = localStorage.getItem(scopeKey("fitness_last_workout_reminder")) || "";
      const todayKey = now.toISOString().split("T")[0];
      if (lastWorkoutCheck !== todayKey) {
        checks.push({ type: "workout", message: "Time for your workout! Let's crush it." });
        localStorage.setItem(scopeKey("fitness_last_workout_reminder"), todayKey);
      }
    }
  }

  return checks;
}
