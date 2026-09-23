"use client";

import { useEffect, useState } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";

export function useDelayedLoad(delay = 300) {
  const { isHydrated } = useFitnessData();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    const timer = setTimeout(() => setShowContent(true), delay);
    return () => clearTimeout(timer);
  }, [isHydrated, delay]);

  return { isHydrated, showContent };
}
