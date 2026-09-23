/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { SettingsForm } from "@/components/profile/settings-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { m } from "framer-motion";
import {
  Download,
  Upload,
  HardDrive,
  Calendar,
  Dumbbell,
  UtensilsCrossed,
  Droplets,
  User,
  Trash2,
} from "lucide-react";
import { downloadBackup, importBackup } from "@/lib/backup";
import { getStorageUsage, clearSpecificData } from "@/lib/storage";

interface AccountStats {
  memberSince: string;
  totalWorkouts: number;
  totalMeals: number;
  totalWater: number;
}

export default function ProfilePage() {
  const { profile, settings, workouts, meals, water } = useFitnessData();
  const { updateProfile, updateSettings, resetAllData } = useFitnessActions();
  const { toast } = useToast();

  const [storageInfo] = useState(() => getStorageUsage());
  const [importing, setImporting] = useState(false);
  const [clearConfirm, setClearConfirm] = useState<{ open: boolean; type: string; label: string }>({
    open: false,
    type: "",
    label: "",
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const stats: AccountStats = {
    memberSince: (() => {
      if (workouts.length === 0 && meals.length === 0 && water.length === 0) return "N/A";
      const allDates = [
        ...workouts.map((w) => w.date),
        ...meals.map((m) => m.date),
        ...water.map((w) => w.date),
      ].sort();
      return allDates[0] ?? "N/A";
    })(),
    totalWorkouts: workouts.length,
    totalMeals: meals.length,
    totalWater: water.length,
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("Please select an image file", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 200;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL("image/jpeg", 0.8);
          updateProfile({ avatar: base64 });
          toast("Avatar updated", "success");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const result = await importBackup(file);
      if (result.success) {
        toast("Data imported successfully!", "success");
        window.location.reload();
      } else {
        toast(result.message, "error");
      }
    } catch {
      toast("Failed to import data", "error");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleClearData = () => {
    if (clearConfirm.type) {
      clearSpecificData(clearConfirm.type as "workouts" | "meals" | "water" | "weights" | "goals" | "activity" | "prs" | "photos");
      toast(`${clearConfirm.label} cleared`, "success");
      setClearConfirm({ open: false, type: "", label: "" });
      window.location.reload();
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const clearOptions: Array<{ type: string; label: string; icon: React.ReactNode }> = [
    { type: "workouts", label: "Workouts", icon: <Dumbbell className="h-4 w-4" /> },
    { type: "meals", label: "Meals", icon: <UtensilsCrossed className="h-4 w-4" /> },
    { type: "water", label: "Water Entries", icon: <Droplets className="h-4 w-4" /> },
    { type: "weights", label: "Weight Entries", icon: <User className="h-4 w-4" /> },
    { type: "goals", label: "Goals", icon: <Calendar className="h-4 w-4" /> },
    { type: "prs", label: "Personal Records", icon: <Dumbbell className="h-4 w-4" /> },
    { type: "photos", label: "Progress Photos", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div>
      <PageHeader title="Profile" description="Your personal profile and settings" />

      <div className="space-y-6">
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="relative group"
                >
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center border-2 border-border">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                </button>
                <div>
                  <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Avatar</h2>
                  <p className="text-sm text-muted-foreground mt-1">Click to upload a photo</p>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Profile</h2>
              <ProfileForm profile={profile} onSave={updateProfile} />
            </CardContent>
          </Card>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card variant="elevated">
            <CardContent className="p-5">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Account Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium mt-0.5">
                    {stats.memberSince === "N/A" ? "N/A" : stats.memberSince}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <Dumbbell className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Workouts</p>
                  <p className="text-sm font-medium mt-0.5">{stats.totalWorkouts}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <UtensilsCrossed className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Meals</p>
                  <p className="text-sm font-medium mt-0.5">{stats.totalMeals}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <Droplets className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Water Entries</p>
                  <p className="text-sm font-medium mt-0.5">{stats.totalWater}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardContent className="p-5">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Data Management</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" onClick={downloadBackup} className="justify-start gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => importInputRef.current?.click()}
                    disabled={importing}
                    className="justify-start gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {importing ? "Importing..." : "Import Data"}
                  </Button>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Storage Usage</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.total)}
                    </span>
                  </div>
                  <ProgressBar value={storageInfo.percent} size="sm" variant="gradient" />
                </div>
              </div>
            </CardContent>
          </Card>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card variant="elevated">
            <CardContent className="p-5">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Settings</h2>
              <SettingsForm
                settings={settings}
                onSave={updateSettings}
                onResetAll={resetAllData}
              />
            </CardContent>
          </Card>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardContent className="p-5">
              <h2 className="text-xs font-medium uppercase tracking-wider text-destructive mb-4">Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Selectively clear specific data types. This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {clearOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setClearConfirm({ open: true, type: option.type, label: option.label })}
                    className="flex items-center gap-2 p-3 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/5 transition-colors text-left"
                  >
                    <Trash2 className="h-4 w-4 shrink-0" />
                    <span className="text-sm">Clear {option.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </m.div>
      </div>

      <ConfirmDialog
        open={clearConfirm.open}
        onClose={() => setClearConfirm({ open: false, type: "", label: "" })}
        onConfirm={handleClearData}
        title={`Clear ${clearConfirm.label}?`}
        description={`All ${clearConfirm.label.toLowerCase()} data will be permanently deleted. This cannot be undone.`}
        confirmLabel="Clear"
        variant="destructive"
      />
    </div>
  );
}
