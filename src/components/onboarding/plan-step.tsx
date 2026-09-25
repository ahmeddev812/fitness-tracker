"use client";

import { m } from "framer-motion";
import { Crown, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PlanId = "free" | "pro";

interface PlanStepProps {
  selected: PlanId;
  onSelect: (plan: PlanId) => void;
}

const PLANS: {
  id: PlanId;
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: string[];
  comingSoon?: boolean;
  featured?: boolean;
}[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Everything to get moving",
    price: "₹0",
    period: "forever",
    features: [
      "Unlimited workout logging",
      "Calorie & macro tracking",
      "Water intake logger",
      "Local-first storage",
      "Dark & light themes",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For athletes who track everything",
    price: "₹299",
    period: "/month",
    comingSoon: true,
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
];

export function PlanStep({ selected, onSelect }: PlanStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold text-foreground">Choose your plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Start free — upgrade when Pro launches.
        </p>
      </div>

      <div className="grid gap-4">
        {PLANS.map((plan, i) => (
          <m.button
            key={plan.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect(plan.id)}
            aria-pressed={selected === plan.id}
            className={`relative w-full rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selected === plan.id
                ? "border-primary bg-primary/8 shadow-glow"
                : "border-border bg-card/60 hover:border-primary/30"
            }`}
          >
            {plan.featured && (
              <Badge
                className="absolute -top-2.5 right-4 gap-1 gradient-primary text-white border-0"
                aria-label="Pro plan coming soon"
              >
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Coming Soon
              </Badge>
            )}

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    plan.featured
                      ? "gradient-primary text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {plan.featured ? (
                    <Crown className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Check className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-foreground">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-foreground">{plan.price}</span>
                <span className="text-xs text-muted-foreground"> {plan.period}</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 border-t border-border/50 pt-4">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 ${plan.featured ? "text-primary" : "text-success"}`}
                    aria-hidden="true"
                  />
                  {f}
                </li>
              ))}
            </ul>

            {selected === plan.id && (
              <div className="absolute top-4 right-4 hidden">
                <Badge variant="default">Selected</Badge>
              </div>
            )}
          </m.button>
        ))}
      </div>

      <div className="rounded-xl border border-border/50 bg-muted/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Pro is a marketing preview only — no payment is collected today.
        </p>
      </div>

      <Button type="button" variant="gradient" className="w-full" disabled>
        Continue with {selected === "pro" ? "Pro" : "Free"}
      </Button>
    </div>
  );
}
