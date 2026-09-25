"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { getWaterTotalForDate } from "@/lib/calculations";
import { addDays, subtractDays, toLocalDate, formatDisplayDate, getLastNDays } from "@/lib/dates";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { ChevronLeft, ChevronRight, ChevronDown, Droplets, Trash2, Undo2, Plus, X, Coffee } from "lucide-react";
import { m } from "framer-motion";

const WaterWeeklyChart = dynamic(
  () =>
    import("@/components/charts/water-weekly-chart").then(
      (mod) => mod.WaterWeeklyChart,
    ),
  { loading: () => <div className="h-40 rounded-xl bg-muted/40 animate-pulse" /> },
);

const VISIBLE_LOG = 5;

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

function SectionCard({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card variant="elevated">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
      >
        <span className="text-base font-semibold text-foreground">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </Card>
  );
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
  const [showDetails, setShowDetails] = useState(false);
  const [showAllLog, setShowAllLog] = useState(false);
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

  const quickCups = cupSizes.slice(0, 3);
  const visibleEntries = showAllLog ? dayEntries : dayEntries.slice(0, VISIBLE_LOG);
  const hiddenEntries = dayEntries.length - visibleEntries.length;

  return (
    <div>
      <PageHeader title="Water" description="Track your daily water intake" />

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 flex flex-wrap items-center gap-1.5"
      >
        <Button size="sm" variant="ghost" onClick={handlePrev} aria-label="Previous day">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-[150px] px-1 text-center text-sm font-medium text-foreground">
          {formatDisplayDate(selectedDate)}
        </div>
        <Button size="sm" variant="ghost" onClick={handleNext} aria-label="Next day">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={handleToday} className="ml-1">
          Today
        </Button>
      </m.div>

      {/* Hero: centered circular progress + quick add */}
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-6"
      >
        <Card variant="elevated" className="p-6">
          <div className="flex flex-col items-center text-center">
            <CircularProgress
              value={consumed}
              max={target}
              size={160}
              strokeWidth={10}
              label="Water intake"
            />
            <div className="mt-4">
              <p className="text-3xl font-bold leading-tight tabular-nums text-foreground">
                {consumed.toLocaleString()}
                <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                  / {target.toLocaleString()} ml
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {remaining > 0 ? (
                  <>{remaining.toLocaleString()} ml to go</>
                ) : remaining === 0 ? (
                  <span className="font-medium text-primary">Target reached!</span>
                ) : (
                  <span className="text-destructive">Over by {Math.abs(remaining).toLocaleString()} ml</span>
                )}
              </p>
              <p className={`mt-1 text-xs font-semibold ${hydrationLevel.color}`}>
                Hydration: {hydrationLevel.label}
              </p>
            </div>

            <div className="mt-6 grid w-full grid-cols-3 gap-3">
              {quickCups.map((size) => (
                <Button key={size} variant="secondary" onClick={() => handleQuickAdd(size)} aria-label={`Add ${size} ml water`}>
                  <Droplets className="h-4 w-4" aria-hidden="true" />
                  {formatCupLabel(size)}
                </Button>
              ))}
            </div>

            <div className="mt-3 flex w-full gap-2">
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmountError(null); }}
                placeholder="Custom amount (ml)"
                aria-label="Custom water amount in ml"
                error={amountError ?? undefined}
              />
              <Button onClick={handleCustomAdd} aria-label="Add custom amount">
                Add
              </Button>
            </div>

            <div className="mt-3 flex w-full flex-col gap-3">
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowDetails((v) => !v)}
                  aria-expanded={showDetails}
                >
                  <ChevronDown className={`h-3.5 w-3.5 mr-1.5 transition-transform ${showDetails ? "" : "-rotate-90"}`} />
                  Note &amp; caffeine
                </Button>
                <Button size="sm" variant="ghost" onClick={handleUndo} className="text-muted-foreground">
                  <Undo2 className="h-3.5 w-3.5 mr-1.5" /> Undo last
                </Button>
              </div>

              {showDetails && (
                <div className="space-y-3 text-left">
                  <Input
                    label="Note (optional)"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. After workout"
                  />
                  {settings.caffeineTracking && (
                    <div>
                      <div className="mb-1 flex items-center gap-2">
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
                </div>
              )}
            </div>
          </div>
        </Card>
      </m.div>

      {/* Today's log — timeline, last 5 */}
      <div className="mb-6 space-y-6">
        {dayEntries.length === 0 ? (
          <EmptyState
            icon={<Droplets className="h-8 w-8 text-info" aria-hidden="true" />}
            title="No water logged for this day"
            description="Use the quick-add buttons above to start tracking."
          />
        ) : (
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="mb-3 flex items-baseline gap-2">
              <h2 className="text-lg font-semibold text-foreground">Log</h2>
              <span className="text-xs text-muted-foreground">
                {dayEntries.length} {dayEntries.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            <Card variant="elevated" className="p-6">
              <div className="relative">
                <div className="absolute bottom-3 left-[5px] top-3 w-px bg-border" aria-hidden="true" />
                <div className="space-y-1">
                  {visibleEntries.map((entry) => (
                    <div key={entry.id} className="relative flex items-center gap-4 py-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full border-2 border-primary bg-background"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">{entry.amountMl} ml</span>
                          <span className="ml-2 text-xs text-muted-foreground">{formatTime(entry.createdAt)}</span>
                          {entry.note && (
                            <span className="ml-2 text-xs text-muted-foreground italic">{entry.note}</span>
                          )}
                        </p>
                        {entry.caffeineMg != null && entry.caffeineMg > 0 && (
                          <p className="text-xs text-muted-foreground">
                            <Coffee className="mr-0.5 inline h-3 w-3" />
                            {entry.caffeineMg} mg caffeine
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteId(entry.id)} aria-label="Remove entry">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {hiddenEntries > 0 && (
                <div className="mt-3 flex justify-center">
                  <Button variant="ghost" size="sm" onClick={() => setShowAllLog(true)}>
                    Show {hiddenEntries} more
                  </Button>
                </div>
              )}
            </Card>
          </m.div>
        )}

        {/* Weekly chart — collapsed by default */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <SectionCard title="Weekly Overview">
            <WaterWeeklyChart data={weeklyData} />
          </SectionCard>
        </m.div>

        {/* Manage cups — collapsed by default */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <SectionCard title="Manage Cups">
            <div className="flex flex-wrap gap-2">
              {cupSizes.map((size) => (
                <div key={size} className="flex items-center gap-1">
                  <span className="rounded-lg bg-accent/10 px-2 py-1 text-sm text-foreground">
                    {formatCupLabel(size)}
                  </span>
                  {editingCups && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveCupSize(size)}
                      aria-label={`Remove ${size}ml cup`}
                      className="h-6 w-6 rounded-full p-0"
                    >
                      <X className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
              <Button size="sm" variant="ghost" onClick={() => setEditingCups(!editingCups)}>
                {editingCups ? "Done" : "Edit"}
              </Button>
            </div>
            {editingCups && (
              <div className="mt-3 flex gap-2">
                <Input
                  label="New cup size (ml)"
                  type="number"
                  value={newCupSize}
                  onChange={(e) => { setNewCupSize(e.target.value); setCupSizeError(null); }}
                  placeholder="e.g. 350"
                  error={cupSizeError ?? undefined}
                />
                <Button size="sm" onClick={handleAddCupSize} className="mt-0.5">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add
                </Button>
              </div>
            )}
          </SectionCard>
        </m.div>
      </div>

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
