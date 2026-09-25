"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import * as storage from "@/lib/storage";

interface AuthGuardProps {
  children: ReactNode;
  /** Require a completed local profile (name + age). Onboarding itself sets false. */
  requireProfile?: boolean;
}

/**
 * Client-side route guard:
 * - Not signed in (Clerk) → /login
 * - Signed in + requireProfile + missing local profile → /onboarding
 * - Otherwise render children
 */
export function AuthGuard({ children, requireProfile = true }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const proceed = () => {
      if (!isSignedIn || !user) {
        router.replace("/login");
        return;
      }
      if (requireProfile && !storage.hasCompleteProfileForUser(user.id)) {
        router.replace("/onboarding");
        return;
      }
    };

    // Defer to avoid setState-during-render style races in React
    const handle = window.setTimeout(proceed, 0);
    return () => window.clearTimeout(handle);
  }, [isLoaded, isSignedIn, user, requireProfile, router, pathname]);

  if (!isLoaded || !isSignedIn || !user) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-live="polite"
        aria-label="Checking authentication"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (requireProfile && !storage.hasCompleteProfileForUser(user?.id)) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-live="polite"
        aria-label="Setting up your profile"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
