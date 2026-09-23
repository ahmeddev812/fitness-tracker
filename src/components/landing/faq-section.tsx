"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Is PULSE really free?",
    a: "Yes. The Free plan includes unlimited workout logging, the full exercise library, calorie and macro tracking, water intake, and local-first storage — forever, with no ads. Pro is optional and unlocks advanced analytics, templates, and reports.",
  },
  {
    q: "Where is my data stored?",
    a: "Everything stays on your device, in your browser's local storage. Nothing is sent to a server, and there is no account required to use the core app. You can export a backup anytime and re-import it later.",
  },
  {
    q: "Do I need an internet connection?",
    a: "No. Once the app is loaded, workouts, nutrition, and hydration all work fully offline. Your streak keeps counting even in airplane mode.",
  },
  {
    q: "Can I import data from another fitness app?",
    a: "Yes — export your history as CSV or JSON from most popular trackers and import it from Settings → Backup. Workouts, body weight, and nutrition entries map automatically.",
  },
  {
    q: "What does the Pro plan add?",
    a: "Advanced progress charts with deeper analytics, custom workout templates, automatic PR detection with rest timers, weekly PDF reports, and priority support. Your Free data carries over instantly.",
  },
  {
    q: "Is there a mobile app?",
    a: "PULSE is a progressive web app — install it from your browser's home screen on iOS or Android and it runs like a native app, complete with offline support and its own icon.",
  },
  {
    q: "How do streaks and goals work?",
    a: "You set daily targets for calories, protein, water, and workouts. Completing a day keeps your streak alive; miss a day and it resets. Rings fill in real time as you log.",
  },
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes. Cancel with one click from Settings → Billing. You keep Pro until the end of the billing period, then drop to Free with all your data intact.",
  },
] as const;

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Questions?{" "}
              <span className="gradient-text">Answered.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Everything you need to know before you start training with PULSE.
            </p>
            <a
              href="mailto:hello@pulse.app"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Still curious? Talk to us →
            </a>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  className={`glass rounded-2xl border transition-colors duration-300 ${
                    isOpen ? "border-primary/40" : "border-border/60"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span
                      className={`text-sm font-semibold transition-colors sm:text-base ${
                        isOpen ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {item.q}
                    </span>
                    <m.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        isOpen
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/60 text-muted-foreground"
                      }`}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </m.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                          {item.a}
                        </p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </m.div>
        </div>
      </div>
    </section>
  );
}
