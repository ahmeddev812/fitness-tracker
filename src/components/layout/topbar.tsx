"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { m } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PulseLogo } from "@/components/brand/pulse-logo";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/hooks/useAuth";
import { useFitnessData } from "@/hooks/useFitnessData";

const GlobalSearch = dynamic(
  () => import("@/components/search/global-search").then((mod) => mod.GlobalSearch),
  {
    loading: () => (
      <button
        type="button"
        disabled
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-muted-foreground border border-border/60 opacity-60"
        aria-hidden="true"
        tabIndex={-1}
      >
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    ),
  },
);

export function TopBar() {
  const { user } = useAuth();
  const { profile } = useFitnessData();
  const displayName = profile.name || user?.name || "";

  return (
    <m.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="lg:hidden sticky top-0 z-40 glass-strong border-b border-border/60"
    >
      <div className="flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="PULSE home">
          <PulseLogo size="md" />
        </Link>

        <div className="flex items-center gap-2">
          <GlobalSearch />
          <ThemeToggle />
          <Link
            href="/profile"
            aria-label={displayName ? `${displayName} — profile` : "Profile"}
            className="rounded-full glass hover:bg-accent/10 transition-colors flex items-center justify-center"
          >
            <UserAvatar
              src={profile.avatar}
              clerkUrl={user?.imageUrl}
              name={displayName}
              size="sm"
            />
          </Link>
        </div>
      </div>
    </m.header>
  );
}
