"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    nav.standalone === true
  );
}

/**
 * In standalone (installed) mode, never show the marketing landing page.
 * Root `/` immediately forwards into the app entry flow.
 */
export function AppRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isStandalone()) return;
    if (pathname !== "/") return;
    const handle = window.setTimeout(() => {
      router.replace("/login");
    }, 0);
    return () => window.clearTimeout(handle);
  }, [pathname, router]);

  return null;
}
