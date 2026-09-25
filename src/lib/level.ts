import type { Workout, MealEntry, WaterEntry, WeightEntry, Goal, PersonalRecord } from "@/types/fitness";

export const XP_PER_ACTION = {
  workout: 10,
  meal: 5,
  water: 2,
  weight: 3,
  goal: 20,
  pr: 15,
} as const;

export function getLevel(xp: number): {
  level: number;
  currentXp: number;
  nextLevelXp: number;
} {
  const levelThresholds = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250, 2800];
  let level = 1;
  for (let i = 1; i < levelThresholds.length; i++) {
    if (xp >= levelThresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  const currentLevelXp = levelThresholds[level - 1] || 0;
  const nextLevelXp =
    levelThresholds[level] || levelThresholds[levelThresholds.length - 1] + 500;
  return {
    level,
    currentXp: xp - currentLevelXp,
    nextLevelXp: nextLevelXp - currentLevelXp,
  };
}

export function calculateXp(input: {
  workouts: Workout[];
  meals: MealEntry[];
  water: WaterEntry[];
  weights: WeightEntry[];
  goals: Goal[];
  personalRecords: PersonalRecord[];
}): number {
  return (
    input.workouts.length * XP_PER_ACTION.workout +
    input.meals.length * XP_PER_ACTION.meal +
    input.water.length * XP_PER_ACTION.water +
    input.weights.length * XP_PER_ACTION.weight +
    input.goals.filter((g) => g.status === "completed").length * XP_PER_ACTION.goal +
    input.personalRecords.length * XP_PER_ACTION.pr
  );
}
