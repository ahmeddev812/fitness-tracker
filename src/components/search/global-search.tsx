"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Apple, Droplets, Scale, Target, ArrowRight, Trash2 } from "lucide-react";
import { formatDisplayDate } from "@/lib/dates";
import { m, AnimatePresence } from "framer-motion";

interface SearchResult {
  type: "workout" | "meal" | "water" | "weight" | "goal" | "action";
  id?: string;
  title: string;
  subtitle: string;
  date?: string;
  action?: () => void;
}

const QUICK_ACTIONS = [
  { key: "water", label: "Add Water", icon: Droplets, action: "water" },
  { key: "meal", label: "Log Meal", icon: Apple, action: "meal" },
  { key: "workout", label: "Start Workout", icon: Dumbbell, action: "workout" },
  { key: "weight", label: "Log Weight", icon: Scale, action: "weight" },
] as const;

export function GlobalSearch() {
  const { workouts, meals, water, weights, goals, searchHistory } = useFitnessData();
  const { addSearchHistoryEntry, clearSearchHistory } = useFitnessActions();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    prevOpenRef.current = open;
  }, [open]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) {
      const recent: SearchResult[] = searchHistory.slice(0, 5).map((s) => ({
        type: "action" as const,
        title: s.query,
        subtitle: "Recent search",
      }));
      const actions: SearchResult[] = QUICK_ACTIONS.map((a) => ({
        type: "action" as const,
        title: a.label,
        subtitle: "Quick action",
        action: () => {},
      }));
      return [...recent, ...actions];
    }

    const q = query.toLowerCase();
    const items: SearchResult[] = [];

    workouts.forEach((w) => {
      if (w.name.toLowerCase().includes(q) || w.category?.toLowerCase().includes(q)) {
        items.push({ type: "workout", id: w.id, title: w.name, subtitle: w.category || "Workout", date: w.date });
      }
    });

    meals.forEach((m) => {
      if (m.foodName.toLowerCase().includes(q)) {
        items.push({ type: "meal", id: m.id, title: m.foodName, subtitle: `${Math.round(m.calories)} kcal · ${m.mealType}`, date: m.date });
      }
    });

    water.forEach((w) => {
      if (w.note?.toLowerCase().includes(q)) {
        items.push({ type: "water", id: w.id, title: `${w.amountMl} ml`, subtitle: w.note || "Water", date: w.date });
      }
    });

    weights.forEach((w) => {
      if (w.notes?.toLowerCase().includes(q)) {
        items.push({ type: "weight", id: w.id, title: `${w.weightKg} kg`, subtitle: w.notes || "Weight", date: w.date });
      }
    });

    goals.forEach((g) => {
      if (g.title?.toLowerCase().includes(q) || g.type.toLowerCase().includes(q)) {
        items.push({ type: "goal", id: g.id, title: g.title || g.type, subtitle: g.status, date: g.startDate });
      }
    });

    return items.slice(0, 20);
  }, [query, workouts, meals, water, weights, goals, searchHistory]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        const r = results[selectedIndex];
        if (r.action) {
          r.action();
        } else if (query.trim()) {
          addSearchHistoryEntry(query);
        }
        setOpen(false);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [results, selectedIndex, query, addSearchHistoryEntry]
  );

  const typeIcon: Record<string, typeof Dumbbell> = {
    workout: Dumbbell,
    meal: Apple,
    water: Droplets,
    weight: Scale,
    goal: Target,
    action: ArrowRight,
  };

  const typeColor: Record<string, string> = {
    workout: "text-primary",
    meal: "text-success",
    water: "text-info",
    weight: "text-warning",
    goal: "text-accent",
    action: "text-muted-foreground",
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); setQuery(""); setSelectedIndex(0); }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors border border-border/60"
        aria-label="Search (Ctrl+K)"
      >
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="mt-4">
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search workouts, meals, goals..."
            aria-label="Search"
          />

          {query.trim() && searchHistory.length > 0 && (
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">Recent</span>
              <Button size="sm" variant="ghost" onClick={clearSearchHistory} className="h-6 text-xs">
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
          )}

          <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
            <AnimatePresence>
              {results.map((result, i) => {
                const Icon = typeIcon[result.type] || ArrowRight;
                return (
                  <m.div
                    key={`${result.type}-${result.id || result.title}-${i}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    className={[
                      "flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors",
                      i === selectedIndex ? "bg-primary/10 text-primary" : "hover:bg-accent/10",
                    ].join(" ")}
                    onClick={() => {
                      setSelectedIndex(i);
                      if (result.action) result.action();
                      else if (query.trim()) addSearchHistoryEntry(query);
                      setOpen(false);
                    }}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${typeColor[result.type]}`} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                    </div>
                    {result.date && (
                      <span className="text-xs text-muted-foreground shrink-0">{formatDisplayDate(result.date)}</span>
                    )}
                    <Badge variant="secondary" className="text-[10px] shrink-0">{result.type}</Badge>
                  </m.div>
                );
              })}
            </AnimatePresence>
            {results.length === 0 && query.trim() && (
              <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
