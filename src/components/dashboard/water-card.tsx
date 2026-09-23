"use client";

import { memo, useState } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { getWaterTotalForDate } from "@/lib/calculations";
import { todayKey } from "@/lib/dates";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Droplets } from "lucide-react";
import { m } from "framer-motion";

function WaterCardImpl() {
  const { water, profile, isHydrated } = useFitnessData();
  const { addWaterEntry } = useFitnessActions();
  const { toast } = useToast();
  const [customAmount, setCustomAmount] = useState("");

  if (!isHydrated) {
    return <Card className="p-5"><div className="flex items-center gap-4"><div className="h-20 w-20 bg-muted rounded-full animate-pulse" /><div className="flex-1 space-y-3"><div className="h-4 w-20 bg-muted rounded animate-pulse" /><div className="h-2.5 w-full bg-muted rounded-full animate-pulse" /></div></div></Card>;
  }

  const today = todayKey();
  const consumed = getWaterTotalForDate(water, today);
  const target = profile.waterTargetMl;

  const quickAdd = (amount: number) => {
    addWaterEntry({ date: today, amountMl: amount });
    toast(`+${amount} ml water logged`, "success");
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast("Please enter a valid amount", "error");
      return;
    }
    if (amount > 5000) {
      toast("Maximum 5000 ml per entry", "error");
      return;
    }
    addWaterEntry({ date: today, amountMl: amount });
    toast(`+${amount} ml water logged`, "success");
    setCustomAmount("");
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
    >
      <Card hover className="p-5">
        <CardContent>
          <div className="flex items-center gap-4 mb-3">
            <CircularProgress
              value={consumed}
              max={target}
              size={64}
              strokeWidth={5}
              label="Water intake"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Water</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tabular-nums">{consumed}</span>
                <span className="text-sm text-muted-foreground">/ {target} ml</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => quickAdd(250)} className="flex-1 rounded-xl">
              <Droplets className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              +250
            </Button>
            <Button size="sm" variant="secondary" onClick={() => quickAdd(500)} className="flex-1 rounded-xl">
              <Droplets className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              +500
            </Button>
            <Button size="sm" variant="secondary" onClick={() => quickAdd(1000)} className="flex-1 rounded-xl">
              <Droplets className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              +1L
            </Button>
          </div>
          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Custom (ml)"
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              aria-label="Custom water amount in ml"
            />
            <Button size="sm" onClick={handleCustomAdd}>Add</Button>
          </div>
        </CardContent>
      </Card>
    </m.div>
  );
}

export const WaterCard = memo(WaterCardImpl);
WaterCard.displayName = "WaterCard";
