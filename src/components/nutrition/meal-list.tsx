"use client";

import { useMemo, useState } from "react";
import type { MealEntry } from "@/types/fitness";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, BookmarkPlus, ChevronDown, UtensilsCrossed } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

const VISIBLE_MEALS = 3;

interface MealListProps {
  meals: MealEntry[];
  onEdit: (meal: MealEntry) => void;
  onDelete: (id: string) => void;
  onSaveTemplate?: (meal: MealEntry) => void;
}

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const MEAL_TYPE_ORDER = ["breakfast", "lunch", "dinner", "snack"];

export function MealList({ meals, onEdit, onDelete, onSaveTemplate }: MealListProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const groups: { type: string; meals: MealEntry[] }[] = [];
    for (const mt of MEAL_TYPE_ORDER) {
      const items = meals.filter((m) => m.mealType === mt);
      if (items.length > 0) {
        groups.push({ type: mt, meals: items });
      }
    }
    return groups;
  }, [meals]);

  if (grouped.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {grouped.map((group, gi) => {
        const isCollapsed = collapsed[group.type] ?? false;
        const showEverything = showAll[group.type] ?? false;
        const totalKcal = group.meals.reduce((s, m) => s + m.calories, 0);
        const visibleMeals = showEverything ? group.meals : group.meals.slice(0, VISIBLE_MEALS);
        const hiddenCount = group.meals.length - visibleMeals.length;

        return (
          <m.div
            key={group.type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: gi * 0.05 }}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <button
              type="button"
              onClick={() => setCollapsed((c) => ({ ...c, [group.type]: !isCollapsed }))}
              aria-expanded={!isCollapsed}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-accent/5 md:px-6"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <UtensilsCrossed className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-foreground">
                    {MEAL_TYPE_LABELS[group.type]}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {group.meals.length} item{group.meals.length !== 1 ? "s" : ""}
                  </span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {Math.round(totalKcal)} kcal
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                  aria-hidden="true"
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <div className="space-y-3 px-5 pb-5 md:px-6 md:pb-6">
                    {visibleMeals.map((meal) => (
                      <Card key={meal.id} hover className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">{meal.foodName}</p>
                            {meal.quantity && (
                              <p className="text-xs text-muted-foreground">{meal.quantity}</p>
                            )}
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">{Math.round(meal.calories)} kcal</span>
                              <span>{Math.round(meal.protein)}g protein</span>
                              <span>{Math.round(meal.carbs)}g carbs</span>
                              <span>{Math.round(meal.fat)}g fat</span>
                            </div>
                            {meal.notes && (
                              <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">{meal.notes}</p>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            {onSaveTemplate && (
                              <Button size="sm" variant="ghost" onClick={() => onSaveTemplate(meal)} aria-label={`Save ${meal.foodName} as template`}>
                                <BookmarkPlus className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => onEdit(meal)} aria-label={`Edit ${meal.foodName}`}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => onDelete(meal.id)} aria-label={`Delete ${meal.foodName}`}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {hiddenCount > 0 && (
                      <div className="flex justify-center pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAll((s) => ({ ...s, [group.type]: true }))}
                        >
                          Show {hiddenCount} more
                        </Button>
                      </div>
                    )}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        );
      })}
    </div>
  );
}
