"use client";

import type { WeightEntry } from "@/types/fitness";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2 } from "lucide-react";
import { formatDisplayDate } from "@/lib/dates";
import { m } from "framer-motion";

interface WeightHistoryProps {
  entries: WeightEntry[];
  onEdit: (entry: WeightEntry) => void;
  onDelete: (id: string) => void;
}

export function WeightHistory({ entries, onEdit, onDelete }: WeightHistoryProps) {
  if (entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">
        Weight Log
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </h3>
      <div className="space-y-3">
        {sorted.map((entry, i) => {
          const hasMeasurements =
            entry.waistCm != null ||
            entry.chestCm != null ||
            entry.armsCm != null ||
            entry.thighsCm != null;

          return (
            <m.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Card hover className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{entry.weightKg} kg</span>
                        <span className="text-xs text-muted-foreground">{formatDisplayDate(entry.date)}</span>
                      </div>
                      {hasMeasurements && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                          {entry.waistCm != null && (
                            <Badge variant="secondary" className="text-xs">Waist {entry.waistCm} cm</Badge>
                          )}
                          {entry.chestCm != null && (
                            <Badge variant="secondary" className="text-xs">Chest {entry.chestCm} cm</Badge>
                          )}
                          {entry.armsCm != null && (
                            <Badge variant="secondary" className="text-xs">Arms {entry.armsCm} cm</Badge>
                          )}
                          {entry.thighsCm != null && (
                            <Badge variant="secondary" className="text-xs">Thighs {entry.thighsCm} cm</Badge>
                          )}
                        </div>
                      )}
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{entry.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(entry)} aria-label="Edit entry">
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(entry.id)} aria-label="Delete entry">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
              </Card>
            </m.div>
          );
        })}
      </div>
    </div>
  );
}
