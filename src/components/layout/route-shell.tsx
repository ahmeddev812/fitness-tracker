"use client";

import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AppShell } from "./app-shell";

const APP_ROUTES = [
  "/dashboard",
  "/workouts",
  "/nutrition",
  "/water",
  "/progress",
  "/analytics",
  "/goals",
  "/profile",
];

function isAppRoute(pathname: string): boolean {
  return APP_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export function RouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      {isAppRoute(pathname) ? (
        <AppShell>{children}</AppShell>
      ) : (
        <>{children}</>
      )}
    </AuthGuard>
  );
}
