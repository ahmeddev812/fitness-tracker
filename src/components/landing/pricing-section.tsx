"use client";

import Link from "next/link";
import { useState } from "react";
import { m } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfettiBurst } from "@/hooks/useConfetti";

type Interval = "monthly" | "yearly";

const PLANS = [
  {
    name: "Free",
    tagline: "Everything to get moving",
    monthly: 0,
    yearly: 0,
    period: "forever",
    cta: "Start free",
    featured: false,
    features: [
      "Unlimited workout logging",
      "30+ exercise library",
      "Calorie & macro tracking",
      "Water intake logger",
      "Local-first storage",
      "Dark & light themes",
    ],
  },
  {
    name: "Pro",
    tagline: "For athletes who track everything",
    monthly: 299,
    yearly: 1999,
    period: "month",
    cta: "Go Pro",
    featured: true,
    features: [
      "Everything in Free",
      "Advanced progress charts",
      "Custom workout templates",
      "Rest timer & PR detection",
      "Weekly PDF reports",
      "Priority support",
    ],
  },
  {
    name: "Lifetime",
    tagline: "Pay once, train forever",
    monthly: null,
    yearly: 4999,
    period: "one-time",
    cta: "Buy lifetime",
    featured: false,
    features: [
      "Everything in Pro",
      "One-time payment",
      "All future Pro features",
      "Early access beta builds",
      "Founding member badge",
      "Transferable license",
    ],
  },
] as const;

const formatPrice = (n: number) => (n === 0 ? "₹0" : `₹${n.toLocaleString("en-IN")}`);

export function PricingSection() {
  const [interval, setInterval] = useState<Interval>("monthly");
  const { fireConfetti, confetti } = useConfettiBurst();

  return (
    <section id="pricing" className="py-24 relative">
      {confetti}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Simple plans, <span className="gradient-text">serious gains</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>

          <div className="mt-8 inline-flex items-center rounded-full border border-border/60 bg-muted/50 p-1">
            {(["monthly", "yearly"] as const).map((iv) => (
              <button
                key={iv}
                type="button"
                onClick={() => setInterval(iv)}
                className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  interval === iv ? "text-white" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={interval === iv}
              >
                {interval === iv && (
                  <m.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-full gradient-primary shadow-glow"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {iv === "monthly" ? "Monthly" : "Yearly"}
                  {iv === "yearly" && (
                    <span className={`ml-2 text-[10px] font-bold ${interval === "yearly" ? "text-white" : "text-primary"}`}>
                      −44%
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </m.div>

        <div className="grid gap-6 md:grid-cols-3 items-start">
          {PLANS.map((plan, i) => {
            const price =
              plan.monthly === null
                ? plan.yearly
                : interval === "yearly"
                  ? plan.yearly
                  : plan.monthly;
            const priceLabel =
              plan.monthly === null
                ? formatPrice(price)
                : plan.monthly === 0
                  ? "₹0"
                  : formatPrice(price);
            const periodLabel =
              plan.monthly === null
                ? "one-time"
                : plan.monthly === 0
                  ? "forever"
                  : interval === "yearly"
                    ? "/year"
                    : "/month";

            return (
              <m.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {plan.featured && (
                  <div
                    className="absolute -inset-px rounded-2xl p-px bg-[conic-gradient(from_var(--angle,0deg),var(--color-primary),var(--color-accent),var(--color-primary))]"
                    aria-hidden="true"
                  >
                    <div className="h-full w-full rounded-2xl bg-card" />
                  </div>
                )}
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                    plan.featured
                      ? "border-transparent bg-card shadow-premium md:scale-105"
                      : "border-border/60 bg-card/60 backdrop-blur-sm"
                  }`}
                >
                  {plan.featured && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1 gradient-primary text-white border-0 shadow-glow">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Most popular
                    </Badge>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                  </div>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight text-foreground">
                      {priceLabel}
                    </span>
                    <span className="text-sm text-muted-foreground">{periodLabel}</span>
                  </div>

                  <Link href="/signup" prefetch={false} onClick={() => fireConfetti()}>
                    <Button
                      className={`mt-6 w-full ${
                        plan.featured ? "gradient-primary text-white shadow-glow" : "border-border/60"
                      }`}
                      variant={plan.featured ? "gradient" : "outline"}
                      data-magnetic="true"
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <ul className="mt-7 space-y-3 border-t border-border/60 pt-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? "text-primary" : "text-success"}`}
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </m.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          All plans include local-first storage. GST included where applicable.
        </p>
      </div>
    </section>
  );
}
