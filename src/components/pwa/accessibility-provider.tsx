"use client";

import { useEffect } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { settings, isHydrated } = useFitnessData();

  useEffect(() => {
    if (!isHydrated) return;
    const root = document.documentElement;

    root.style.setProperty(
      "--font-scale",
      settings.fontSize === "lg" ? "1.125" : settings.fontSize === "sm" ? "0.875" : "1"
    );

    if (settings.reduceMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [settings.fontSize, settings.reduceMotion, settings.highContrast, isHydrated]);

  return <>{children}</>;
}
