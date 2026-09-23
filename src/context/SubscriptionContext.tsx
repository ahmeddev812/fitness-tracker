"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import type { SubscriptionStatus } from "@/types/billing";

interface SubscriptionContextValue extends SubscriptionStatus {
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  openPortal: () => Promise<void>;
}

const FREE: SubscriptionStatus = {
  plan: "free",
  planLabel: "Free",
  isActive: false,
  status: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  customerId: null,
  paymentMethods: [],
  hasPaymentMethod: false,
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>(FREE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setStatus(FREE);
      setIsLoading(false);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/status");
      const data = (await res.json()) as SubscriptionStatus & { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not load plan");
        setStatus(FREE);
      } else {
        setStatus(data);
      }
    } catch {
      setError("Could not load plan");
      setStatus(FREE);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    const handle = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(handle);
  }, [authLoading, refresh]);

  const openPortal = useCallback(async () => {
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not open billing portal");
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open billing portal");
      throw err;
    }
  }, []);

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      ...status,
      isLoading: authLoading || isLoading,
      error,
      refresh,
      openPortal,
    }),
    [status, authLoading, isLoading, error, refresh, openPortal]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return ctx;
}
