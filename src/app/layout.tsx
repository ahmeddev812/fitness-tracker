import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { RouteShell } from "@/components/layout/route-shell";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { InstallPrompt } from "@/components/pwa/install-prompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pulse.app"),
  title: {
    default: "PULSE — Every beat counts.",
    template: "%s | PULSE",
  },
  description:
    "Track workouts, nutrition, water, and progress. Free fitness tracker with beautiful dashboard.",
  manifest: "/manifest.json",
  applicationName: "PULSE",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PULSE",
  },
  openGraph: {
    title: "PULSE — Every beat counts.",
    description:
      "Track workouts, nutrition, water, and progress. Free fitness tracker with beautiful dashboard.",
    siteName: "PULSE",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PULSE — Every beat counts.",
    description:
      "Track workouts, nutrition, water, and progress. Free fitness tracker with beautiful dashboard.",
    images: ["/og-image.png"],
  },
  keywords: [
    "PULSE",
    "fitness tracker",
    "workout tracker",
    "nutrition",
    "water tracking",
    "progress",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6C5CE7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6C5CE7" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0f" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="PULSE" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="preconnect" href="https://assets.mixkit.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.mixkit.co" />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <ServiceWorkerRegistration />
          <InstallPrompt />
          <RouteShell>{children}</RouteShell>
        </Providers>
      </body>
    </html>
  );
}