"use client";

import { useEffect, useRef, useState } from "react";
import {
  m,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Flame, Rocket, Trophy, Zap } from "lucide-react";
import Image from "next/image";

const STAGES = [
  {
    day: "Day 1",
    title: "Start your journey",
    description:
      "Set up your profile, pick your targets, and log that very first workout.",
    stat: "0 workouts",
    icon: Rocket,
    image:
      "https://images.pexels.com/photos/29138809/pexels-photo-29138809/free-photo-of-fit-female-athlete-in-outdoor-workout-gear.jpeg?auto=compress&cs=tinysrgb&w=1260",
    alt: "Athlete in workout gear ready to start her fitness journey outdoors",
  },
  {
    day: "Day 30",
    title: "Feel the change",
    description:
      "One month in. Energy is up, rest days feel shorter, the habit is locked in.",
    stat: "20 workouts",
    icon: Zap,
    image:
      "https://images.pexels.com/photos/38167588/pexels-photo-38167588/free-photo-of-fit-young-man-doing-push-ups-in-gym.jpeg?auto=compress&cs=tinysrgb&w=1260",
    alt: "Man doing push-ups in a modern gym",
  },
  {
    day: "Day 90",
    title: "See the results",
    description:
      "Quarter of a year of consistency. The numbers — and the mirror — prove it.",
    stat: "100 workouts",
    icon: Flame,
    image:
      "https://images.pexels.com/photos/10476181/pexels-photo-10476181.jpeg?auto=compress&cs=tinysrgb&w=1260",
    alt: "Man training intensely with battle ropes in a gym",
  },
  {
    day: "Day 365",
    title: "Become unstoppable",
    description:
      "A full year streak. This isn't motivation anymore — it's who you are.",
    stat: "1 year streak",
    icon: Trophy,
    image:
      "https://images.pexels.com/photos/29526363/pexels-photo-29526363/free-photo-of-muscular-man-posing-in-modern-gym-setting.jpeg?auto=compress&cs=tinysrgb&w=1260",
    alt: "Confident athlete posing in a modern gym",
  },
] as const;

export function TimelineSection() {
  const ref = useRef<HTMLElement>(null);
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  useEffect(() => {
    const widthQuery = window.matchMedia("(min-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setParallaxEnabled(widthQuery.matches && !motionQuery.matches);
    };
    update();
    widthQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      widthQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0a0a12] py-24 text-white"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-accent/20"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-1 gradient-primary" aria-hidden="true">
        <m.div
          className="h-full origin-left gradient-primary"
          style={{ scaleX }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            The transformation
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            From day one to{" "}
            <span className="gradient-text">day 365</span>
          </h2>
          <p className="mt-4 text-white/70 text-lg">
            Consistency compounds. Here&apos;s what showing up looks like.
          </p>
        </m.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const fromLeft = i % 2 === 0;
            return (
              <m.article
                key={stage.day}
                initial={{ opacity: 0, x: fromLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
              >
                <div className="relative h-44 overflow-hidden">
                  <m.div
                    className="absolute inset-0"
                    style={parallaxEnabled ? { y: parallaxY } : undefined}
                  >
                    <Image
                      src={stage.image}
                      alt={stage.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </m.div>
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/40 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="gradient-text text-4xl font-black tracking-tight">
                      {stage.day}
                    </span>
                  </div>
                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md">
                    <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-white">
                    {stage.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                    {stage.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-[10px] uppercase tracking-widest text-white/40">
                      Milestone
                    </span>
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-accent">
                      {stage.stat}
                    </span>
                  </div>
                </div>
              </m.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
