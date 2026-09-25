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
  setLocalPlan: (plan: "free" | "pro") => void;
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

const PLAN_KEY = "fitness_plan";

function readLocalPlan(): "free" | "pro" {
  if (typeof window === "undefined") return "free";
  try {
    return window.localStorage.getItem(PLAN_KEY) === "pro" ? "pro" : "free";
  } catch {
    return "free";
  }
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

/**
 * Plan state is purely local marketing metadata (fitness_plan = free | pro).
 * No Stripe / payment integration in this flow.
 */
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [localPlan, setLocalPlanState] = useState<"free" | "pro">("free");
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setLocalPlanState("free");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const handle = window.setTimeout(() => {
      setLocalPlanState(readLocalPlan());
      setIsLoading(false);
    }, 0);
    return () => window.clearTimeout(handle);
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    const handle = window.setTimeout(() => {
      setLocalPlanState(readLocalPlan());
      setIsLoading(false);
    }, 0);
    return () => window.clearTimeout(handle);
  }, [authLoading, isAuthenticated]);

  const setLocalPlan = useCallback((plan: "free" | "pro") => {
    setLocalPlanState(plan);
    try {
      window.localStorage.setItem(PLAN_KEY, plan);
    } catch {
      // ignore
    }
  }, []);

  const openPortal = useCallback(async () => {
    // No payment provider — Pro is marketing only
    throw new Error("Billing is not available yet. Pro is coming soon.");
  }, []);

  const status = useMemo<SubscriptionStatus>(() => {
    if (localPlan === "pro") {
      return {
        ...FREE,
        plan: "pro_monthly",
        planLabel: "Pro",
        isActive: true,
        status: "active",
      };
    }
    return FREE;
  }, [localPlan]);

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      ...status,
      isLoading: authLoading || isLoading,
      error,
      refresh: async () => {
        await refresh();
      },
      openPortal,
      setLocalPlan,
    }),
    [status, authLoading, isLoading, error, refresh, openPortal, setLocalPlan]
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
