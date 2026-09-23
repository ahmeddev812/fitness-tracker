"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useInView,
} from "framer-motion";
import {
  ChevronRight,
  Flame,
  Pause,
  Play,
  SkipForward,
  Timer,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { PulseLoader } from "@/components/brand/pulse-loader";

const EXERCISES = [
  "Bench Press",
  "Squats",
  "Deadlift",
  "Pull-ups",
  "Plank",
] as const;

const HR_SAMPLES = 48;
const TICK_MS = 500;

function formatTime(total: number): string {
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function buildHrPath(values: number[]): string {
  const w = 320;
  const h = 110;
  const step = w / (HR_SAMPLES - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - 60) / 90) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${Math.min(h, Math.max(0, y)).toFixed(1)}`;
    })
    .join(" ");
}

function DashboardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative [perspective:1000px]"
    >
      <m.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "rotateY(-5deg)" }}
      >
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium">
          <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <div className="ml-3 flex-1 truncate rounded-md bg-background/80 px-3 py-1 text-center text-xs text-muted-foreground">
              pulse.app/dashboard
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Workouts"
                value="24"
                icon={<Flame className="h-4 w-4" />}
                trend="up"
                trendValue="+12%"
              />
              <StatCard
                label="Calories"
                value="18,420"
                icon={<Zap className="h-4 w-4" />}
                trend="up"
                trendValue="+8%"
              />
            </div>

            <Card variant="glass">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Weekly goal
                  </span>
                  <span className="text-xs text-muted-foreground">78%</span>
                </div>
                <ProgressBar value={78} variant="gradient" />

                <div className="mt-5 grid grid-cols-7 gap-1.5" aria-hidden="true">
                  {[40, 65, 55, 90, 70, 85, 50].map((h, i) => (
                    <div
                      key={i}
                      className="h-14 rounded-md bg-gradient-to-t from-primary/70 to-accent/70"
                      style={{ opacity: 0.35 + (h / 100) * 0.65 }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Protein", value: "142g" },
                { label: "Water", value: "2.4L" },
                { label: "Streak", value: "18d" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/60 bg-background/60 p-3 text-center"
                >
                  <p className="text-sm font-bold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </m.div>
    </m.div>
  );
}

export function WorkoutSimulatorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [reps, setReps] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hrValues, setHrValues] = useState<number[]>(() =>
    Array.from({ length: HR_SAMPLES }, (_, i) =>
      Math.round(80 + Math.sin(i / 3) * 15)
    )
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !isActive) return;
    let tick = 0;
    const timer = setInterval(() => {
      if (document.hidden) return;
      tick += 1;
      if (tick % 2 === 0) {
        setSeconds((s) => Math.min(s + 1, 2700));
        setHrValues((values) => {
          const last = values[values.length - 1] ?? 90;
          const delta = Math.round((Math.random() - 0.45) * 30);
          const next = Math.min(140, Math.max(70, last + delta));
          return [...values.slice(1), next];
        });
      }
      setReps((r) => (r >= 12 ? 0 : r + 1));
      if (tick % 60 === 0) {
        setExerciseIndex((i) => (i + 1) % EXERCISES.length);
      }
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [paused, isActive]);

  const skip = () => {
    setExerciseIndex((i) => (i + 1) % EXERCISES.length);
    setReps(0);
  };

  const pathD = useMemo(() => buildHrPath(hrValues), [hrValues]);
  const currentHr = hrValues[hrValues.length - 1] ?? 80;

  return (
    <section id="demo" ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-2xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Live preview
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Feel the app <span className="gradient-text">before you sign up</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A real-time workout simulator — timer, reps, and heart rate,
            all running live on this page.
          </p>
        </m.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
          <DashboardMockup />

          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Card variant="glass" className="relative overflow-hidden">
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Current exercise
                    </p>
                    <div className="mt-1 h-9 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <m.h3
                          key={EXERCISES[exerciseIndex]}
                          initial={{ y: 24, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -24, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-2xl font-black tracking-tight text-foreground"
                        >
                          {EXERCISES[exerciseIndex]}
                        </m.h3>
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Timer
                    </p>
                    <p className="text-2xl font-black tabular-nums text-foreground">
                      {formatTime(seconds)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Reps
                  </span>
                  <div className="flex flex-1 gap-1.5" aria-hidden="true">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <m.span
                        key={i}
                        className="h-2 flex-1 rounded-full bg-primary/20"
                        animate={
                          i < reps
                            ? { backgroundColor: "var(--color-primary)", scaleY: 1 }
                            : { backgroundColor: "rgba(108,92,231,0.2)", scaleY: 0.7 }
                        }
                        transition={{ duration: 0.2 }}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-black tabular-nums text-primary">
                    <AnimatePresence mode="popLayout">
                      <m.span
                        key={reps}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="inline-block"
                      >
                        {reps}
                      </m.span>
                    </AnimatePresence>
                    <span className="text-sm text-muted-foreground">/12</span>
                  </span>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      <Flame className="h-3.5 w-3.5 text-destructive" />
                      Heart rate
                    </span>
                    <span className="text-sm font-bold tabular-nums text-destructive">
                      {currentHr} BPM
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-border/60 bg-background/60 p-2">
                    <svg
                      viewBox="0 0 320 110"
                      className="h-28 w-full"
                      preserveAspectRatio="none"
                      role="img"
                      aria-label={`Live heart rate graph, currently ${currentHr} BPM`}
                    >
                      <defs>
                        <linearGradient id="hrStroke" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stopColor="var(--color-primary)" />
                          <stop offset="1" stopColor="var(--color-accent)" />
                        </linearGradient>
                        <linearGradient id="hrFill" x1="0" y1="0" x2="0" y2="110" gradientUnits="userSpaceOnUse">
                          <stop stopColor="var(--color-primary)" stopOpacity="0.25" />
                          <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={`${pathD} L320,110 L0,110 Z`} fill="url(#hrFill)" />
                      <path
                        d={pathD}
                        fill="none"
                        stroke="url(#hrStroke)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPaused((p) => !p)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10"
                    aria-pressed={paused}
                  >
                    {paused ? (
                      <>
                        <Play className="h-4 w-4 text-primary" aria-hidden="true" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 text-primary" aria-hidden="true" />
                        Pause
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={skip}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
                  >
                    <SkipForward className="h-4 w-4" aria-hidden="true" />
                    Skip
                    <ChevronRight className="h-4 w-4 -ml-1" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                    Set target 45:00
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        paused ? "bg-warning" : "bg-success animate-pulse"
                      }`}
                      aria-hidden="true"
                    />
                    {paused ? "Paused" : "Live"}
                  </span>
                </div>

                {paused && (
                  <PulseLoader className="justify-center" size="sm" label="Paused" />
                )}
              </CardContent>
            </Card>
          </m.div>
        </div>
      </div>
    </section>
  );
}
