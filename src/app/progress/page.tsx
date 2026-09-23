"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { toLocalDate } from "@/lib/dates";
import type { WeightEntry } from "@/types/fitness";
import { PageHeader } from "@/components/layout/page-header";
import { ProgressSummary } from "@/components/progress/progress-summary";
import { WeightForm } from "@/components/progress/weight-form";
import { WeightHistory } from "@/components/progress/weight-history";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Plus, Scale, Ruler, TrendingUp, Activity } from "lucide-react";
import { m } from "framer-motion";

const WeightChart = dynamic(
  () =>
    import("@/components/progress/weight-chart").then(
      (mod) => mod.WeightChart,
    ),
  { loading: () => <div className="h-72 rounded-2xl bg-muted/40 animate-pulse" /> },
);

const MeasurementsChart = dynamic(
  () => import("@/components/progress/measurements-chart"),
  { loading: () => <div className="h-72 rounded-2xl bg-muted/40 animate-pulse" /> },
);

function formatDay(dateKey: string): string {
  const parts = dateKey.split("-");
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function calculateBodyFatPercent(
  gender: "male" | "female" | "other",
  waistCm: number,
  neckCm: number,
  heightCm: number,
  hipCm?: number
): number | null {
  if (gender === "male") {
    const diff = waistCm - neckCm;
    if (diff <= 0) return null;
    return (
      495 /
        (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm)) -
      450
    );
  }
  if (gender === "female" && hipCm != null) {
    const sumDiff = waistCm + hipCm - neckCm;
    if (sumDiff <= 0) return null;
    return (
      495 /
        (1.29579 -
          0.35004 * Math.log10(sumDiff) +
          0.22100 * Math.log10(heightCm)) -
      450
    );
  }
  return null;
}

export default function ProgressPage() {
  const { weights, profile } = useFitnessData();
  const {
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
  } = useFitnessActions();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<WeightEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const today = toLocalDate(new Date());

  const handleSave = (data: Omit<WeightEntry, "id">) => {
    if (editEntry) {
      updateWeightEntry(editEntry.id, data);
      toast("Weight entry updated", "success");
    } else {
      addWeightEntry(data);
      toast("Weight logged", "success");
    }
    setEditEntry(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteWeightEntry(deleteId);
      toast("Entry deleted", "success");
      setDeleteId(null);
    }
  };

  const openAdd = () => {
    setEditEntry(null);
    setFormOpen(true);
  };
  const openEdit = (e: WeightEntry) => {
    setEditEntry(e);
    setFormOpen(true);
  };

  const latestWeight = useMemo(() => {
    if (weights.length === 0) return null;
    const sorted = [...weights].sort((a, b) => b.date.localeCompare(a.date));
    return sorted[0];
  }, [weights]);

  const bmi = useMemo(() => {
    if (!profile.heightCm || !latestWeight) return null;
    const heightM = profile.heightCm / 100;
    return latestWeight.weightKg / (heightM * heightM);
  }, [profile.heightCm, latestWeight]);

  const bodyFat = useMemo(() => {
    if (
      !profile.gender ||
      profile.gender === "other" ||
      !profile.heightCm ||
      !profile.neckCm ||
      !latestWeight?.waistCm
    ) {
      return null;
    }
    return calculateBodyFatPercent(
      profile.gender,
      latestWeight.waistCm,
      profile.neckCm,
      profile.heightCm,
      profile.hipCm
    );
  }, [profile, latestWeight]);

  const measurementsData = useMemo(() => {
    const entries = [...weights]
      .filter(
        (w) =>
          w.waistCm != null ||
          w.chestCm != null ||
          w.armsCm != null ||
          w.thighsCm != null
      )
      .sort((a, b) => a.date.localeCompare(b.date));
    return entries.map((w) => ({
      date: w.date,
      label: formatDay(w.date),
      waist: w.waistCm,
      chest: w.chestCm,
      arms: w.armsCm,
      thighs: w.thighsCm,
    }));
  }, [weights]);

  const rateOfChange = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoff = toLocalDate(thirtyDaysAgo);

    const recent = [...weights]
      .filter((w) => w.date >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (recent.length < 2) return null;

    const first = recent[0];
    const last = recent[recent.length - 1];
    const daysDiff =
      (new Date(last.date).getTime() - new Date(first.date).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysDiff === 0) return null;

    const kgChange = last.weightKg - first.weightKg;
    return {
      rate: (kgChange / daysDiff) * 7,
      trend: kgChange > 0 ? ("up" as const) : kgChange < 0 ? ("down" as const) : ("neutral" as const),
    };
  }, [weights]);

  return (
    <div>
      <PageHeader
        title="Progress"
        description="Track your weight and body measurements"
      >
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1.5" /> Log Weight
        </Button>
      </PageHeader>

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ProgressSummary />
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {bmi != null && (
          <StatCard
            label="BMI"
            value={bmi.toFixed(1)}
            icon={<Scale className="h-4 w-4" />}
            description={getBmiCategory(bmi)}
            delay={0.15}
          />
        )}

        {bodyFat != null && (
          <StatCard
            label="Body Fat"
            value={`${bodyFat.toFixed(1)}%`}
            icon={<Activity className="h-4 w-4" />}
            description="Navy method"
            delay={0.2}
          />
        )}

        {latestWeight?.waistCm != null && (
          <StatCard
            label="Waist"
            value={`${latestWeight.waistCm.toFixed(1)} cm`}
            icon={<Ruler className="h-4 w-4" />}
            delay={0.25}
          />
        )}

        {rateOfChange != null && (
          <StatCard
            label="Rate of Change"
            value={`${rateOfChange.rate > 0 ? "+" : ""}${rateOfChange.rate.toFixed(2)} kg/week`}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={rateOfChange.trend}
            trendValue="last 30 days"
            delay={0.3}
          />
        )}
      </m.div>

      {measurementsData.length >= 2 && (
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="mb-6"
        >
          <Card variant="elevated" className="p-5">
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                Body Measurements
              </p>
              <MeasurementsChart data={measurementsData} />
            </CardContent>
          </Card>
        </m.div>
      )}

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
      >
        <WeightChart days={30} />
        <WeightChart days={90} />
      </m.div>

      {weights.length === 0 ? (
        <EmptyState
          title="No weight entries yet"
          description="Start logging your weight to see your progress"
          action={<Button onClick={openAdd}>Log Weight</Button>}
        />
      ) : (
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.45 }}
        >
          <WeightHistory
            entries={weights}
            onEdit={openEdit}
            onDelete={setDeleteId}
          />
        </m.div>
      )}

      <WeightForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditEntry(null);
        }}
        onSave={handleSave}
        date={today}
        initial={editEntry ?? undefined}
        isEdit={!!editEntry}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Entry?"
        description="This weight entry will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
