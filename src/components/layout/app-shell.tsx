"use client";

import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { TopBar } from "./topbar";
import { KeyboardShortcutsHelp } from "@/components/keyboard/keyboard-shortcuts-help";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient gradient orbs — background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
      >
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/15" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[120px] dark:bg-accent/10" />
        <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-info/10 blur-[120px] dark:bg-info/8" />
      </div>

      {/* Mobile top bar */}
      <TopBar />

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <m.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
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