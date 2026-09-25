"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { useFitnessData } from "@/hooks/useFitnessData";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/context/SubscriptionContext";
import { getGreeting, formatDisplayDate, todayKey } from "@/lib/dates";
import { getLevel, calculateXp } from "@/lib/level";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Flame, Sparkles, Zap } from "lucide-react";
import { m } from "framer-motion";

function DashboardHeaderImpl() {
  const { profile, workouts, meals, water, weights, goals, personalRecords, isHydrated } =
    useFitnessData();
  const { user } = useAuth();
  const { plan, planLabel, isLoading: planLoading } = useSubscription();

  const level = useMemo(() => {
    const xp = calculateXp({ workouts, meals, water, weights, goals, personalRecords });
    return getLevel(xp).level;
  }, [workouts, meals, water, weights, goals, personalRecords]);

  if (!isHydrated) {
    return (
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-40 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
      </div>
    );
  }

  const greeting = getGreeting();
  const today = formatDisplayDate(todayKey());
  const streak = profile.currentStreak;
  const displayName = profile.name || user?.name || "";
  const isPaid = plan !== "free";

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-8 flex items-center justify-between gap-4"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {displayName ? `${greeting}, ${displayName}` : greeting}
          </h1>
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-500">
              <Flame className="h-3.5 w-3.5 fill-orange-500" aria-hidden="true" />
              {streak}d
            </span>
          )}
          <Badge variant="secondary" className="gap-1 px-2 py-0.5 text-[10px]">
            <Zap className="h-3 w-3 text-warning" aria-hidden="true" />
            Lv {level}
          </Badge>
          {isPaid && !planLoading && (
            <Badge variant="outline" className="gap-1 text-primary">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {planLabel}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{today}</p>
        {!displayName && (
          <Link
            href="/profile"
            className="mt-1 inline-block text-sm text-primary hover:underline"
          >
            Complete your profile
          </Link>
        )}
      </div>
      <Link
        href="/profile"
        aria-label="Open profile"
        className="flex shrink-0 items-center gap-3 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
      >
        <UserAvatar
          src={profile.avatar}
          clerkUrl={user?.imageUrl}
          name={displayName}
          size="md"
          className="border-2 border-border"
        />
      </Link>
    </m.div>
  );
}

export const DashboardHeader = memo(DashboardHeaderImpl);
DashboardHeader.displayName = "DashboardHeader";
