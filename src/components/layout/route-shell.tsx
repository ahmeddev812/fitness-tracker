"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { FitnessDataProvider } from "@/context/FitnessDataProvider";
import { AccessibilityProvider } from "@/components/pwa/accessibility-provider";
import { Skeleton } from "@/components/ui/skeleton";

function AppShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-background" aria-busy="true" aria-label="Loading app">
      <div className="hidden md:flex flex-col w-64 border-r border-border/60 p-4 gap-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex-1 p-4 md:p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

const AppShell = dynamic(
  () => import("./app-shell").then((mod) => mod.AppShell),
  { loading: () => <AppShellSkeleton /> },
);

const APP_ROUTES = [
  "/dashboard",
  "/workouts",
  "/nutrition",
  "/water",
  "/progress",
  "/analytics",
  "/goals",
  "/profile",
  "/onboarding",
];

/** Routes that never need fitness storage / accessibility settings */
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/sso-callback",
  "/checkout",
];

function matches(pathname: string, routes: string[]): boolean {
  return routes.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

function isAppRoute(pathname: string): boolean {
  return matches(pathname, APP_ROUTES);
}

export function RouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const needsFitness = !matches(pathname, PUBLIC_ROUTES);

  let tree: React.ReactNode = children;

  if (isAppRoute(pathname)) {
    tree = <AppShell>{tree}</AppShell>;
  }

  if (needsFitness) {
    tree = (
      <FitnessDataProvider>
        <AccessibilityProvider>{tree}</AccessibilityProvider>
      </FitnessDataProvider>
    );
  }

  return <>{tree}</>;
}
