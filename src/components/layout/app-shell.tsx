"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { TopBar } from "./topbar";

const KeyboardShortcutsHelp = dynamic(
  () =>
    import("@/components/keyboard/keyboard-shortcuts-help").then(
      (mod) => mod.KeyboardShortcutsHelp,
    ),
  { loading: () => null },
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient gradient orbs — cheap radial fills (no large blur) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
      >
        <div
          className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full opacity-70 dark:opacity-50"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 28%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 -right-28 h-[360px] w-[360px] rounded-full opacity-60 dark:opacity-45"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-28 left-1/3 h-[360px] w-[360px] rounded-full opacity-50 dark:opacity-40"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-info) 18%, transparent) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Mobile top bar */}
      <TopBar />

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {children}
              </m.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Keyboard shortcuts help */}
      <KeyboardShortcutsHelp />
    </div>
  );
}