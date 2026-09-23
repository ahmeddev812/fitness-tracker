"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { FitnessDataProvider } from "@/context/FitnessDataProvider";
import { AccessibilityProvider } from "@/components/pwa/accessibility-provider";

const AppShell = dynamic(
  () => import("./app-shell").then((mod) => mod.AppShell),
  { loading: () => null },
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
