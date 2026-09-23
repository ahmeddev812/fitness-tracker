"use client";

import { type ReactNode } from "react";
import { LazyMotion, MotionConfig, domMax } from "framer-motion";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { FitnessDataProvider } from "@/context/FitnessDataProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { AccessibilityProvider } from "@/components/pwa/accessibility-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LazyMotion features={domMax}>
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <FitnessDataProvider>
              <AccessibilityProvider>
                <ToastProvider>{children}</ToastProvider>
              </AccessibilityProvider>
            </FitnessDataProvider>
          </AuthProvider>
        </MotionConfig>
      </LazyMotion>
    </NextThemesProvider>
  );
}
