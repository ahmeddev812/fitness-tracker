import type {
  UserProfile,
  AppSettings,
  Workout,
  MealEntry,
  WaterEntry,
  WeightEntry,
  Goal,
  ActivityEntry,
  PersonalRecord,
  WorkoutTemplate,
  MealTemplate,
  ProgressPhoto,
  Achievement,
  SearchHistoryEntry,
} from "@/types/fitness";

const STORAGE_KEYS = {
  profile: "fitness_profile",
  settings: "fitness_settings",
  workouts: "fitness_workouts",
  meals: "fitness_nutrition",
  water: "fitness_water",
  weights: "fitness_weights",
  goals: "fitness_goals",
  activity: "fitness_activity",
  personalRecords: "fitness_prs",
  workoutTemplates: "fitness_workout_templates",
  mealTemplates: "fitness_meal_templates",
  progressPhotos: "fitness_progress_photos",
  achievements: "fitness_achievements",
  searchHistory: "fitness_search_history",
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

function isServer(): boolean {
  return typeof window === "undefined";
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (raw === null || raw === "") return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function getStoredData<T>(key: StorageKey, fallback: T): T {
  if (isServer()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return safeParse(raw, fallback);
  } catch {
    return fallback;
  }
}

function setStoredData<T>(key: StorageKey, value: T): boolean {
  if (isServer()) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function clearAllFitnessData(): void {
  if (isServer()) return;
  try {
    const keys = Object.values(STORAGE_KEYS);
    for (const key of keys) {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export function clearSpecificData(type: "workouts" | "meals" | "water" | "weights" | "goals" | "activity" | "prs" | "photos"): boolean {
  if (isServer()) return false;
  const keyMap: Record<string, StorageKey> = {
    workouts: STORAGE_KEYS.workouts,
    meals: STORAGE_KEYS.meals,
    water: STORAGE_KEYS.water,
    weights: STORAGE_KEYS.weights,
    goals: STORAGE_KEYS.goals,
    activity: STORAGE_KEYS.activity,
    prs: STORAGE_KEYS.personalRecords,
    photos: STORAGE_KEYS.progressPhotos,
  };
  const key = keyMap[type];
  if (!key) return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getStorageUsage(): { used: number; total: number; percent: number } {
  if (isServer()) return { used: 0, total: 5 * 1024 * 1024, percent: 0 };
  let totalBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("fitness_")) {
      const value = localStorage.getItem(key) || "";
      totalBytes += key.length + value.length;
    }
  }
  const total = 5 * 1024 * 1024;
  return { used: totalBytes, total, percent: (totalBytes / total) * 100 };
}

// --- Profile ---

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  calorieTarget: 2200,
  proteinTarget: 140,
  waterTargetMl: 2500,
  currentStreak: 0,
  longestStreak: 0,
};

export function getProfile(): UserProfile {
  const stored = getStoredData<Partial<UserProfile>>(STORAGE_KEYS.profile, {});
  return {
    name: stored.name ?? "",
    age: stored.age,
    heightCm: stored.heightCm,
    currentWeightKg: stored.currentWeightKg,
    activityLevel: stored.activityLevel,
    calorieTarget: typeof stored.calorieTarget === "number" && stored.calorieTarget > 0 ? stored.calorieTarget : DEFAULT_PROFILE.calorieTarget,
    proteinTarget: typeof stored.proteinTarget === "number" && stored.proteinTarget > 0 ? stored.proteinTarget : DEFAULT_PROFILE.proteinTarget,
    waterTargetMl: typeof stored.waterTargetMl === "number" && stored.waterTargetMl > 0 ? stored.waterTargetMl : DEFAULT_PROFILE.waterTargetMl,
    avatar: stored.avatar,
    currentStreak: stored.currentStreak ?? 0,
    longestStreak: stored.longestStreak ?? 0,
    lastActiveDate: stored.lastActiveDate,
    gender: stored.gender,
    neckCm: stored.neckCm,
    hipCm: stored.hipCm,
  };
}

export function saveProfile(profile: UserProfile): boolean {
  return setStoredData(STORAGE_KEYS.profile, profile);
}

// --- Settings ---

const DEFAULT_SETTINGS: AppSettings = {
  units: "metric",
  theme: "system",
  notificationsEnabled: false,
  waterReminderIntervalHours: 2,
  mealReminderEnabled: false,
  workoutReminderEnabled: false,
  reduceMotion: false,
  highContrast: false,
  fontSize: "md",
  customCupSizes: [250, 500, 1000],
  caffeineTracking: false,
};

export function getSettings(): AppSettings {
  const stored = getStoredData<Partial<AppSettings>>(STORAGE_KEYS.settings, {});
  return {
    units: stored.units === "imperial" ? "imperial" : "metric",
    theme: stored.theme === "light" || stored.theme === "dark" ? stored.theme : "system",
    notificationsEnabled: stored.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
    waterReminderIntervalHours: stored.waterReminderIntervalHours ?? DEFAULT_SETTINGS.waterReminderIntervalHours,
    mealReminderEnabled: stored.mealReminderEnabled ?? DEFAULT_SETTINGS.mealReminderEnabled,
    workoutReminderEnabled: stored.workoutReminderEnabled ?? DEFAULT_SETTINGS.workoutReminderEnabled,
    reduceMotion: stored.reduceMotion ?? DEFAULT_SETTINGS.reduceMotion,
    highContrast: stored.highContrast ?? DEFAULT_SETTINGS.highContrast,
    fontSize: stored.fontSize ?? DEFAULT_SETTINGS.fontSize,
    customCupSizes: Array.isArray(stored.customCupSizes) ? stored.customCupSizes : DEFAULT_SETTINGS.customCupSizes,
    caffeineTracking: stored.caffeineTracking ?? DEFAULT_SETTINGS.caffeineTracking,
  };
}

export function saveSettings(settings: AppSettings): boolean {
  return setStoredData(STORAGE_KEYS.settings, settings);
}

// --- Workouts ---

export function getWorkouts(): Workout[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.workouts, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (w): w is Workout =>
      typeof w === "object" &&
      w !== null &&
      "id" in w &&
      "date" in w &&
      "name" in w &&
      "exercises" in w &&
      Array.isArray((w as Workout).exercises)
  );
}

export function saveWorkouts(workouts: Workout[]): boolean {
  return setStoredData(STORAGE_KEYS.workouts, workouts);
}

// --- Meals ---

export function getMeals(): MealEntry[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.meals, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (m): m is MealEntry =>
      typeof m === "object" &&
      m !== null &&
      "id" in m &&
      "date" in m &&
      "mealType" in m &&
      "foodName" in m
  );
}

export function saveMeals(meals: MealEntry[]): boolean {
  return setStoredData(STORAGE_KEYS.meals, meals);
}

// --- Water ---

export function getWater(): WaterEntry[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.water, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (e): e is WaterEntry =>
      typeof e === "object" &&
      e !== null &&
      "id" in e &&
      "date" in e &&
      "amountMl" in e
  );
}

export function saveWater(entries: WaterEntry[]): boolean {
  return setStoredData(STORAGE_KEYS.water, entries);
}

// --- Weights ---

export function getWeights(): WeightEntry[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.weights, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (w): w is WeightEntry =>
      typeof w === "object" &&
      w !== null &&
      "id" in w &&
      "date" in w &&
      "weightKg" in w
  );
}

export function saveWeights(weights: WeightEntry[]): boolean {
  return setStoredData(STORAGE_KEYS.weights, weights);
}

// --- Goals ---

export function getGoals(): Goal[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.goals, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (g): g is Goal =>
      typeof g === "object" &&
      g !== null &&
      "id" in g &&
      "type" in g &&
      "startDate" in g &&
      "status" in g
  );
}

export function saveGoals(goals: Goal[]): boolean {
  return setStoredData(STORAGE_KEYS.goals, goals);
}

// --- Activity ---

export function getActivity(): ActivityEntry[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.activity, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (a): a is ActivityEntry =>
      typeof a === "object" &&
      a !== null &&
      "id" in a &&
      "date" in a &&
      "steps" in a
  );
}

export function saveActivity(entries: ActivityEntry[]): boolean {
  return setStoredData(STORAGE_KEYS.activity, entries);
}

// --- Personal Records ---

export function getPersonalRecords(): PersonalRecord[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.personalRecords, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (r): r is PersonalRecord =>
      typeof r === "object" &&
      r !== null &&
      "id" in r &&
      "exerciseId" in r &&
      "weightKg" in r
  );
}

export function savePersonalRecords(records: PersonalRecord[]): boolean {
  return setStoredData(STORAGE_KEYS.personalRecords, records);
}

// --- Workout Templates ---

export function getWorkoutTemplates(): WorkoutTemplate[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.workoutTemplates, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (t): t is WorkoutTemplate =>
      typeof t === "object" &&
      t !== null &&
      "id" in t &&
      "name" in t &&
      "exercises" in t &&
      Array.isArray((t as WorkoutTemplate).exercises)
  );
}

export function saveWorkoutTemplates(templates: WorkoutTemplate[]): boolean {
  return setStoredData(STORAGE_KEYS.workoutTemplates, templates);
}

// --- Meal Templates ---

export function getMealTemplates(): MealTemplate[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.mealTemplates, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (t): t is MealTemplate =>
      typeof t === "object" &&
      t !== null &&
      "id" in t &&
      "name" in t &&
      "foodName" in t
  );
}

export function saveMealTemplates(templates: MealTemplate[]): boolean {
  return setStoredData(STORAGE_KEYS.mealTemplates, templates);
}

// --- Progress Photos ---

export function getProgressPhotos(): ProgressPhoto[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.progressPhotos, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (p): p is ProgressPhoto =>
      typeof p === "object" &&
      p !== null &&
      "id" in p &&
      "date" in p &&
      "base64" in p
  );
}

export function saveProgressPhotos(photos: ProgressPhoto[]): boolean {
  return setStoredData(STORAGE_KEYS.progressPhotos, photos);
}

// --- Achievements ---

export function getAchievements(): Achievement[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.achievements, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (a): a is Achievement =>
      typeof a === "object" &&
      a !== null &&
      "id" in a &&
      "type" in a &&
      "title" in a
  );
}

export function saveAchievements(achievements: Achievement[]): boolean {
  return setStoredData(STORAGE_KEYS.achievements, achievements);
}

// --- Search History ---

export function getSearchHistory(): SearchHistoryEntry[] {
  const stored = getStoredData<unknown[]>(STORAGE_KEYS.searchHistory, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (s): s is SearchHistoryEntry =>
      typeof s === "object" &&
      s !== null &&
      "query" in s &&
      "timestamp" in s
  );
}

export function saveSearchHistory(history: SearchHistoryEntry[]): boolean {
  return setStoredData(STORAGE_KEYS.searchHistory, history);
}

// --- Export / Import ---

export function exportAllData(): string {
  if (isServer()) return "{}";
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: getProfile(),
    settings: getSettings(),
    workouts: getWorkouts(),
    meals: getMeals(),
    water: getWater(),
    weights: getWeights(),
    goals: getGoals(),
    activity: getActivity(),
    personalRecords: getPersonalRecords(),
    workoutTemplates: getWorkoutTemplates(),
    mealTemplates: getMealTemplates(),
    progressPhotos: getProgressPhotos(),
    achievements: getAchievements(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(json: string): boolean {
  if (isServer()) return false;
  try {
    const data = JSON.parse(json) as Record<string, unknown>;
    if (typeof data !== "object" || data === null) return false;

    if (data.profile && typeof data.profile === "object") saveProfile(data.profile as UserProfile);
    if (data.settings && typeof data.settings === "object") saveSettings(data.settings as AppSettings);
    if (Array.isArray(data.workouts)) saveWorkouts(data.workouts as Workout[]);
    if (Array.isArray(data.meals)) saveMeals(data.meals as MealEntry[]);
    if (Array.isArray(data.water)) saveWater(data.water as WaterEntry[]);
    if (Array.isArray(data.weights)) saveWeights(data.weights as WeightEntry[]);
    if (Array.isArray(data.goals)) saveGoals(data.goals as Goal[]);
    if (Array.isArray(data.activity)) saveActivity(data.activity as ActivityEntry[]);
    if (Array.isArray(data.personalRecords)) savePersonalRecords(data.personalRecords as PersonalRecord[]);
    if (Array.isArray(data.workoutTemplates)) saveWorkoutTemplates(data.workoutTemplates as WorkoutTemplate[]);
    if (Array.isArray(data.mealTemplates)) saveMealTemplates(data.mealTemplates as MealTemplate[]);
    if (Array.isArray(data.progressPhotos)) saveProgressPhotos(data.progressPhotos as ProgressPhoto[]);
    if (Array.isArray(data.achievements)) saveAchievements(data.achievements as Achievement[]);
    return true;
  } catch {
    return false;
  }
}
