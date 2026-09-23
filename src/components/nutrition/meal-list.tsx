"use client";

import { useMemo } from "react";
import type { MealEntry } from "@/types/fitness";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, BookmarkPlus } from "lucide-react";
import { m } from "framer-motion";

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
    <div className="space-y-6">
      {grouped.map((group, gi) => (
        <m.div
          key={group.type}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: gi * 0.05 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {MEAL_TYPE_LABELS[group.type]}
            </h3>
            <Badge variant="gradient" className="text-xs">
              {group.meals.reduce((s, m) => s + m.calories, 0)} kcal
            </Badge>
          </div>
          <div className="space-y-2">
            {group.meals.map((meal) => (
              <Card key={meal.id} hover>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{meal.foodName}</p>
                      {meal.quantity && (
                        <p className="text-xs text-muted-foreground">{meal.quantity}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{Math.round(meal.calories)} kcal</span>
                        <span>{Math.round(meal.protein)}g protein</span>
                        <span>{Math.round(meal.carbs)}g carbs</span>
                        <span>{Math.round(meal.fat)}g fat</span>
                      </div>
                      {meal.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{meal.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {onSaveTemplate && (
                        <Button size="sm" variant="ghost" onClick={() => onSaveTemplate(meal)} aria-label={`Save ${meal.foodName} as template`}>
                          <BookmarkPlus className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => onEdit(meal)} aria-label={`Edit ${meal.foodName}`}>
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(meal.id)} aria-label={`Delete ${meal.foodName}`}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </m.div>
      ))}
    </div>
  );
}
