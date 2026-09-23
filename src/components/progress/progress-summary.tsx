"use client";

import { useFitnessData } from "@/hooks/useFitnessData";
import { getWeightChange } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus, Scale } from "lucide-react";
import { m } from "framer-motion";

export function ProgressSummary() {
  const { weights } = useFitnessData();

  const { latest, delta } = getWeightChange(weights);
  const totalEntries = weights.length;

  const trendIcon =
    delta === null ? (
      <Minus className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
    ) : delta > 0 ? (
      <TrendingUp className="h-5 w-5 text-destructive" aria-hidden="true" />
    ) : delta < 0 ? (
      <TrendingDown className="h-5 w-5 text-success" aria-hidden="true" />
    ) : (
      <Minus className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
    );

  const trendLabel =
    delta === null
      ? "No change data"
      : delta > 0
      ? `+${delta.toFixed(1)} kg from previous`
      : delta < 0
      ? `${delta.toFixed(1)} kg from previous`
      : "No change";

  const cards = [
    {
      label: "Current",
      content: (
        <div className="flex items-center gap-1.5">
          <div className="gradient-primary rounded-lg p-1.5">
            <Scale className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-lg font-bold tabular-nums">
            {latest != null ? `${latest}` : "—"}
          </span>
          {latest != null && <span className="text-xs text-muted-foreground">kg</span>}
        </div>
      ),
    },
    {
      label: "Trend",
      content: (
        <div className="flex items-center gap-1.5">
          {trendIcon}
          <span className="text-xs text-muted-foreground leading-tight">{trendLabel}</span>
        </div>
      ),
    },
    {
      label: "Entries",
      content: <span className="text-lg font-bold tabular-nums">{totalEntries}</span>,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {cards.map((c, i) => (
        <m.div
          key={c.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Card hover className="p-4">
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">{c.label}</p>
              {c.content}
            </CardContent>
          </Card>
        </m.div>
      ))}
    </div>
  );
}
