"use client";

import { useState } from "react";
import type { AppSettings } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";

const UNIT_OPTIONS = [
  { value: "metric", label: "Metric (kg, cm, ml)" },
  { value: "imperial", label: "Imperial (lbs, in, oz)" },
];

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const FONT_SIZE_OPTIONS = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

interface SettingsFormProps {
  settings: AppSettings;
  onSave: (updates: Partial<AppSettings>) => void;
  onResetAll: () => void;
}

export function SettingsForm({ settings, onSave, onResetAll }: SettingsFormProps) {
  const { toast } = useToast();
  const [units, setUnits] = useState(settings.units);
  const [theme, setTheme] = useState(settings.theme);
  const [fontSize, setFontSize] = useState(settings.fontSize);
  const [reduceMotion, setReduceMotion] = useState(settings.reduceMotion);
  const [highContrast, setHighContrast] = useState(settings.highContrast);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSave = () => {
    onSave({ units, theme, fontSize, reduceMotion, highContrast });
    toast("Settings saved", "success");
  };

  const handleReset = () => {
    onResetAll();
    setResetConfirm(false);
    toast("All data has been reset", "success");
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">General</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Units"
              value={units}
              onChange={(e) => setUnits(e.target.value as AppSettings["units"])}
              options={UNIT_OPTIONS}
            />
            <Select
              label="Theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as AppSettings["theme"])}
              options={THEME_OPTIONS}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Accessibility</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Font Size"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as AppSettings["fontSize"])}
              options={FONT_SIZE_OPTIONS}
            />
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Reduce Motion</p>
                <p className="text-xs text-muted-foreground">Minimize animations</p>
              </div>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reduceMotion ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reduceMotion ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">High Contrast</p>
                <p className="text-xs text-muted-foreground">Increase text visibility</p>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  highContrast ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Permanently delete all your data including workouts, meals, water, weight, goals, and profile.
        </p>
        <Button variant="ghost" onClick={() => setResetConfirm(true)} className="text-destructive hover:text-destructive">
          Reset All Data
        </Button>
      </div>

      <ConfirmDialog
        open={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset All Data?"
        description="This will permanently delete ALL your fitness data. This action cannot be undone."
        confirmLabel="Reset Everything"
        variant="destructive"
      />
    </>
  );
}