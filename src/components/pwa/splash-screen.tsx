"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

/** Auth entry pages — never bounce a user away from these. */
function isAuthEntryPage(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/sso-callback"
  );
}

const HOLD_MS = 1200;

/**
 * Full-screen splash — standalone installs only.
 * Runs ONCE per app cold start: after hold, route by auth state
 * (/login | /onboarding | /dashboard). Never re-fires on client-side
 * navigation — otherwise /signup in the PWA bounced back to /login.
 */
export function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isStandalone()) return;
    const handle = window.setTimeout(() => {
      setVisible(true);
    }, 0);
    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => {
    if (!visible || isLoading || completedRef.current) return;

    const hold = window.setTimeout(() => {
      // Gate has run — never schedule it again for this app session.
      completedRef.current = true;

      const finish = (to?: string) => {
        setExiting(true);
        window.setTimeout(() => {
          if (to) router.replace(to);
          setVisible(false);
        }, 280);
      };

      if (!isAuthenticated) {
        // Stay put when the user is already on an auth page (e.g. /signup).
        const here = window.location.pathname;
        finish(isAuthEntryPage(here) ? undefined : "/login");
        return;
      }
      if (!hasCompleteProfile()) {
        finish("/onboarding");
        return;
      }
      finish("/dashboard");
    }, HOLD_MS);

    return () => window.clearTimeout(hold);
  }, [visible, isLoading, isAuthenticated, router]);

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
