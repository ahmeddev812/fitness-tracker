"use client";

import { useRef } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import {
  Flame,
  Dumbbell,
  Trophy,
  Timer,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import { useConfettiBurst } from "@/hooks/useConfetti";
import { useMagnetic } from "@/hooks/useMagnetic";

const FLOATING_ICONS = [
  { Icon: Flame, className: "left-[12%] top-[22%]", delay: 0 },
  { Icon: Dumbbell, className: "right-[14%] top-[18%]", delay: 0.6 },
  { Icon: Trophy, className: "left-[22%] bottom-[24%]", delay: 1.2 },
  { Icon: Timer, className: "right-[20%] bottom-[28%]", delay: 1.8 },
  { Icon: HeartPulse, className: "left-[48%] top-[12%]", delay: 2.4 },
] as const;

export function CtaSection() {
  const { fireConfetti, confetti } = useConfettiBurst();
  const sectionRef = useRef<HTMLElement>(null);

  useMagnetic(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-28 min-h-screen flex items-center"
    >
      {confetti}
      <div className="absolute inset-0 gradient-primary opacity-90" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a12]/60"
        aria-hidden="true"
      />
      <div className="dot-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
        {FLOATING_ICONS.map(({ Icon, className, delay }) => (
          <m.span
            key={delay}
            className={`absolute hidden sm:inline-flex ${className} text-white/30`}
            animate={{ y: [-12, 12, -12], rotate: [-8, 8, -8] }}
            transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <Icon className="h-7 w-7" />
          </m.span>
        ))}

        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <HeartPulse className="h-3.5 w-3.5" aria-hidden="true" />
            Every beat counts
          </span>

          <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-balance">
            Your strongest year
            <br />
            starts <span className="text-white/70">today.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base text-white/75 sm:text-lg">
            Join 10,000+ people training smarter with PULSE. Free forever —
            your data never leaves your device.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-bold text-primary shadow-premium transition-colors hover:bg-white/90"
              data-magnetic="true"
              onClick={() => fireConfetti()}
            >
              Start tracking free
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <a
              href="#pricing"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
              data-magnetic="true"
            >
              See pricing
            </a>
          </div>

          <p className="mt-6 text-xs text-white/60">
            No credit card · No account required · Works offline
          </p>
        </m.div>
      </div>
    </section>
  );
}
