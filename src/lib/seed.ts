import type {
  Workout,
  MealEntry,
  WaterEntry,
  WeightEntry,
  Goal,
  ActivityEntry,
} from "@/types/fitness";
import type { ExerciseEntry } from "@/types/fitness";
import { generateId } from "@/lib/id";

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function subDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() - n);
  return r;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}


const WORKOUT_TEMPLATES: { name: string; category: string; exercises: Omit<ExerciseEntry, "setLog">[] }[] = [
  {
    name: "Push Day",
    category: "chest",
    exercises: [
      { exerciseId: "bench_press", exerciseName: "Bench Press", sets: 4, reps: 8, weightKg: 80 },
      { exerciseId: "incline_dumbbell_press", exerciseName: "Incline Dumbbell Press", sets: 3, reps: 10, weightKg: 30 },
      { exerciseId: "cable_fly", exerciseName: "Cable Fly", sets: 3, reps: 12, weightKg: 15 },
      { exerciseId: "shoulder_press", exerciseName: "Shoulder Press", sets: 3, reps: 10, weightKg: 40 },
      { exerciseId: "lateral_raise", exerciseName: "Lateral Raise", sets: 3, reps: 15, weightKg: 10 },
    ],
  },
  {
    name: "Pull Day",
    category: "back",
    exercises: [
      { exerciseId: "deadlift", exerciseName: "Deadlift", sets: 4, reps: 5, weightKg: 100 },
      { exerciseId: "lat_pulldown", exerciseName: "Lat Pulldown", sets: 3, reps: 10, weightKg: 55 },
      { exerciseId: "seated_row", exerciseName: "Seated Row", sets: 3, reps: 10, weightKg: 50 },
      { exerciseId: "dumbbell_curl", exerciseName: "Dumbbell Curl", sets: 3, reps: 12, weightKg: 14 },
      { exerciseId: "hammer_curl", exerciseName: "Hammer Curl", sets: 3, reps: 12, weightKg: 14 },
    ],
  },
  {
    name: "Leg Day",
    category: "legs",
    exercises: [
      { exerciseId: "squat", exerciseName: "Squat", sets: 4, reps: 8, weightKg: 90 },
      { exerciseId: "leg_press", exerciseName: "Leg Press", sets: 3, reps: 12, weightKg: 140 },
      { exerciseId: "leg_curl", exerciseName: "Leg Curl", sets: 3, reps: 12, weightKg: 35 },
      { exerciseId: "leg_extension", exerciseName: "Leg Extension", sets: 3, reps: 12, weightKg: 35 },
      { exerciseId: "calf_raise", exerciseName: "Calf Raise", sets: 4, reps: 15, weightKg: 60 },
    ],
  },
  {
    name: "Full Body HIIT",
    category: "cardio",
    exercises: [
      { exerciseId: "burpee", exerciseName: "Burpee", sets: 3, reps: 15, weightKg: 0 },
      { exerciseId: "kettlebell_swing", exerciseName: "Kettlebell Swing", sets: 3, reps: 20, weightKg: 20 },
      { exerciseId: "plank", exerciseName: "Plank", sets: 3, reps: 1, weightKg: 0 },
      { exerciseId: "russian_twist", exerciseName: "Russian Twist", sets: 3, reps: 20, weightKg: 10 },
      { exerciseId: "rowing_machine", exerciseName: "Rowing Machine", sets: 1, reps: 1, weightKg: 0 },
    ],
  },
  {
    name: "Core & Abs",
    category: "core",
    exercises: [
      { exerciseId: "plank", exerciseName: "Plank", sets: 3, reps: 1, weightKg: 0 },
      { exerciseId: "crunch", exerciseName: "Crunch", sets: 3, reps: 20, weightKg: 0 },
      { exerciseId: "russian_twist", exerciseName: "Russian Twist", sets: 3, reps: 20, weightKg: 12 },
    ],
  },
];

const MEAL_POOL = [
  { name: "Oatmeal with banana", calories: 350, protein: 12, carbs: 60, fat: 6, type: "breakfast" as const },
  { name: "Eggs and toast", calories: 400, protein: 25, carbs: 30, fat: 18, type: "breakfast" as const },
  { name: "Greek yogurt with berries", calories: 220, protein: 18, carbs: 28, fat: 4, type: "breakfast" as const },
  { name: "Smoothie bowl", calories: 380, protein: 15, carbs: 55, fat: 8, type: "breakfast" as const },
  { name: "Chicken breast with rice", calories: 550, protein: 42, carbs: 55, fat: 12, type: "lunch" as const },
  { name: "Tuna salad sandwich", calories: 420, protein: 30, carbs: 35, fat: 16, type: "lunch" as const },
  { name: "Turkey wrap", calories: 380, protein: 28, carbs: 30, fat: 14, type: "lunch" as const },
  { name: "Quinoa bowl with veggies", calories: 450, protein: 18, carbs: 60, fat: 14, type: "lunch" as const },
  { name: "Grilled salmon with veggies", calories: 520, protein: 40, carbs: 20, fat: 28, type: "dinner" as const },
  { name: "Pasta with meatballs", calories: 620, protein: 35, carbs: 70, fat: 20, type: "dinner" as const },
  { name: "Stir fry with tofu", calories: 440, protein: 25, carbs: 45, fat: 16, type: "dinner" as const },
  { name: "Steak with sweet potato", calories: 580, protein: 45, carbs: 40, fat: 22, type: "dinner" as const },
  { name: "Protein bar", calories: 220, protein: 20, carbs: 25, fat: 8, type: "snack" as const },
  { name: "Apple with peanut butter", calories: 280, protein: 8, carbs: 30, fat: 16, type: "snack" as const },
  { name: "Trail mix", calories: 320, protein: 10, carbs: 35, fat: 18, type: "snack" as const },
  { name: "Cottage cheese with fruit", calories: 180, protein: 22, carbs: 15, fat: 4, type: "snack" as const },
];

export interface SeedData {
  workouts: Workout[];
  meals: MealEntry[];
  water: WaterEntry[];
  weights: WeightEntry[];
  goals: Goal[];
  activity: ActivityEntry[];
}

export function generateDemoData(): SeedData {
  const now = new Date();
  const workouts: Workout[] = [];
  const meals: MealEntry[] = [];
  const water: WaterEntry[] = [];
  const weights: WeightEntry[] = [];
  const goals: Goal[] = [];
  const activity: ActivityEntry[] = [];

  const startWeight = 82 + Math.random() * 6;

  for (let day = 29; day >= 0; day--) {
    const d = subDays(now, day);
    const dk = dateKey(d);
    const ts = d.toISOString();

    // Workouts: ~5 per week, skip some days
    if (Math.random() > 0.3) {
      const template = randChoice(WORKOUT_TEMPLATES);
      const variation = 0.9 + Math.random() * 0.2;
      workouts.push({
        id: generateId(),
        date: dk,
        name: template.name,
        category: template.category,
        durationMinutes: randInt(30, 75),
        exercises: template.exercises.map((ex) => ({
          ...ex,
          weightKg: ex.weightKg ? Math.round(ex.weightKg * variation) : undefined,
        })),
        notes: Math.random() > 0.7 ? randChoice(["Felt strong!", "Good session", "Need more rest", "PR attempt next time", ""]) : undefined,
        createdAt: ts,
        updatedAt: ts,
      });
    }

    // Meals: 3-4 per day
    const mealTypes = ["breakfast", "lunch", "dinner"] as const;
    for (const mt of mealTypes) {
      const pool = MEAL_POOL.filter((m) => m.type === mt);
      const meal = randChoice(pool);
      const multiplier = 0.85 + Math.random() * 0.3;
      meals.push({
        id: generateId(),
        date: dk,
        mealType: mt,
        foodName: meal.name,
        calories: Math.round(meal.calories * multiplier),
        protein: Math.round(meal.protein * multiplier),
        carbs: Math.round(meal.carbs * multiplier),
        fat: Math.round(meal.fat * multiplier),
        createdAt: ts,
      });
    }
    if (Math.random() > 0.3) {
      const snackPool = MEAL_POOL.filter((m) => m.type === "snack");
      const snack = randChoice(snackPool);
      meals.push({
        id: generateId(),
        date: dk,
        mealType: "snack",
        foodName: snack.name,
        calories: Math.round(snack.calories * (0.8 + Math.random() * 0.4)),
        protein: Math.round(snack.protein * (0.8 + Math.random() * 0.4)),
        carbs: Math.round(snack.carbs * (0.8 + Math.random() * 0.4)),
        fat: Math.round(snack.fat * (0.8 + Math.random() * 0.4)),
        createdAt: ts,
      });
    }

    // Water: 2-5 entries per day
    const waterEntriesPerDay = randInt(2, 5);
    for (let w = 0; w < waterEntriesPerDay; w++) {
      water.push({
        id: generateId(),
        date: dk,
        amountMl: randChoice([250, 300, 350, 500, 500, 750]),
        createdAt: new Date(d.getTime() + w * 3600000 * randInt(2, 4)).toISOString(),
      });
    }

    // Weight: every other day with gradual decline
    if (day % 2 === 0 || day === 29) {
      const progressFactor = (29 - day) / 29;
      const weight = startWeight - progressFactor * 3 + (Math.random() - 0.5) * 0.8;
      weights.push({
        id: generateId(),
        date: dk,
        weightKg: Math.round(weight * 10) / 10,
        waistCm: 84 - progressFactor * 2 + (Math.random() - 0.5) * 1,
        notes: day === 29 ? "Starting weight" : undefined,
      });
    }

    // Activity/steps: most days
    if (Math.random() > 0.15) {
      activity.push({
        id: generateId(),
        date: dk,
        steps: randInt(4000, 12000),
      });
    }
  }

  // Goals
  const futureDate = dateKey(subDays(now, -60));

  goals.push({
    id: generateId(),
    type: "weight_loss",
    title: "Lose 5kg",
    startValue: startWeight,
    targetValue: startWeight - 5,
    startDate: dateKey(subDays(now, 29)),
    targetDate: futureDate,
    status: "active",
    createdAt: subDays(now, 29).toISOString(),
  });

  goals.push({
    id: generateId(),
    type: "strength",
    title: "Bench Press 100kg",
    startDate: dateKey(subDays(now, 29)),
    targetDate: futureDate,
    status: "active",
    notes: "Current max: ~85kg",
    createdAt: subDays(now, 29).toISOString(),
  });

  goals.push({
    id: generateId(),
    type: "general_fitness",
    title: "Work out 4x per week",
    startDate: dateKey(subDays(now, 29)),
    targetDate: futureDate,
    status: "active",
    createdAt: subDays(now, 29).toISOString(),
  });

  goals.push({
    id: generateId(),
    type: "water",
    title: "Drink 2.5L water daily",
    startDate: dateKey(subDays(now, 15)),
    status: "active",
    createdAt: subDays(now, 15).toISOString(),
  });

  goals.push({
    id: generateId(),
    type: "muscle_gain",
    title: "Gain 2kg muscle",
    startValue: 72,
    targetValue: 74,
    startDate: dateKey(subDays(now, 60)),
    targetDate: dateKey(subDays(now, -30)),
    status: "completed",
    completedAt: dateKey(subDays(now, 5)),
    createdAt: subDays(now, 60).toISOString(),
  });

  return { workouts, meals, water, weights, goals, activity };
}
