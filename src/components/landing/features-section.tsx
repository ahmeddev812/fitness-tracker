"use client";

import { m } from "framer-motion";
import {
  Apple,
  BarChart3,
  Droplets,
  Dumbbell,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";

function BentoIcon({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow ${className}`}
    >
      <div
        className="absolute inset-0 rounded-xl bg-primary/40 blur-xl"
        aria-hidden="true"
      />
      <span className="relative text-white">{children}</span>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const baseCardClass =
  "group relative glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-glow";

const BARS = Array.from({ length: 16 }, (_, i) => {
  const peak = 14 + ((i * 7) % 22);
  return { peak, scale: 8 / peak };
});

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Everything you need
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            One app. <span className="gradient-text">Every rep.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Workouts, nutrition, hydration, and progress — designed to feel
            alive.
          </p>
        </m.div>

        <div className="grid grid-cols-12 gap-4">
          <m.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className={`col-span-12 md:col-span-6 md:row-span-2 flex flex-col ${baseCardClass}`}
          >
            <BentoIcon>
              <Dumbbell className="h-6 w-6" strokeWidth={2.2} />
            </BentoIcon>
            <h3 className="mt-5 text-xl font-bold text-foreground">
              Workout Tracking
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Log sets, reps, and weights across 30+ exercises. Templates,
              rest timers, and PRs — tracked set by set.
            </p>

            <div className="mt-auto pt-8">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Set 3 · Bench Press</span>
                  <span className="text-primary font-semibold">Live</span>
                </div>
                <m.div
                  className="mt-3 flex items-end gap-1.5"
                  aria-hidden="true"
                >
                  {BARS.map(({ peak, scale }, i) => (
                    <m.span
                      key={i}
                      className="w-2 origin-bottom rounded-full bg-gradient-to-t from-primary to-accent"
                      style={{ height: peak }}
                      animate={{ scaleY: [scale, 1, scale] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        delay: i * 0.08,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </m.div>
                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-muted-foreground">Reps</span>
                  <span className="font-bold text-foreground tabular-nums">
                    12 / 12 ✓
                  </span>
                </div>
              </div>
            </div>
          </m.div>

          <m.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className={`col-span-6 md:col-span-3 ${baseCardClass}`}
          >
            <BentoIcon>
              <Apple className="h-6 w-6" strokeWidth={2.2} />
            </BentoIcon>
            <h3 className="mt-4 text-base font-bold text-foreground">
              Nutrition Logging
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Calories, protein, carbs, fat — in seconds.
            </p>
            <m.span
              className="absolute right-4 top-4 text-2xl"
              animate={{ y: [-4, 4, -4], rotate: [-6, 6, -6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              🍎
            </m.span>
          </m.div>

          <m.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className={`col-span-6 md:col-span-3 ${baseCardClass}`}
          >
            <BentoIcon>
              <Droplets className="h-6 w-6" strokeWidth={2.2} />
            </BentoIcon>
            <h3 className="mt-4 text-base font-bold text-foreground">
              Water Tracking
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Quick-add 250ml, 500ml, or 1L against your goal.
            </p>
            <div
              className="absolute bottom-4 right-4 h-12 w-8 overflow-hidden rounded-lg border border-primary/30 bg-primary/10"
              aria-hidden="true"
            >
              <m.div
                className="absolute inset-0 origin-bottom bg-gradient-to-t from-primary to-accent"
                animate={{ scaleY: [0.25, 0.85, 0.25] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </m.div>

          <m.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className={`col-span-6 md:col-span-3 ${baseCardClass}`}
          >
            <BentoIcon>
              <TrendingUp className="h-6 w-6" strokeWidth={2.2} />
            </BentoIcon>
            <h3 className="mt-4 text-base font-bold text-foreground">
              Progress Charts
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Weight, volume, and streaks over time.
            </p>
            <svg
              viewBox="0 0 100 36"
              className="absolute bottom-4 right-4 h-9 w-24"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="bentoSpark" x1="0" y1="0" x2="100" y2="0">
                  <stop stopColor="var(--color-primary)" />
                  <stop offset="1" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>
              <m.path
                d="M0 30 L15 24 L30 27 L45 16 L60 20 L75 9 L100 4"
                stroke="url(#bentoSpark)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeInOut", delay: 0.4 }}
              />
            </svg>
          </m.div>

          <m.div
            custom={4}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className={`col-span-6 md:col-span-3 ${baseCardClass}`}
          >
            <BentoIcon>
              <Target className="h-6 w-6" strokeWidth={2.2} />
            </BentoIcon>
            <h3 className="mt-4 text-base font-bold text-foreground">
              Goal Setting
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Daily calorie, protein, and water targets.
            </p>
            <div className="absolute bottom-3 right-3" aria-hidden="true">
              <CircularProgress value={72} size={52} strokeWidth={4} />
            </div>
          </m.div>

          <m.div
            custom={5}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className={`col-span-12 ${baseCardClass} flex flex-wrap items-center gap-5`}
          >
            <div className="flex gap-3">
              <BentoIcon>
                <BarChart3 className="h-6 w-6" strokeWidth={2.2} />
              </BentoIcon>
              <BentoIcon className="bg-accent">
                <Search className="h-6 w-6" strokeWidth={2.2} />
              </BentoIcon>
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Deep insights + instant search
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Analytics across every metric, and ⌘K search that finds any
                workout, meal, or entry instantly.
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 text-xs text-muted-foreground">
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Search workouts, meals…</span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-sans">
                ⌘K
              </kbd>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
