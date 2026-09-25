"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import * as storage from "@/lib/storage";
import { PulseLogo } from "@/components/brand/pulse-logo";
import { Skeleton } from "@/components/ui/skeleton";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    nav.standalone === true
  );
}

function hasCompleteProfile(): boolean {
  try {
    const profile = storage.getProfile();
    return Boolean(profile.name && profile.age);
  } catch {
    return false;
  }
}

const HOLD_MS = 1200;

/**
 * Full-screen splash — standalone installs only.
 * After hold: auth state → /login | /onboarding | /dashboard
 */
export function SplashScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!isStandalone()) return;
    const handle = window.setTimeout(() => {
      setVisible(true);
    }, 0);
    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => {
    if (!visible || isLoading) return;

    const hold = window.setTimeout(() => {
      if (!isAuthenticated) {
        setExiting(true);
        window.setTimeout(() => {
          router.replace("/login");
        }, 280);
        return;
      }
      if (!hasCompleteProfile()) {
        setExiting(true);
        window.setTimeout(() => {
          router.replace("/onboarding");
        }, 280);
        return;
      }
      setExiting(true);
      window.setTimeout(() => {
        router.replace("/dashboard");
      }, 280);
    }, HOLD_MS);

    return () => window.clearTimeout(hold);
  }, [visible, isLoading, isAuthenticated, router, pathname]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-300 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading PULSE"
    >
      <div className="flex flex-col items-center gap-6">
        <PulseLogo size="lg" />
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary">
            Every beat counts
          </p>
          <Skeleton className="h-1 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}
