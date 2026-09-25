"use client";

import { useEffect, useState, useRef } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/context/SubscriptionContext";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { SettingsForm } from "@/components/profile/settings-form";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { LevelCard } from "@/components/dashboard/level-card";
import { useToast } from "@/components/ui/toast";
import { ProWaitlistModal } from "@/components/pricing/pro-waitlist-modal";
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
  CreditCard,
  LogOut,
  Sparkles,
  Mail,
  SlidersHorizontal,
  AlertTriangle,
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
  const { user, logout } = useAuth();
  const {
    plan,
    planLabel,
    isLoading: planLoading,
    refresh: refreshPlan,
  } = useSubscription();
  const { toast } = useToast();
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const [storageInfo, setStorageInfo] = useState(() => ({
    used: 0,
    total: 5 * 1024 * 1024,
    percent: 0,
  }));
  const [importing, setImporting] = useState(false);
  const [clearConfirm, setClearConfirm] = useState<{ open: boolean; type: string; label: string }>({
    open: false,
    type: "",
    label: "",
  });

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setStorageInfo(getStorageUsage());
    }, 0);
    return () => window.clearTimeout(handle);
  }, []);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const displayName = profile.name || user?.name || "";

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

  const handleUpgrade = () => {
    setWaitlistOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      toast("Sign out failed", "error");
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
          transition={{ duration: 0.3 }}
          className="grid gap-4 md:gap-6 lg:grid-cols-3"
        >
          <Card className="p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="group relative"
              >
                <UserAvatar
                  src={profile.avatar}
                  clerkUrl={user?.imageUrl}
                  name={displayName}
                  size="xl"
                  className="border-2 border-border"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Upload className="h-5 w-5 text-white" />
                </div>
              </button>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-foreground">
                  {displayName || "Your profile"}
                </h2>
                {user?.email && (
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {user.email}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Click avatar to upload a photo
                </p>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "Member Since", value: stats.memberSince === "N/A" ? "N/A" : stats.memberSince, icon: <Calendar className="h-4 w-4" /> },
                { label: "Workouts", value: stats.totalWorkouts, icon: <Dumbbell className="h-4 w-4" /> },
                { label: "Meals", value: stats.totalMeals, icon: <UtensilsCrossed className="h-4 w-4" /> },
                { label: "Water Entries", value: stats.totalWater, icon: <Droplets className="h-4 w-4" /> },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-accent/40 p-3 text-center">
                  <span className="mx-auto mb-1 flex justify-center text-primary">{s.icon}</span>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-0.5 text-sm font-medium">{s.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <LevelCard />
        </m.div>

        <CollapsibleSection
          title="Profile"
          icon={<User className="h-4 w-4" aria-hidden="true" />}
          defaultOpen
          delay={0.05}
        >
          <ProfileForm profile={profile} onSave={updateProfile} />
        </CollapsibleSection>

        <CollapsibleSection
          title="Preferences"
          icon={<SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}
          delay={0.1}
        >
          <SettingsForm
            settings={settings}
            onSave={updateSettings}
            onResetAll={resetAllData}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Account"
          icon={<CreditCard className="h-4 w-4" aria-hidden="true" />}
          delay={0.15}
          action={
            <Button
              variant="ghost"
              onClick={() => void refreshPlan()}
              disabled={planLoading}
            >
              Refresh
            </Button>
          }
        >
          <div className="space-y-5">
            <div className="mb-1 flex items-start gap-3 rounded-xl border border-border/60 bg-accent/30 p-4">
              <div className="gradient-primary grid h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-glow">
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {planLoading ? "Loading plan…" : planLabel}
                  </p>
                  <Badge variant={plan === "free" ? "secondary" : "gradient"}>
                    {plan === "free" ? "Free" : "Pro"}
                  </Badge>
                  <Badge variant="warning" className="text-[10px]">
                    Coming Soon
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pro unlocks advanced charts, templates, and PDF reports —
                  launching soon. No payment today.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="gradient"
                onClick={handleUpgrade}
                className="sm:flex-1"
                aria-label="Join Pro waitlist"
              >
                <Sparkles className="mr-1.5 h-4 w-4" />
                Join Pro Waitlist
              </Button>
              <Button
                variant="outline"
                onClick={() => void handleSignOut()}
                className="sm:flex-1"
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Sign out
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
              <div className="mb-2 flex items-center justify-between">
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
        </CollapsibleSection>

        <CollapsibleSection
          title="Danger Zone"
          icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
          danger
          delay={0.2}
        >
          <p className="mb-4 text-sm text-muted-foreground">
            Selectively clear specific data types. This action cannot be undone.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {clearOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => setClearConfirm({ open: true, type: option.type, label: option.label })}
                className="flex items-center gap-2 rounded-xl border border-destructive/20 p-3 text-left text-destructive transition-colors hover:bg-destructive/5"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                <span className="text-sm">Clear {option.label}</span>
              </button>
            ))}
          </div>
        </CollapsibleSection>
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

      <ProWaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
