"use client";

import { memo } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import { getWeightChange } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { m } from "framer-motion";

function WeightCardImpl() {
  const { weights, isHydrated } = useFitnessData();

  if (!isHydrated) {
    return <Card className="p-5"><div className="space-y-3"><div className="h-4 w-24 bg-muted rounded animate-pulse" /><div className="h-8 w-20 bg-muted rounded animate-pulse" /></div></Card>;
  }

  const { latest, previous, delta } = getWeightChange(weights);

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
    >
      <Card hover className="p-5">
        <CardContent>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Weight</p>
            <Link href="/progress" className="text-primary hover:text-primary/80 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {latest != null ? (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums">{latest.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">kg</span>
            </div>
          ) : (
            <p className="text-2xl font-bold text-muted-foreground">—</p>
          )}
          {delta != null && latest != null && previous != null && (
            <div className="flex items-center gap-1.5 mt-2">
              {delta > 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-destructive" aria-label="Weight increased" />
              ) : delta < 0 ? (
                <TrendingDown className="h-3.5 w-3.5 text-success" aria-label="Weight decreased" />
              ) : (
                <Minus className="h-3.5 w-3.5 text-muted-foreground" aria-label="Weight unchanged" />
              )}
              <span className={`text-xs font-medium ${delta > 0 ? "text-destructive" : delta < 0 ? "text-success" : "text-muted-foreground"}`}>
                {delta > 0 ? "+" : ""}{delta.toFixed(1)} kg
              </span>
            </div>
          )}
          {weights.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">No weight entries yet</p>
          )}
        </CardContent>
      </Card>
    </m.div>
  );
}

export const WeightCard = memo(WeightCardImpl);
WeightCard.displayName = "WeightCard";
