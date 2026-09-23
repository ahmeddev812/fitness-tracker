"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import { Home, Dumbbell, Apple, Droplets, TrendingUp } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", Icon: Home },
  { href: "/workouts", label: "Workouts", Icon: Dumbbell },
  { href: "/nutrition", label: "Food", Icon: Apple },
  { href: "/water", label: "Water", Icon: Droplets },
  { href: "/progress", label: "Progress", Icon: TrendingUp },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || (href === "/dashboard" && pathname === "/");
  }

  return (
    <nav
      className="lg:hidden fixed inset-x-0 bottom-0 z-50 glass-strong border-t border-border/60 rounded-t-2xl shadow-premium"
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className="relative flex flex-col items-center justify-center gap-1 py-2 transition-colors"
              >
                {/* Active glow circle */}
                {active && (
                  <m.span
                    layoutId="mobile-active-glow"
                    className="absolute -top-0.5 h-12 w-12 rounded-2xl gradient-primary blur-xl opacity-40"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                {/* Icon wrapper */}
                <span className="relative flex items-center justify-center h-6 w-6">
                  {active && (
                    <m.span
                      layoutId="mobile-active-icon-bg"
                      className="absolute inset-0 rounded-lg gradient-primary shadow-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon
                    className={[
                      "relative h-4.5 w-4.5 transition-colors",
                      active
                        ? "text-white"
                        : "text-muted-foreground",
                    ].join(" ")}
                    strokeWidth={active ? 2.5 : 2}
                    aria-hidden="true"
                  />
                </span>

                {/* Label */}
                <span
                  className={[
                    "text-[10px] font-medium transition-colors",
                    active
                      ? "gradient-text"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}