"use client";

import { memo } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import { getGreeting, formatDisplayDate, todayKey } from "@/lib/dates";
import Link from "next/link";
import { User, Flame } from "lucide-react";
import { m } from "framer-motion";

function DashboardHeaderImpl() {
  const { profile, isHydrated } = useFitnessData();

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

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {profile.name ? `${greeting}, ${profile.name}` : greeting}
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
        </div>
        <p className="text-sm text-muted-foreground mt-1">{today}</p>
        {!profile.name && (
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
        aria-label="Profile"
        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
      >
        <User className="h-5 w-5" />
      </Link>
    </m.div>
  );
}

export const DashboardHeader = memo(DashboardHeaderImpl);
DashboardHeader.displayName = "DashboardHeader";
