"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  m,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Dumbbell, Flame, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { PulseIcon } from "@/components/brand/pulse-icon";
import { AnimatedNumber } from "./animated-number";
import { useMagnetic } from "@/hooks/useMagnetic";

const VIDEO_720 = "https://assets.mixkit.co/videos/52112/52112-720.mp4";
const VIDEO_360 = "https://assets.mixkit.co/videos/52112/52112-360.mp4";

const VIDEO_POSTER =
  "https://assets.mixkit.co/videos/52112/52112-thumb-720-0.jpg";

const HERO_STATS = [
  { value: 10, suffix: "K+", label: "Workouts" },
  { value: 50, suffix: "K+", label: "Meals" },
  { value: 1, suffix: "M+", label: "Glasses" },
  { value: 4.9, suffix: "★", label: "Rating", decimals: 1 },
] as const;

type NetworkInfo = {
  effectiveType?: string;
  saveData?: boolean;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function shouldSkipHeroVideo() {
  if (prefersReducedMotion()) return true;
  const connection = (
    navigator as Navigator & { connection?: NetworkInfo }
  ).connection;
  if (connection?.saveData) return true;
  const effectiveType = connection?.effectiveType;
  return effectiveType === "slow-2g" || effectiveType === "2g";
}

function pickHeroVideoSrc() {
  const connection = (
    navigator as Navigator & { connection?: NetworkInfo }
  ).connection;
  const effectiveType = connection?.effectiveType;
  if (
    connection?.saveData ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    effectiveType === "3g"
  ) {
    return VIDEO_360;
  }
  return VIDEO_720;
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [bpm, setBpm] = useState(78);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useMagnetic(heroRef);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  useEffect(() => {
    if (shouldSkipHeroVideo()) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const load = () => {
      if (cancelled) return;
      setVideoSrc(pickHeroVideoSrc());
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(load, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(load, 2000);
    }

    return () => {
      cancelled = true;
      if (
        idleId !== undefined &&
        typeof idleWindow.cancelIdleCallback === "function"
      ) {
        idleWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        void video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              if (document.hidden) return;
              if (entry.isIntersecting) {
                void video.play().catch(() => {});
              } else {
                video.pause();
              }
            },
            { threshold: 0.1 },
          )
        : null;

    if (observer) observer.observe(video);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      if (motionQuery.matches) video.pause();
      else if (!document.hidden) void video.play().catch(() => {});
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      observer?.disconnect();
    };
  }, [videoSrc]);

  useEffect(() => {
    const id = setInterval(() => {
      setBpm((b) => (b >= 82 ? 78 : b + 1));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!demoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDemoOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [demoOpen]);

  const headlineWords = ["Every", "beat", "counts."];

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#0a0a12]"
      aria-label="PULSE hero"
    >
      <m.div
        style={{ y: videoY }}
        className="absolute inset-0 -top-[10%] h-[120%]"
        aria-hidden="true"
      >
        {videoSrc ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={VIDEO_POSTER}
            className="h-full w-full object-cover"
            src={videoSrc}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={VIDEO_POSTER}
            alt=""
            className="h-full w-full object-cover"
            decoding="async"
            fetchPriority="high"
          />
        )}
      </m.div>

      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-black/60"
        aria-hidden="true"
      />
      <div className="absolute inset-0 grain overflow-hidden" aria-hidden="true" />

      <m.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-32 text-center"
      >
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-md"
        >
          <Flame className="h-4 w-4 text-warning" aria-hidden="true" />
          Trusted by 10,000+ athletes
        </m.div>

        <h1 className="mt-6 text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white">
          {headlineWords.map((word, i) => (
            <m.span
              key={word}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.08 }}
              className={
                word === "beat"
                  ? "gradient-text inline-block mr-3"
                  : "inline-block mr-3"
              }
            >
              {word}
            </m.span>
          ))}
        </h1>

        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-white/80"
        >
          Track workouts, fuel your body, and watch yourself transform — in one
          beautiful app.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button
              variant="gradient"
              size="lg"
              className="glow-primary group w-full sm:w-auto"
              data-magnetic="true"
            >
              Start Free
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-8 py-3 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            data-magnetic="true"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Watch Demo
          </button>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md"
        >
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-4 py-5"
            >
              <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={"decimals" in stat ? stat.decimals : 0}
                />
              </span>
              <span className="text-xs uppercase tracking-widest text-white/60">
                {stat.label}
              </span>
            </div>
          ))}
        </m.div>
      </m.div>

      <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
        <m.div
          className="absolute left-6 top-24 hidden lg:block"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <PulseIcon className="h-16 w-24" strokeWidth={1.5} />
        </m.div>

        <div className="absolute right-6 top-24 hidden lg:flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-sm font-bold text-white tabular-nums">
            {bpm} BPM
          </span>
        </div>

        <div className="absolute bottom-28 left-6 hidden lg:flex flex-col items-center gap-2">
          <CircularProgress value={90} size={72} strokeWidth={5} />
          <span className="text-[10px] uppercase tracking-widest text-white/60">
            Day 1 → Day 90
          </span>
        </div>

        <m.div
          className="absolute bottom-28 right-6 hidden lg:flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md"
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Dumbbell className="h-5 w-5 text-white" />
        </m.div>
      </div>

      <m.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/50 p-1.5">
          <m.span
            className="h-1.5 w-1 rounded-full bg-white/80"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-white/50">
          Scroll to explore
        </span>
      </m.div>

      <AnimatePresence>
        {demoOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setDemoOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="PULSE demo video"
          >
            <m.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-black shadow-premium"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <span className="text-sm font-semibold text-white">
                  PULSE — See it in action
                </span>
                <button
                  type="button"
                  onClick={() => setDemoOpen(false)}
                  className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close demo"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <video
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={VIDEO_POSTER}
                className="aspect-video w-full bg-black"
                src={VIDEO_720}
              />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
