"use client";

import { useEffect, useState, useRef } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/context/SubscriptionContext";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { SettingsForm } from "@/components/profile/settings-form";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CreditCard,
  LogOut,
  Sparkles,
  Mail,
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
    status,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    paymentMethods,
    hasPaymentMethod,
    isLoading: planLoading,
    openPortal,
    refresh: refreshPlan,
  } = useSubscription();
  const { toast } = useToast();

  const [storageInfo, setStorageInfo] = useState(() => ({
    used: 0,
    total: 5 * 1024 * 1024,
    percent: 0,
  }));
  const [importing, setImporting] = useState(false);
  const [portalBusy, setPortalBusy] = useState(false);
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

  const handlePortal = async () => {
    setPortalBusy(true);
    try {
      await openPortal();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not open billing", "error");
    } finally {
      setPortalBusy(false);
    }
  };

  const handleUpgrade = async () => {
    setPortalBusy(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro", interval: "monthly" }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        toast(data.error || "Could not start checkout", "error");
        return;
      }
      window.location.assign(data.url);
    } catch {
      toast("Could not start checkout", "error");
    } finally {
      setPortalBusy(false);
    }
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

  const formatPeriodEnd = (iso: string | null): string => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
                  <UserAvatar
                    src={profile.avatar}
                    clerkUrl={user?.imageUrl}
                    name={displayName}
                    size="xl"
                    className="border-2 border-border"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                </button>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {displayName || "Your profile"}
                  </h2>
                  {user?.email && (
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5 truncate">
                      <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {user.email}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
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
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  Billing &amp; Payment
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void refreshPlan()}
                  disabled={planLoading}
                >
                  Refresh
                </Button>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-accent/30 mb-4">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                  <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">
                      {planLoading ? "Loading plan…" : planLabel}
                    </p>
                    {plan !== "free" && (
                      <Badge variant="gradient">{status || "active"}</Badge>
                    )}
                  </div>
                  {plan !== "free" && currentPeriodEnd && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {cancelAtPeriodEnd ? "Ends" : "Renews"}{" "}
                      {formatPeriodEnd(currentPeriodEnd)}
                    </p>
                  )}
                  {plan === "free" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Upgrade to Pro for advanced insights and priority support.
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Payment methods
                </p>
                {paymentMethods.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {hasPaymentMethod
                      ? "No saved cards."
                      : "No saved cards yet. Add one in the Stripe billing portal after upgrading."}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {paymentMethods.map((pm) => (
                      <li
                        key={pm.id}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border/60 bg-card text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span className="uppercase font-medium">{pm.brand}</span>
                          <span className="text-muted-foreground">•••• {pm.last4}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Exp {pm.expMonth}/{pm.expYear}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {plan === "free" ? (
                  <Button
                    variant="gradient"
                    onClick={() => void handleUpgrade()}
                    loading={portalBusy}
                    className="sm:flex-1"
                  >
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Upgrade to Pro
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => void handlePortal()}
                    loading={portalBusy}
                    className="sm:flex-1"
                  >
                    <CreditCard className="h-4 w-4 mr-1.5" />
                    Manage payment methods
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => void handleSignOut()}
                  className="sm:flex-1"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Sign out
                </Button>
              </div>
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
