"use client";

import { useState, useMemo } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { addDays, subtractDays, toLocalDate, formatDisplayDate } from "@/lib/dates";
import type { MealEntry } from "@/types/fitness";
import { PageHeader } from "@/components/layout/page-header";
import { DailySummary } from "@/components/nutrition/daily-summary";
import { MealForm } from "@/components/nutrition/meal-form";
import { MealList } from "@/components/nutrition/meal-list";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { ChevronLeft, ChevronRight, Plus, Copy, Bookmark } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const MACRO_COLORS: Record<string, string> = {
  protein: "var(--color-primary)",
  carbs: "oklch(0.63 0.19 145)",
  fat: "oklch(0.77 0.16 75)",
};

export default function NutritionPage() {
  const { meals, mealTemplates } = useFitnessData();
  const { addMeal, updateMeal, deleteMeal, copyYesterdayMeals, addMealTemplate, applyMealTemplate } = useFitnessActions();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState(() => toLocalDate(new Date()));
  const [formOpen, setFormOpen] = useState(false);
  const [editMeal, setEditMeal] = useState<MealEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const dayMeals = useMemo(
    () => meals.filter((m) => m.date === selectedDate),
    [meals, selectedDate]
  );

  const today = toLocalDate(new Date());
  const yesterday = subtractDays(today, 1);
  const hasYesterdayMeals = meals.some((m) => m.date === yesterday);

  const macroData = useMemo(() => {
    const totals = dayMeals.reduce(
      (acc, m) => ({
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
    return [
      { name: "Protein", value: Math.round(totals.protein), color: MACRO_COLORS.protein },
      { name: "Carbs", value: Math.round(totals.carbs), color: MACRO_COLORS.carbs },
      { name: "Fat", value: Math.round(totals.fat), color: MACRO_COLORS.fat },
    ].filter((d) => d.value > 0);
  }, [dayMeals]);

  const totalMacros = useMemo(
    () => macroData.reduce((s, d) => s + d.value, 0),
    [macroData]
  );

  const handlePrev = () => setSelectedDate((d) => subtractDays(d, 1));
  const handleNext = () => setSelectedDate((d) => addDays(d, 1));
  const handleToday = () => setSelectedDate(toLocalDate(new Date()));

  const handleSave = (data: Omit<MealEntry, "id" | "createdAt">) => {
    if (editMeal) {
      updateMeal(editMeal.id, data);
      toast("Meal updated", "success");
    } else {
      addMeal(data);
      toast("Meal added", "success");
    }
    setEditMeal(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMeal(deleteId);
      toast("Meal deleted", "success");
      setDeleteId(null);
    }
  };

  const handleCopyYesterday = () => {
    copyYesterdayMeals();
    toast("Yesterday's meals copied", "success");
  };

  const handleSaveTemplate = (meal: MealEntry) => {
    addMealTemplate({
      name: meal.foodName,
      mealType: meal.mealType,
      foodName: meal.foodName,
      quantity: meal.quantity,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    });
    toast("Template saved", "success");
  };

  const handleUseTemplate = (templateId: string) => {
    const result = applyMealTemplate(templateId);
    if (result) {
      addMeal(result);
      toast("Template applied", "success");
    }
  };

  const openAdd = () => { setEditMeal(null); setFormOpen(true); };
  const openEdit = (m: MealEntry) => { setEditMeal(m); setFormOpen(true); };

  return (
    <div>
      <PageHeader title="Nutrition" description="Log meals and track macros">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Meal
        </Button>
      </PageHeader>

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
        {hasYesterdayMeals && selectedDate === today && (
          <Button size="sm" variant="outline" onClick={handleCopyYesterday} className="rounded-xl ml-2">
            <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Yesterday&apos;s Meals
          </Button>
        )}
      </m.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <DailySummary date={selectedDate} />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Macro Split</CardTitle>
            </CardHeader>
            <CardContent>
              {macroData.length > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          innerRadius={24}
                          outerRadius={40}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {macroData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: d.color }}
                          />
                          <span className="text-muted-foreground">{d.name}</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {d.value}g
                          <span className="text-muted-foreground ml-1">
                            ({totalMacros > 0 ? Math.round((d.value / totalMacros) * 100) : 0}%)
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No macros logged yet
                </p>
              )}
            </CardContent>
          </Card>
        </m.div>
      </div>

      {dayMeals.length === 0 ? (
        <EmptyState
          title="No meals logged for this day"
          description="Add a meal to start tracking your nutrition"
          action={<Button onClick={openAdd}>Add Meal</Button>}
        />
      ) : (
        <MealList
          meals={dayMeals}
          onEdit={openEdit}
          onDelete={setDeleteId}
          onSaveTemplate={handleSaveTemplate}
        />
      )}

      <AnimatePresence>
        {mealTemplates.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="mt-8"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Meal Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mealTemplates.map((t) => (
                    <Button
                      key={t.id}
                      size="sm"
                      variant="outline"
                      onClick={() => handleUseTemplate(t.id)}
                      className="rounded-xl"
                    >
                      {t.name}
                      <span className="text-muted-foreground ml-1.5 text-xs">
                        {Math.round(t.calories)} kcal
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </m.div>
        )}
      </AnimatePresence>

      <MealForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditMeal(null); }}
        onSave={handleSave}
        date={selectedDate}
        initial={editMeal ?? undefined}
        isEdit={!!editMeal}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Meal?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
