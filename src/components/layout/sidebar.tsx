"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import {
  Home,
  Dumbbell,
  Apple,
  Droplets,
  TrendingUp,
  Target,
  BarChart3,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GlobalSearch } from "@/components/search/global-search";
import { PulseLogo } from "@/components/brand/pulse-logo";

const MAIN_NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: Home },
  { href: "/workouts", label: "Workouts", Icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", Icon: Apple },
  { href: "/water", label: "Water", Icon: Droplets },
  { href: "/progress", label: "Progress", Icon: TrendingUp },
  { href: "/analytics", label: "Analytics", Icon: BarChart3 },
  { href: "/goals", label: "Goals", Icon: Target },
] as const;

const ACCOUNT_NAV = [
  { href: "/profile", label: "Profile", Icon: User },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || (href === "/dashboard" && pathname === "/");
  }

  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 glass-strong border-r border-border/60 z-40"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border/60">
        <Link href="/dashboard" aria-label="PULSE home">
          <PulseLogo size="md" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {/* Main section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Menu
          </p>
          {MAIN_NAV.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
                ].join(" ")}
              >
                {/* Active background + glow */}
                {active && (
                  <>
                    <m.span
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                    <m.span
                      layoutId="sidebar-active-bar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full gradient-primary shadow-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  </>
                )}

                <Icon
                  className={[
                    "relative h-4.5 w-4.5 transition-transform duration-200",
                    active ? "" : "group-hover:scale-110",
                  ].join(" ")}
                  strokeWidth={active ? 2.5 : 2}
                  aria-hidden="true"
                />
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Account section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Account
          </p>
          {ACCOUNT_NAV.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
                ].join(" ")}
              >
                {active && (
                  <>
                    <m.span
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                    <m.span
                      layoutId="sidebar-active-bar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full gradient-primary shadow-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  </>
                )}
                <Icon
                  className={[
                    "relative h-4.5 w-4.5 transition-transform duration-200",
                    active ? "" : "group-hover:scale-110",
                  ].join(" ")}
                  strokeWidth={active ? 2.5 : 2}
                  aria-hidden="true"
                />
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer with theme toggle + search */}
      <div className="p-3 border-t border-border/60">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <GlobalSearch />
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}