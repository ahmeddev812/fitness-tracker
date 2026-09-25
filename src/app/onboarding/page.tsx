"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useFitnessActions } from "@/hooks/useFitnessData";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { generateDemoData } from "@/lib/seed";
import { PulseLogo } from "@/components/brand/pulse-logo";
import {
  User,
  Target,
  Settings,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Dumbbell,
  Apple,
  Droplets,
} from "lucide-react";
import type { ActivityLevel } from "@/types/fitness";
import * as storage from "@/lib/storage";

const STEPS = [
  { icon: User, label: "About You" },
  { icon: Target, label: "Your Goals" },
  { icon: Settings, label: "Preferences" },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary (desk job)" },
  { value: "light", label: "Light (1-2 days/week)" },
  { value: "moderate", label: "Moderate (3-4 days/week)" },
  { value: "active", label: "Active (5-6 days/week)" },
  { value: "very_active", label: "Very Active (2x/day)" },
];

const GOAL_TYPES = [
  { value: "weight_loss", label: "Lose Weight", emoji: "📉" },
  { value: "muscle_gain", label: "Gain Muscle", emoji: "💪" },
  { value: "general_fitness", label: "Stay Fit", emoji: "🏃" },
  { value: "strength", label: "Get Stronger", emoji: "🏋️" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const actions = useFitnessActions();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [demoChoice, setDemoChoice] = useState<"demo" | "fresh" | null>(null);

  // Step 1: About You (name, age, gender + body stats)
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Step 2: Goals + activity + target weight
  const [goalType, setGoalType] = useState("weight_loss");
  const [targetWeight, setTargetWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [targetDate, setTargetDate] = useState("");

  // Step 3: Preferences
  const [units, setUnits] = useState("metric");
  const [calorieTarget, setCalorieTarget] = useState("2200");
  const [proteinTarget, setProteinTarget] = useState("140");
  const [waterTarget, setWaterTarget] = useState("2500");

  const MAX_STEP = STEPS.length - 1;
  const next = () => setStep((s) => Math.min(s + 1, MAX_STEP));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleComplete = () => {
    // Save profile
    actions.updateProfile({
      name: name.trim() || user?.name || "User",
      age: age ? parseInt(age) : undefined,
      heightCm: height ? parseFloat(height) : undefined,
      currentWeightKg: weight ? parseFloat(weight) : undefined,
      activityLevel: activityLevel as ActivityLevel,
      calorieTarget: parseInt(calorieTarget) || 2200,
      proteinTarget: parseInt(proteinTarget) || 140,
      waterTargetMl: parseInt(waterTarget) || 2500,
      gender: gender as "male" | "female" | "other" | undefined,
    });

    // Save settings
    actions.updateSettings({
      units: units as "metric" | "imperial",
    });

    // Add first goal
    if (goalType) {
      actions.addGoal({
        type: goalType as "weight_loss" | "muscle_gain" | "general_fitness" | "strength",
        title: GOAL_TYPES.find((g) => g.value === goalType)?.label || "My Goal",
        startValue: weight ? parseFloat(weight) : undefined,
        targetValue: targetWeight ? parseFloat(targetWeight) : undefined,
        startDate: new Date().toISOString().split("T")[0],
        targetDate: targetDate || undefined,
        status: "active",
      });
    }

    // Generate demo data if chosen
    if (demoChoice === "demo") {
      const demoData = generateDemoData();
      storage.saveWorkouts(demoData.workouts);
      storage.saveMeals(demoData.meals);
      storage.saveWater(demoData.water);
      storage.saveWeights(demoData.weights);
      storage.saveGoals(demoData.goals);
      storage.saveActivity(demoData.activity);
      window.location.reload();
      return;
    }

    toast("Profile set up! Welcome to PULSE.", "success");
    router.push("/dashboard");
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  const progressPercent = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative">
        <m.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <PulseLogo size="md" />
        </m.div>

        {/* Demo data prompt (shown before steps if no choice yet) */}
        {demoChoice === null && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl border border-border p-8 text-center"
          >
            <div className="h-14 w-14 mx-auto mb-6 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome aboard!</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Want to explore with demo data or start fresh?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDemoChoice("demo")}
                className="group rounded-xl border border-border bg-card p-5 text-left hover-lift hover:border-primary/30 transition-all"
              >
                <div className="flex gap-2 mb-3">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <Apple className="h-5 w-5 text-success" />
                  <Droplets className="h-5 w-5 text-info" />
                </div>
                <p className="text-sm font-semibold mb-1">Load Demo Data</p>
                <p className="text-xs text-muted-foreground">
                  30 days of workouts, meals, and progress
                </p>
              </button>
              <button
                onClick={() => setDemoChoice("fresh")}
                className="rounded-xl border border-border bg-card p-5 text-left hover-lift hover:border-primary/30 transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <span className="text-lg">✨</span>
                </div>
                <p className="text-sm font-semibold mb-1">Start Fresh</p>
                <p className="text-xs text-muted-foreground">
                  Begin with an empty dashboard
                </p>
              </button>
            </div>
          </m.div>
        )}

        {/* Wizard */}
        {demoChoice !== null && (
          <div className="glass-strong rounded-2xl border border-border overflow-hidden">
            {/* Progress */}
            <div className="px-6 pt-6 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Step {step + 1} of {STEPS.length}
                </p>
                <p className="text-xs font-medium text-foreground">{STEPS[step].label}</p>
              </div>
              <div
                role="progressbar"
                aria-valuenow={Math.round(progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Onboarding progress"
                className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
              >
                <m.div
                  className="h-full rounded-full gradient-primary"
                  initial={false}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Step content */}
            <div className="px-6 pb-6 min-h-[320px]">
              <AnimatePresence mode="wait" custom={1}>
                {step === 0 && (
                  <m.div
                    key="step0"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Input
                      label="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="25"
                        min="10"
                        max="120"
                      />
                      <Select
                        label="Gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "other", label: "Other" },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Height (cm)"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="175"
                        min="100"
                        max="250"
                      />
                      <Input
                        label="Weight (kg)"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="75"
                        min="30"
                        max="300"
                        step="0.1"
                      />
                    </div>
                  </m.div>
                )}

                {step === 1 && (
                  <m.div
                    key="step1"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {GOAL_TYPES.map((g) => (
                        <button
                          key={g.value}
                          onClick={() => setGoalType(g.value)}
                          className={`rounded-xl border p-4 text-left transition-all ${
                            goalType === g.value
                              ? "border-primary bg-primary/10 shadow-glow"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <span className="text-2xl mb-2 block">{g.emoji}</span>
                          <p className="text-sm font-medium">{g.label}</p>
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Target Weight (kg)"
                        type="number"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(e.target.value)}
                        placeholder="70"
                        min="30"
                        max="300"
                        step="0.1"
                        hint="Optional"
                      />
                      <Select
                        label="Activity Level"
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        options={ACTIVITY_LEVELS}
                      />
                    </div>
                    <Input
                      label="Target Date"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      hint="Optional — when do you want to reach your goal?"
                    />
                  </m.div>
                )}

                {step === 2 && (
                  <m.div
                    key="step2"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Select
                      label="Unit System"
                      value={units}
                      onChange={(e) => setUnits(e.target.value)}
                      options={[
                        { value: "metric", label: "Metric (kg, cm, ml)" },
                        { value: "imperial", label: "Imperial (lb, in, oz)" },
                      ]}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Calories / day"
                        type="number"
                        value={calorieTarget}
                        onChange={(e) => setCalorieTarget(e.target.value)}
                        hint="Based on activity"
                      />
                      <Input
                        label="Protein / day (g)"
                        type="number"
                        value={proteinTarget}
                        onChange={(e) => setProteinTarget(e.target.value)}
                        hint="1.6-2.2g per kg"
                      />
                    </div>
                    <Input
                      label="Water / day (ml)"
                      type="number"
                      value={waterTarget}
                      onChange={(e) => setWaterTarget(e.target.value)}
                      hint="Recommended: 2000-3000ml"
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6 flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button variant="outline" size="lg" onClick={prev}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step < MAX_STEP ? (
                <Button variant="gradient" size="lg" onClick={next}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button variant="gradient" size="lg" onClick={handleComplete}>
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Let&apos;s Go!
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Skip */}
        {demoChoice !== null && (
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Skip setup →
          </button>
        )}
      </div>
    </div>
  );
}
