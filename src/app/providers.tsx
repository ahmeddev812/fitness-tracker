"use client";

import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { LazyMotion, MotionConfig, domMax } from "framer-motion";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <LazyMotion features={domMax}>
          <MotionConfig reducedMotion="user">
            <SubscriptionProvider>
              <ToastProvider>{children}</ToastProvider>
            </SubscriptionProvider>
          </MotionConfig>
        </LazyMotion>
      </NextThemesProvider>
    </ClerkProvider>
  );
}
