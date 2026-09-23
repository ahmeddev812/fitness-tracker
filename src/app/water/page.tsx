"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { getWaterTotalForDate } from "@/lib/calculations";
import { addDays, subtractDays, toLocalDate, formatDisplayDate, getLastNDays } from "@/lib/dates";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { ChevronLeft, ChevronRight, Droplets, Trash2, Undo2, Plus, X, Coffee } from "lucide-react";
import { m } from "framer-motion";

const WaterWeeklyChart = dynamic(
  () =>
    import("@/components/charts/water-weekly-chart").then(
      (mod) => mod.WaterWeeklyChart,
    ),
  { loading: () => <div className="h-40 rounded-xl bg-muted/40 animate-pulse" /> },
);

function validateAmount(value: string): string | null {
  if (!value) return "Amount is required";
  const num = parseInt(value, 10);
  if (isNaN(num)) return "Must be a number";
  if (num < 1) return "Minimum 1 ml";
  if (num > 5000) return "Maximum 5000 ml";
  return null;
}

function validateCupSize(value: string): string | null {
  if (!value) return "Size is required";
  const num = parseInt(value, 10);
  if (isNaN(num)) return "Must be a number";
  if (num < 1) return "Minimum 1 ml";
  if (num > 5000) return "Maximum 5000 ml";
  return null;
}

function getHydrationLevel(percent: number): { label: string; color: string } {
  if (percent >= 80) return { label: "Excellent", color: "text-success" };
  if (percent >= 50) return { label: "Good", color: "text-primary" };
  return { label: "Poor", color: "text-destructive" };
}

export default function WaterPage() {
  const { water, profile, settings } = useFitnessData();
  const { addWaterEntry, deleteWaterEntry, undoLastWater, updateSettings } = useFitnessActions();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState(() => toLocalDate(new Date()));
  const [customAmount, setCustomAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [caffeineMg, setCaffeineMg] = useState("");
  const [caffeineError, setCaffeineError] = useState<string | null>(null);
  const [editingCups, setEditingCups] = useState(false);
  const [newCupSize, setNewCupSize] = useState("");
  const [cupSizeError, setCupSizeError] = useState<string | null>(null);

  const cupSizes = settings.customCupSizes;

  const dayEntries = useMemo(
    () => water.filter((e) => e.date === selectedDate).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [water, selectedDate]
  );

  const consumed = useMemo(() => getWaterTotalForDate(water, selectedDate), [water, selectedDate]);
  const target = profile.waterTargetMl;
  const remaining = target - consumed;
  const percent = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
  const hydrationLevel = getHydrationLevel(percent);

  const weeklyData = useMemo(() => {
    const dates = getLastNDays(7);
    return dates.map((date) => {
      const total = getWaterTotalForDate(water, date);
      const dayLabel = new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
      return { date: dayLabel, ml: total };
    });
  }, [water]);

  const todayCaffeine = useMemo(() => {
    return dayEntries.reduce((sum, e) => sum + (e.caffeineMg ?? 0), 0);
  }, [dayEntries]);

  const handlePrev = () => setSelectedDate((d) => subtractDays(d, 1));
  const handleNext = () => setSelectedDate((d) => addDays(d, 1));
  const handleToday = () => setSelectedDate(toLocalDate(new Date()));

  const handleQuickAdd = (amount: number) => {
    addWaterEntry({ date: selectedDate, amountMl: amount, note: note || undefined, caffeineMg: caffeineMg ? parseInt(caffeineMg, 10) : undefined });
    toast(`+${amount} ml water logged`, "success");
    setNote("");
    setCaffeineMg("");
  };

  const handleCustomAdd = () => {
    const err = validateAmount(customAmount);
    if (err) {
      setAmountError(err);
      return;
    }
    setAmountError(null);
    addWaterEntry({ date: selectedDate, amountMl: parseInt(customAmount, 10), note: note || undefined, caffeineMg: caffeineMg ? parseInt(caffeineMg, 10) : undefined });
    toast(`+${customAmount} ml water logged`, "success");
    setCustomAmount("");
    setNote("");
    setCaffeineMg("");
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteWaterEntry(deleteId);
      toast("Entry removed", "success");
      setDeleteId(null);
    }
  };

  const handleUndo = () => {
    undoLastWater();
    toast("Entry removed", "info");
  };

  const handleAddCupSize = () => {
    const err = validateCupSize(newCupSize);
    if (err) {
      setCupSizeError(err);
      return;
    }
    const size = parseInt(newCupSize, 10);
    if (cupSizes.includes(size)) {
      setCupSizeError("Size already exists");
      return;
    }
    setCupSizeError(null);
    updateSettings({ customCupSizes: [...cupSizes, size].sort((a, b) => a - b) });
    setNewCupSize("");
    toast("Cup size added", "success");
  };

  const handleRemoveCupSize = (size: number) => {
    if (cupSizes.length <= 1) {
      toast("Must keep at least one cup size", "error");
      return;
    }
    updateSettings({ customCupSizes: cupSizes.filter((s) => s !== size) });
    toast("Cup size removed", "success");
  };

  const formatCupLabel = (ml: number) => {
    if (ml >= 1000) return `+${ml / 1000} L`;
    return `+${ml}`;
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div>
      <PageHeader title="Water" description="Track your daily water intake" />

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-2 mb-6"
      >
        <Button size="sm" variant="ghost" onClick={handlePrev} aria-label="Previous day" className="rounded-xl">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium text-foreground min-w-[160px] text-center">
          {formatDisplayDate(selectedDate)}
        </div>
        <Button size="sm" variant="ghost" onClick={handleNext} aria-label="Next day" className="rounded-xl">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={handleToday} className="rounded-xl">
          Today
        </Button>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card variant="elevated" className="mb-6">
          <CardContent className="p-5">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-5 mb-4">
              <CircularProgress
                value={consumed}
                max={target}
                size={120}
                strokeWidth={8}
                label="Water intake"
              />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Water</p>
                <div className="flex items-baseline gap-1.5 justify-center sm:justify-start">
                  <span className="text-3xl font-bold tabular-nums">{consumed}</span>
                  <span className="text-sm text-muted-foreground">/ {target} ml</span>
                </div>
                <p className="text-xs mt-1">
                  {remaining > 0 ? (
                    <span className="text-muted-foreground">{remaining} ml remaining</span>
                  ) : remaining === 0 ? (
                    <span className="text-primary font-medium">Target reached!</span>
                  ) : (
                    <span className="text-destructive">Over by {Math.abs(remaining)} ml</span>
                  )}
                </p>
                <p className={`text-xs font-semibold mt-1 ${hydrationLevel.color}`}>
                  Hydration: {hydrationLevel.label}
                </p>
                <ProgressBar
                  value={percent}
                  size="sm"
                  variant={remaining < 0 ? "warning" : "gradient"}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {cupSizes.map((size) => (
                <Button key={size} size="sm" variant="gradient" onClick={() => handleQuickAdd(size)} className="rounded-xl">
                  <Droplets className="h-3.5 w-3.5 mr-1.5" /> {formatCupLabel(size)}
                </Button>
              ))}
            </div>

            {settings.caffeineTracking && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Coffee className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Caffeine today: {todayCaffeine} mg
                  </span>
                </div>
                <Input
                  label="Caffeine (mg, optional)"
                  type="number"
                  value={caffeineMg}
                  onChange={(e) => { setCaffeineMg(e.target.value); setCaffeineError(null); }}
                  placeholder="e.g. 80"
                  error={caffeineError ?? undefined}
                />
              </div>
            )}

            <Input
              label="Note (optional)"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. After workout"
              className="mb-3"
            />

            <div className="flex gap-2 mb-3">
              <Input
                label="Custom amount (ml)"
                type="number"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmountError(null); }}
                placeholder="e.g. 350"
                error={amountError ?? undefined}
              />
              <Button onClick={handleCustomAdd} className="mt-0.5">Add</Button>
            </div>

            <Button size="sm" variant="ghost" onClick={handleUndo} className="rounded-xl text-muted-foreground">
              <Undo2 className="h-3.5 w-3.5 mr-1.5" /> Undo Last
            </Button>
          </CardContent>
        </Card>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-6"
      >
        <Card variant="elevated">
          <CardContent className="p-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Weekly Overview
            </h3>
            <WaterWeeklyChart data={weeklyData} />
          </CardContent>
        </Card>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="mb-6"
      >
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Manage Cups
              </h3>
              <Button size="sm" variant="ghost" onClick={() => setEditingCups(!editingCups)} className="rounded-xl text-xs">
                {editingCups ? "Done" : "Edit"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cupSizes.map((size) => (
                <div key={size} className="flex items-center gap-1">
                  <span className="text-sm text-foreground px-2 py-1 rounded-lg bg-accent/10">
                    {formatCupLabel(size)}
                  </span>
                  {editingCups && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveCupSize(size)}
                      aria-label={`Remove ${size}ml cup`}
                      className="rounded-full p-0 h-6 w-6"
                    >
                      <X className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {editingCups && (
              <div className="flex gap-2 mt-3">
                <Input
                  label="New cup size (ml)"
                  type="number"
                  value={newCupSize}
                  onChange={(e) => { setNewCupSize(e.target.value); setCupSizeError(null); }}
                  placeholder="e.g. 350"
                  error={cupSizeError ?? undefined}
                />
                <Button size="sm" onClick={handleAddCupSize} className="mt-0.5 rounded-xl">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </m.div>

      {dayEntries.length === 0 ? (
        <EmptyState
          title="No water logged for this day"
          description="Add water entries above to start tracking"
        />
      ) : (
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Log ({dayEntries.length} {dayEntries.length === 1 ? "entry" : "entries"})
          </h3>
          <div className="space-y-2">
            {dayEntries.map((entry) => (
              <Card key={entry.id} hover className="p-0">
                <CardContent className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="gradient-primary rounded-xl p-2">
                      <Droplets className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{entry.amountMl} ml</p>
                      <p className="text-xs text-muted-foreground">{formatTime(entry.createdAt)}</p>
                      {entry.note && (
                        <p className="text-xs text-muted-foreground italic">{entry.note}</p>
                      )}
                      {entry.caffeineMg != null && entry.caffeineMg > 0 && (
                        <p className="text-xs text-muted-foreground">
                          <Coffee className="inline h-3 w-3 mr-0.5" />{entry.caffeineMg} mg caffeine
                        </p>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteId(entry.id)} aria-label="Remove entry">
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </m.div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove Entry?"
        description="This water entry will be permanently removed."
        confirmLabel="Remove"
        variant="destructive"
      />
    </div>
  );
}
