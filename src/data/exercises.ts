import type { Exercise } from "@/types/fitness";

export const exercises: Exercise[] = [
  // Chest
  { id: "bench_press", name: "Bench Press", muscleGroup: "chest" },
  { id: "incline_dumbbell_press", name: "Incline Dumbbell Press", muscleGroup: "chest" },
  { id: "cable_fly", name: "Cable Fly", muscleGroup: "chest" },
  { id: "dumbbell_fly", name: "Dumbbell Fly", muscleGroup: "chest" },

  // Back
  { id: "lat_pulldown", name: "Lat Pulldown", muscleGroup: "back" },
  { id: "seated_row", name: "Seated Row", muscleGroup: "back" },
  { id: "pull_up", name: "Pull-up", muscleGroup: "back" },
  { id: "barbell_row", name: "Barbell Row", muscleGroup: "back" },

  // Shoulders
  { id: "shoulder_press", name: "Shoulder Press", muscleGroup: "shoulders" },
  { id: "lateral_raise", name: "Lateral Raise", muscleGroup: "shoulders" },
  { id: "rear_delt_fly", name: "Rear Delt Fly", muscleGroup: "shoulders" },

  // Biceps
  { id: "dumbbell_curl", name: "Dumbbell Curl", muscleGroup: "biceps" },
  { id: "hammer_curl", name: "Hammer Curl", muscleGroup: "biceps" },

  // Triceps
  { id: "rope_pushdown", name: "Rope Pushdown", muscleGroup: "triceps" },
  { id: "overhead_extension", name: "Overhead Extension", muscleGroup: "triceps" },

  // Legs
  { id: "squat", name: "Squat", muscleGroup: "legs" },
  { id: "leg_press", name: "Leg Press", muscleGroup: "legs" },
  { id: "leg_curl", name: "Leg Curl", muscleGroup: "legs" },
  { id: "leg_extension", name: "Leg Extension", muscleGroup: "legs" },
  { id: "calf_raise", name: "Calf Raise", muscleGroup: "legs" },

  // Core
  { id: "plank", name: "Plank", muscleGroup: "core" },
  { id: "crunch", name: "Crunch", muscleGroup: "core" },
  { id: "russian_twist", name: "Russian Twist", muscleGroup: "core" },

  // Cardio
  { id: "treadmill_run", name: "Treadmill Run", muscleGroup: "cardio" },
  { id: "cycling", name: "Cycling", muscleGroup: "cardio" },
  { id: "rowing_machine", name: "Rowing Machine", muscleGroup: "cardio" },

  // Full Body
  { id: "deadlift", name: "Deadlift", muscleGroup: "full_body" },
  { id: "burpee", name: "Burpee", muscleGroup: "full_body" },
  { id: "kettlebell_swing", name: "Kettlebell Swing", muscleGroup: "full_body" },
];