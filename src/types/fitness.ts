export type UnitSystem = "metric" | "imperial";
export type ThemePreference = "light" | "dark" | "system";
export type GoalStatus = "active" | "completed" | "archived";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type GoalType =
  | "muscle_gain"
  | "weight_loss"
  | "weight_maintenance"
  | "strength"
  | "general_fitness"
  | "streak"
  | "water";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "core"
  | "cardio"
  | "full_body";

export interface UserProfile {
  name: string;
  age?: number;
  heightCm?: number;
  currentWeightKg?: number;
  activityLevel?: ActivityLevel;
  calorieTarget: number;
  proteinTarget: number;
  waterTargetMl: number;
  avatar?: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
  gender?: "male" | "female" | "other";
  neckCm?: number;
  hipCm?: number;
}

export interface AppSettings {
  units: UnitSystem;
  theme: ThemePreference;
  notificationsEnabled: boolean;
  waterReminderIntervalHours: number;
  mealReminderEnabled: boolean;
  workoutReminderEnabled: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: "sm" | "md" | "lg";
  customCupSizes: number[];
  caffeineTracking: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
}

export interface ExerciseEntry {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weightKg?: number;
  restSeconds?: number;
  notes?: string;
  setLog?: SetLogEntry[];
}

export interface SetLogEntry {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  date: string;
  name: string;
  category?: string;
  durationMinutes?: number;
  exercises: ExerciseEntry[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
  templateName?: string;
}

export interface MealEntry {
  id: string;
  date: string;
  mealType: MealType;
  foodName: string;
  quantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
  createdAt: string;
  servingMultiplier?: number;
}

export interface WaterEntry {
  id: string;
  date: string;
  amountMl: number;
  createdAt: string;
  note?: string;
  caffeineMg?: number;
}

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  chestCm?: number;
  armsCm?: number;
  thighsCm?: number;
  notes?: string;
}

export interface ActivityEntry {
  id: string;
  date: string;
  steps: number;
  notes?: string;
}

export interface Goal {
  id: string;
  type: GoalType;
  title?: string;
  startValue?: number;
  targetValue?: number;
  startDate: string;
  targetDate?: string;
  status: GoalStatus;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  date: string;
  workoutId: string;
  estimated1RM: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: ExerciseEntry[];
  category?: string;
  notes?: string;
  createdAt: string;
  useCount: number;
}

export interface MealTemplate {
  id: string;
  name: string;
  mealType: MealType;
  foodName: string;
  quantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
  useCount: number;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  base64: string;
  label?: string;
}

export interface Reminder {
  id: string;
  type: "water" | "meal" | "workout";
  enabled: boolean;
  timeOfDay?: string;
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  unlockedAt: string;
  icon: string;
}

export interface SearchHistoryEntry {
  query: string;
  timestamp: string;
}

export interface BackupData {
  version: number;
  exportedAt: string;
  profile: UserProfile;
  settings: AppSettings;
  workouts: Workout[];
  meals: MealEntry[];
  water: WaterEntry[];
  weights: WeightEntry[];
  goals: Goal[];
  activity: ActivityEntry[];
  personalRecords: PersonalRecord[];
  workoutTemplates: WorkoutTemplate[];
  mealTemplates: MealTemplate[];
  progressPhotos: ProgressPhoto[];
  achievements: Achievement[];
}

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "custom";
