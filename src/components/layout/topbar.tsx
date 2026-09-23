"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GlobalSearch } from "@/components/search/global-search";
import { PulseLogo } from "@/components/brand/pulse-logo";

export function TopBar() {
  return (
    <m.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="lg:hidden sticky top-0 z-40 glass-strong border-b border-border/60"
    >
      <div className="flex items-center justify-between h-16 px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 group" aria-label="PULSE home">
          <PulseLogo size="md" />
        </Link>

        <div className="flex items-center gap-2">
          <GlobalSearch />
          <ThemeToggle />
          <Link
            href="/profile"
            aria-label="Profile"
            className="h-9 w-9 rounded-lg glass hover:bg-accent/10 transition-colors flex items-center justify-center"
          >
            <User className="h-4 w-4 text-foreground" />
          </Link>
        </div>
      </div>
    </m.header>
  );
}
