"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    city: "Bengaluru",
    quote:
      "PULSE completely transformed how I track my workouts. The live dashboard is beautiful, the analytics are incredibly insightful, and everything stays on my device. I finally stopped juggling three different apps.",
    result: "Lost 12kg in 90 days",
    gradient: "from-primary to-accent",
  },
  {
    name: "Michael Rodriguez",
    role: "Product Manager",
    city: "Mumbai",
    quote:
      "I love that my data stays local. No subscriptions for basic tracking, no privacy guilt. The charts and streaks keep me honest every single day — and the water reminders are weirdly effective.",
    result: "180-day streak",
    gradient: "from-accent to-success",
  },
  {
    name: "Emily Watson",
    role: "Student & Athlete",
    city: "Delhi",
    quote:
      "Found the perfect fitness app. Macro tracking takes seconds, the workout templates save me so much time, and it's completely free. My whole running group switched to PULSE.",
    result: "Half marathon PR",
    gradient: "from-info to-primary",
  },
  {
    name: "Arjun Patel",
    role: "CrossFit Coach",
    city: "Pune",
    quote:
      "I recommend PULSE to every client. The set logging is faster than my old notebook, PRs are auto-detected, and the progress charts make check-ins with athletes genuinely fun.",
    result: "Gained 6kg lean mass",
    gradient: "from-warning to-destructive",
  },
  {
    name: "Priya Sharma",
    role: "Doctor",
    city: "Hyderabad",
    quote:
      "As a doctor I care about data ownership — PULSE keeps everything in my browser. The nutrition logging is fast and the weekly reports are exactly what I show my patients.",
    result: "Down 9kg in 4 months",
    gradient: "from-success to-info",
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    city: "Seoul",
    quote:
      "Ten minutes a day is all it takes. PULSE makes tracking feel like a game instead of a chore — the streaks, the rings, the little wins. I've never stuck with a tracker this long.",
    result: "1-year consistency streak",
    gradient: "from-primary to-success",
  },
] as const;

const AUTOPLAY_MS = 4000;

function avatarUrl(name: string): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6c5ce7,a29bfe&fontSize=40`;
}

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView || document.hidden) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setDirection(1);
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, inView]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const testimonial = TESTIMONIALS[index];

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Social proof
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Loved by <span className="gradient-text">10,000+</span> athletes
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Real people. Real streaks. Real results.
          </p>
        </m.div>

        <div
          className="relative mx-auto max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
        >
          <div className="relative min-h-[340px] sm:min-h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              <m.figure
                key={testimonial.name}
                custom={direction}
                initial={{ opacity: 0, x: direction * 64 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -64 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="glass rounded-3xl border border-border/60 p-8 sm:p-10 shadow-premium"
              >
                <div className="flex gap-0.5 mb-5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-5 w-5 fill-warning text-warning"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="text-base sm:text-lg leading-relaxed text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
                  <figcaption className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center bg-cover bg-center`}
                      style={{ backgroundImage: `url(${avatarUrl(testimonial.name)})` }}
                      role="img"
                      aria-label={`${testimonial.name} avatar`}
                    />
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} · {testimonial.city}
                      </p>
                    </div>
                  </figcaption>
                  <span className="rounded-full gradient-primary px-4 py-1.5 text-xs font-bold text-white shadow-glow">
                    Result: {testimonial.result}
                  </span>
                </div>
              </m.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="glass h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Testimonial slides">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => go(i, i > index ? 1 : -1)}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial from ${t.name}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 gradient-primary" : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="glass h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
