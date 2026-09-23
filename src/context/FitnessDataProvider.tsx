"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
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
import { generateId } from "@/lib/id";
import { todayKey } from "@/lib/dates";
import * as storage from "@/lib/storage";

// --- Data context ---

interface FitnessData {
  isHydrated: boolean;
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
  searchHistory: SearchHistoryEntry[];
}

const FitnessDataContext = createContext<FitnessData | null>(null);

// --- Actions context ---

interface FitnessActions {
  addWorkout: (workout: Omit<Workout, "id" | "createdAt" | "updatedAt">) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  duplicateWorkout: (id: string) => void;
  addMeal: (meal: Omit<MealEntry, "id" | "createdAt">) => void;
  updateMeal: (id: string, updates: Partial<MealEntry>) => void;
  deleteMeal: (id: string) => void;
  copyYesterdayMeals: () => void;
  addWaterEntry: (entry: Omit<WaterEntry, "id" | "createdAt">) => void;
  deleteWaterEntry: (id: string) => void;
  undoLastWater: () => void;
  addWeightEntry: (entry: Omit<WeightEntry, "id">) => void;
  updateWeightEntry: (id: string, updates: Partial<WeightEntry>) => void;
  deleteWeightEntry: (id: string) => void;
  upsertActivity: (entry: Omit<ActivityEntry, "id">) => void;
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  archiveGoal: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetAllData: () => void;
  addPersonalRecord: (pr: Omit<PersonalRecord, "id">) => void;
  deletePersonalRecord: (id: string) => void;
  addWorkoutTemplate: (template: Omit<WorkoutTemplate, "id" | "createdAt" | "useCount">) => void;
  deleteWorkoutTemplate: (id: string) => void;
  applyWorkoutTemplate: (id: string) => Workout | null;
  addMealTemplate: (template: Omit<MealTemplate, "id" | "createdAt" | "useCount">) => void;
  deleteMealTemplate: (id: string) => void;
  applyMealTemplate: (id: string) => Omit<MealEntry, "id" | "createdAt"> | null;
  addProgressPhoto: (photo: Omit<ProgressPhoto, "id">) => void;
  deleteProgressPhoto: (id: string) => void;
  addAchievement: (achievement: Omit<Achievement, "id">) => void;
  addSearchHistoryEntry: (query: string) => void;
  clearSearchHistory: () => void;
}

const FitnessActionsContext = createContext<FitnessActions | null>(null);

// --- Provider ---

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  calorieTarget: 2200,
  proteinTarget: 140,
  waterTargetMl: 2500,
  currentStreak: 0,
  longestStreak: 0,
};

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

export function FitnessDataProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: authLoaded } = useUser();

  const [isHydrated, setIsHydrated] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({ ...DEFAULT_PROFILE });
  const [settings, setSettings] = useState<AppSettings>({ ...DEFAULT_SETTINGS });
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [water, setWater] = useState<WaterEntry[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [mealTemplates, setMealTemplates] = useState<MealTemplate[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);

  const hydratedForUserRef = useRef<string | null | undefined>(undefined);

  const userId = clerkUser?.id ?? null;

  const resetToEmpty = useCallback(() => {
    setProfile({ ...DEFAULT_PROFILE });
    setSettings({ ...DEFAULT_SETTINGS });
    setWorkouts([]);
    setMeals([]);
    setWater([]);
    setWeights([]);
    setGoals([]);
    setActivity([]);
    setPersonalRecords([]);
    setWorkoutTemplates([]);
    setMealTemplates([]);
    setProgressPhotos([]);
    setAchievements([]);
    setSearchHistory([]);
    setIsHydrated(true);
  }, []);

  // Hydrate from localStorage, scoped to the signed-in Clerk user
  useEffect(() => {
    if (!authLoaded) return;
    if (hydratedForUserRef.current === userId) return;
    hydratedForUserRef.current = userId;

    // Defer so React doesn't treat storage hydration as a cascading effect write.
    const handle = window.setTimeout(() => {
      storage.setStorageUserId(userId);

      if (!userId) {
        resetToEmpty();
        return;
      }

      const storedProfile = storage.getProfile();
      if (!storedProfile.name && clerkUser) {
        const derived =
          clerkUser.fullName ||
          clerkUser.firstName ||
          clerkUser.username ||
          "";
        if (derived) {
          const seeded = { ...storedProfile, name: derived };
          storage.saveProfile(seeded);
          setProfile(seeded);
        } else {
          setProfile(storedProfile);
        }
      } else {
        setProfile(storedProfile);
      }

      setSettings(storage.getSettings());
      setWorkouts(storage.getWorkouts());
      setMeals(storage.getMeals());
      setWater(storage.getWater());
      setWeights(storage.getWeights());
      setGoals(storage.getGoals());
      setActivity(storage.getActivity());
      setPersonalRecords(storage.getPersonalRecords());
      setWorkoutTemplates(storage.getWorkoutTemplates());
      setMealTemplates(storage.getMealTemplates());
      setProgressPhotos(storage.getProgressPhotos());
      setAchievements(storage.getAchievements());
      setSearchHistory(storage.getSearchHistory());
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(handle);
  }, [authLoaded, userId, clerkUser, resetToEmpty]);

  // --- Workout Mutations ---

  const addWorkout = useCallback(
    (data: Omit<Workout, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const workout: Workout = {
        ...data,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      const updated = [...workouts, workout];
      setWorkouts(updated);
      storage.saveWorkouts(updated);

      // Auto-detect PRs
      for (const ex of workout.exercises) {
        if (ex.weightKg && ex.weightKg > 0) {
          const existingPRs = personalRecords.filter((r) => r.exerciseId === ex.exerciseId);
          const bestPR = existingPRs.sort((a, b) => b.weightKg - a.weightKg)[0];
          if (!bestPR || ex.weightKg > bestPR.weightKg) {
            const estimated1RM = ex.weightKg * (1 + ex.reps / 30);
            const newPR: PersonalRecord = {
              id: generateId(),
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName,
              weightKg: ex.weightKg,
              reps: ex.reps,
              date: workout.date,
              workoutId: workout.id,
              estimated1RM: Math.round(estimated1RM * 10) / 10,
            };
            const updatedPRs = [...personalRecords, newPR];
            setPersonalRecords(updatedPRs);
            storage.savePersonalRecords(updatedPRs);
          }
        }
      }

      // Update streak
      const today = todayKey();
      if (workout.date === today) {
        setProfile((prev) => {
          const updated = {
            ...prev,
            lastActiveDate: today,
            currentStreak: prev.currentStreak + 1,
            longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
          };
          storage.saveProfile(updated);
          return updated;
        });
      }
    },
    [workouts, personalRecords]
  );

  const updateWorkout = useCallback(
    (id: string, updates: Partial<Workout>) => {
      const updated = workouts.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      );
      setWorkouts(updated);
      storage.saveWorkouts(updated);
    },
    [workouts]
  );

  const deleteWorkout = useCallback(
    (id: string) => {
      const updated = workouts.filter((w) => w.id !== id);
      setWorkouts(updated);
      storage.saveWorkouts(updated);
    },
    [workouts]
  );

  const duplicateWorkout = useCallback(
    (id: string) => {
      const source = workouts.find((w) => w.id === id);
      if (!source) return;
      const now = new Date().toISOString();
      const duplicate: Workout = {
        ...source,
        id: generateId(),
        date: todayKey(),
        createdAt: now,
        updatedAt: now,
        name: `${source.name} (Copy)`,
      };
      const updated = [...workouts, duplicate];
      setWorkouts(updated);
      storage.saveWorkouts(updated);
    },
    [workouts]
  );

  // --- Meal Mutations ---

  const addMeal = useCallback(
    (data: Omit<MealEntry, "id" | "createdAt">) => {
      const meal: MealEntry = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...meals, meal];
      setMeals(updated);
      storage.saveMeals(updated);
    },
    [meals]
  );

  const updateMeal = useCallback(
    (id: string, updates: Partial<MealEntry>) => {
      const updated = meals.map((m) => (m.id === id ? { ...m, ...updates } : m));
      setMeals(updated);
      storage.saveMeals(updated);
    },
    [meals]
  );

  const deleteMeal = useCallback(
    (id: string) => {
      const updated = meals.filter((m) => m.id !== id);
      setMeals(updated);
      storage.saveMeals(updated);
    },
    [meals]
  );

  const copyYesterdayMeals = useCallback(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const day = String(yesterday.getDate()).padStart(2, "0");
    const yesterdayKey = `${year}-${month}-${day}`;
    const today = todayKey();
    const yesterdayMeals = meals.filter((m) => m.date === yesterdayKey);
    if (yesterdayMeals.length === 0) return;
    const newMeals = yesterdayMeals.map((m) => ({
      ...m,
      id: generateId(),
      date: today,
      createdAt: new Date().toISOString(),
    }));
    const updated = [...meals, ...newMeals];
    setMeals(updated);
    storage.saveMeals(updated);
  }, [meals]);

  // --- Water Mutations ---

  const addWaterEntry = useCallback(
    (data: Omit<WaterEntry, "id" | "createdAt">) => {
      const entry: WaterEntry = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...water, entry];
      setWater(updated);
      storage.saveWater(updated);
    },
    [water]
  );

  const deleteWaterEntry = useCallback(
    (id: string) => {
      const updated = water.filter((e) => e.id !== id);
      setWater(updated);
      storage.saveWater(updated);
    },
    [water]
  );

  const undoLastWater = useCallback(() => {
    if (water.length === 0) return;
    const sorted = [...water].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const updated = water.filter((e) => e.id !== sorted[0].id);
    setWater(updated);
    storage.saveWater(updated);
  }, [water]);

  // --- Weight Mutations ---

  const addWeightEntry = useCallback(
    (data: Omit<WeightEntry, "id">) => {
      const entry: WeightEntry = { ...data, id: generateId() };
      const updated = [...weights, entry];
      setWeights(updated);
      storage.saveWeights(updated);
    },
    [weights]
  );

  const updateWeightEntry = useCallback(
    (id: string, updates: Partial<WeightEntry>) => {
      const updated = weights.map((w) => (w.id === id ? { ...w, ...updates } : w));
      setWeights(updated);
      storage.saveWeights(updated);
    },
    [weights]
  );

  const deleteWeightEntry = useCallback(
    (id: string) => {
      const updated = weights.filter((w) => w.id !== id);
      setWeights(updated);
      storage.saveWeights(updated);
    },
    [weights]
  );

  // --- Activity ---

  const upsertActivity = useCallback(
    (data: Omit<ActivityEntry, "id">) => {
      const existing = activity.find((a) => a.date === data.date);
      let updated: ActivityEntry[];
      if (existing) {
        updated = activity.map((a) =>
          a.date === data.date ? { ...a, steps: data.steps, notes: data.notes } : a
        );
      } else {
        updated = [...activity, { ...data, id: generateId() }];
      }
      setActivity(updated);
      storage.saveActivity(updated);
    },
    [activity]
  );

  // --- Goal Mutations ---

  const addGoal = useCallback(
    (data: Omit<Goal, "id" | "createdAt">) => {
      const goal: Goal = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...goals, goal];
      setGoals(updated);
      storage.saveGoals(updated);
    },
    [goals]
  );

  const updateGoal = useCallback(
    (id: string, updates: Partial<Goal>) => {
      const updated = goals.map((g) => (g.id === id ? { ...g, ...updates } : g));
      setGoals(updated);
      storage.saveGoals(updated);
    },
    [goals]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      const updated = goals.filter((g) => g.id !== id);
      setGoals(updated);
      storage.saveGoals(updated);
    },
    [goals]
  );

  const completeGoal = useCallback(
    (id: string) => {
      const updated = goals.map((g) =>
        g.id === id
          ? { ...g, status: "completed" as const, completedAt: new Date().toISOString().split("T")[0] }
          : g
      );
      setGoals(updated);
      storage.saveGoals(updated);
    },
    [goals]
  );

  const archiveGoal = useCallback(
    (id: string) => {
      const updated = goals.map((g) =>
        g.id === id ? { ...g, status: "archived" as const } : g
      );
      setGoals(updated);
      storage.saveGoals(updated);
    },
    [goals]
  );

  // --- Profile / Settings ---

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setProfile((prev) => {
        const updated = { ...prev, ...updates };
        storage.saveProfile(updated);
        return updated;
      });
    },
    []
  );

  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...updates };
        storage.saveSettings(updated);
        return updated;
      });
    },
    []
  );

  const resetAllData = useCallback(() => {
    storage.clearAllFitnessData();
    setProfile({ ...DEFAULT_PROFILE });
    setSettings({ ...DEFAULT_SETTINGS });
    setWorkouts([]);
    setMeals([]);
    setWater([]);
    setWeights([]);
    setGoals([]);
    setActivity([]);
    setPersonalRecords([]);
    setWorkoutTemplates([]);
    setMealTemplates([]);
    setProgressPhotos([]);
    setAchievements([]);
    setSearchHistory([]);
  }, []);

  // --- Personal Records ---

  const addPersonalRecord = useCallback(
    (pr: Omit<PersonalRecord, "id">) => {
      const record: PersonalRecord = { ...pr, id: generateId() };
      const updated = [...personalRecords, record];
      setPersonalRecords(updated);
      storage.savePersonalRecords(updated);
    },
    [personalRecords]
  );

  const deletePersonalRecord = useCallback(
    (id: string) => {
      const updated = personalRecords.filter((r) => r.id !== id);
      setPersonalRecords(updated);
      storage.savePersonalRecords(updated);
    },
    [personalRecords]
  );

  // --- Workout Templates ---

  const addWorkoutTemplate = useCallback(
    (template: Omit<WorkoutTemplate, "id" | "createdAt" | "useCount">) => {
      const newTemplate: WorkoutTemplate = {
        ...template,
        id: generateId(),
        createdAt: new Date().toISOString(),
        useCount: 0,
      };
      const updated = [...workoutTemplates, newTemplate];
      setWorkoutTemplates(updated);
      storage.saveWorkoutTemplates(updated);
    },
    [workoutTemplates]
  );

  const deleteWorkoutTemplate = useCallback(
    (id: string) => {
      const updated = workoutTemplates.filter((t) => t.id !== id);
      setWorkoutTemplates(updated);
      storage.saveWorkoutTemplates(updated);
    },
    [workoutTemplates]
  );

  const applyWorkoutTemplate = useCallback(
    (id: string): Workout | null => {
      const template = workoutTemplates.find((t) => t.id === id);
      if (!template) return null;
      const updated = workoutTemplates.map((t) =>
        t.id === id ? { ...t, useCount: t.useCount + 1 } : t
      );
      setWorkoutTemplates(updated);
      storage.saveWorkoutTemplates(updated);
      const now = new Date().toISOString();
      return {
        id: generateId(),
        date: todayKey(),
        name: template.name,
        category: template.category,
        exercises: template.exercises,
        notes: template.notes,
        createdAt: now,
        updatedAt: now,
      };
    },
    [workoutTemplates]
  );

  // --- Meal Templates ---

  const addMealTemplate = useCallback(
    (template: Omit<MealTemplate, "id" | "createdAt" | "useCount">) => {
      const newTemplate: MealTemplate = {
        ...template,
        id: generateId(),
        createdAt: new Date().toISOString(),
        useCount: 0,
      };
      const updated = [...mealTemplates, newTemplate];
      setMealTemplates(updated);
      storage.saveMealTemplates(updated);
    },
    [mealTemplates]
  );

  const deleteMealTemplate = useCallback(
    (id: string) => {
      const updated = mealTemplates.filter((t) => t.id !== id);
      setMealTemplates(updated);
      storage.saveMealTemplates(updated);
    },
    [mealTemplates]
  );

  const applyMealTemplate = useCallback(
    (id: string): Omit<MealEntry, "id" | "createdAt"> | null => {
      const template = mealTemplates.find((t) => t.id === id);
      if (!template) return null;
      const updated = mealTemplates.map((t) =>
        t.id === id ? { ...t, useCount: t.useCount + 1 } : t
      );
      setMealTemplates(updated);
      storage.saveMealTemplates(updated);
      return {
        date: todayKey(),
        mealType: template.mealType,
        foodName: template.foodName,
        quantity: template.quantity,
        calories: template.calories,
        protein: template.protein,
        carbs: template.carbs,
        fat: template.fat,
      };
    },
    [mealTemplates]
  );

  // --- Progress Photos ---

  const addProgressPhoto = useCallback(
    (photo: Omit<ProgressPhoto, "id">) => {
      const newPhoto: ProgressPhoto = { ...photo, id: generateId() };
      const updated = [...progressPhotos, newPhoto];
      setProgressPhotos(updated);
      storage.saveProgressPhotos(updated);
    },
    [progressPhotos]
  );

  const deleteProgressPhoto = useCallback(
    (id: string) => {
      const updated = progressPhotos.filter((p) => p.id !== id);
      setProgressPhotos(updated);
      storage.saveProgressPhotos(updated);
    },
    [progressPhotos]
  );

  // --- Achievements ---

  const addAchievement = useCallback(
    (achievement: Omit<Achievement, "id">) => {
      const exists = achievements.some((a) => a.type === achievement.type);
      if (exists) return;
      const newAchievement: Achievement = { ...achievement, id: generateId() };
      const updated = [...achievements, newAchievement];
      setAchievements(updated);
      storage.saveAchievements(updated);
    },
    [achievements]
  );

  // --- Search History ---

  const addSearchHistoryEntry = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      const entry: SearchHistoryEntry = {
        query: query.trim(),
        timestamp: new Date().toISOString(),
      };
      const filtered = searchHistory.filter((s) => s.query !== entry.query);
      const updated = [entry, ...filtered].slice(0, 20);
      setSearchHistory(updated);
      storage.saveSearchHistory(updated);
    },
    [searchHistory]
  );

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    storage.saveSearchHistory([]);
  }, []);

  // Memoize data
  const data = useMemo<FitnessData>(
    () => ({
      isHydrated,
      profile,
      settings,
      workouts,
      meals,
      water,
      weights,
      goals,
      activity,
      personalRecords,
      workoutTemplates,
      mealTemplates,
      progressPhotos,
      achievements,
      searchHistory,
    }),
    [isHydrated, profile, settings, workouts, meals, water, weights, goals, activity, personalRecords, workoutTemplates, mealTemplates, progressPhotos, achievements, searchHistory]
  );

  // Memoize actions
  const actions = useMemo<FitnessActions>(
    () => ({
      addWorkout,
      updateWorkout,
      deleteWorkout,
      duplicateWorkout,
      addMeal,
      updateMeal,
      deleteMeal,
      copyYesterdayMeals,
      addWaterEntry,
      deleteWaterEntry,
      undoLastWater,
      addWeightEntry,
      updateWeightEntry,
      deleteWeightEntry,
      upsertActivity,
      addGoal,
      updateGoal,
      deleteGoal,
      completeGoal,
      archiveGoal,
      updateProfile,
      updateSettings,
      resetAllData,
      addPersonalRecord,
      deletePersonalRecord,
      addWorkoutTemplate,
      deleteWorkoutTemplate,
      applyWorkoutTemplate,
      addMealTemplate,
      deleteMealTemplate,
      applyMealTemplate,
      addProgressPhoto,
      deleteProgressPhoto,
      addAchievement,
      addSearchHistoryEntry,
      clearSearchHistory,
    }),
    [
      addWorkout, updateWorkout, deleteWorkout, duplicateWorkout,
      addMeal, updateMeal, deleteMeal, copyYesterdayMeals,
      addWaterEntry, deleteWaterEntry, undoLastWater,
      addWeightEntry, updateWeightEntry, deleteWeightEntry,
      upsertActivity,
      addGoal, updateGoal, deleteGoal, completeGoal, archiveGoal,
      updateProfile, updateSettings, resetAllData,
      addPersonalRecord, deletePersonalRecord,
      addWorkoutTemplate, deleteWorkoutTemplate, applyWorkoutTemplate,
      addMealTemplate, deleteMealTemplate, applyMealTemplate,
      addProgressPhoto, deleteProgressPhoto,
      addAchievement, addSearchHistoryEntry, clearSearchHistory,
    ]
  );

  return (
    <FitnessDataContext.Provider value={data}>
      <FitnessActionsContext.Provider value={actions}>
        {children}
      </FitnessActionsContext.Provider>
    </FitnessDataContext.Provider>
  );
}

export { FitnessDataContext, FitnessActionsContext };
