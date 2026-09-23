"use client";

import { useContext } from "react";
import { FitnessDataContext, FitnessActionsContext } from "@/context/FitnessDataProvider";

export function useFitnessData() {
  const data = useContext(FitnessDataContext);
  if (!data) {
    throw new Error("useFitnessData must be used within a FitnessDataProvider");
  }
  return data;
}

export function useFitnessActions() {
  const actions = useContext(FitnessActionsContext);
  if (!actions) {
    throw new Error("useFitnessActions must be used within a FitnessDataProvider");
  }
  return actions;
}