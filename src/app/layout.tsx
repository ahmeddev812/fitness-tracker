import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { RouteShell } from "@/components/layout/route-shell";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";

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
    { media: "(prefers-color-scheme: light)", color: "#6c5ce7" },
    { media: "(prefers-color-scheme: dark)", color: "#6c5ce7" },
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
        <link rel="preconnect" href="https://assets.mixkit.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.mixkit.co" />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <ServiceWorkerRegistration />
          <RouteShell>{children}</RouteShell>
        </Providers>
      </body>
    </html>
  );
}