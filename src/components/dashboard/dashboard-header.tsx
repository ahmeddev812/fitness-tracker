"use client";

import { memo } from "react";
import Link from "next/link";
import { useFitnessData } from "@/hooks/useFitnessData";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/context/SubscriptionContext";
import { getGreeting, formatDisplayDate, todayKey } from "@/lib/dates";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Flame, Sparkles } from "lucide-react";
import { m } from "framer-motion";

function DashboardHeaderImpl() {
  const { profile, isHydrated } = useFitnessData();
  const { user } = useAuth();
  const { plan, planLabel, isLoading: planLoading } = useSubscription();

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-between mb-8">
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
      className="flex items-center justify-between mb-8"
    >
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {displayName ? `${greeting}, ${displayName}` : greeting}
          </h1>
          {streak > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold glass-strong text-orange-400">
              <Flame className="h-4 w-4 fill-orange-400" />
              {streak}
              {profile.longestStreak > 1 && (
                <span className="text-xs text-muted-foreground ml-1">
                  / {profile.longestStreak} best
                </span>
              )}
            </span>
          )}
          {isPaid && !planLoading && (
            <Badge variant="gradient" className="gap-1 shadow-glow">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {planLabel}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {today}
          {user?.email ? ` · ${user.email}` : ""}
        </p>
        {!displayName && (
          <Link
            href="/profile"
            className="text-sm text-primary hover:underline mt-1 inline-block"
          >
            Complete your profile
          </Link>
        )}
      </div>
      <Link
        href="/profile"
        aria-label="Open profile"
        className="flex items-center gap-3 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
      >
        <span className="hidden sm:block text-right">
          <span className="block text-sm font-semibold text-foreground">
            {displayName || "Profile"}
          </span>
          <span className="block text-xs text-muted-foreground">
            {isPaid ? planLabel : "View profile"}
          </span>
        </span>
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
