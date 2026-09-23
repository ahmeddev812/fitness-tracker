"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useMemo } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

export function useAuth(): AuthContextValue {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const user = useMemo<AuthUser | null>(() => {
    if (!clerkUser) return null;
    const email =
      clerkUser.primaryEmailAddress?.emailAddress ||
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      "";
    const name =
      clerkUser.fullName ||
      clerkUser.firstName ||
      clerkUser.username ||
      "User";
    return {
      id: clerkUser.id,
      email,
      name,
      imageUrl: clerkUser.imageUrl || undefined,
    };
  }, [clerkUser]);

  return {
    user,
    isLoading: !isLoaded,
    isAuthenticated: isLoaded && isSignedIn && user !== null,
    logout: () => signOut({ redirectUrl: "/" }),
  };
}
