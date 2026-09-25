"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { Download, Smartphone, Monitor, Share, Plus, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

function getPlatform(): "ios" | "android" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    nav.standalone === true
  );
}

export function DownloadSection() {
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");
  const [standalone, setStandalone] = useState(true);
  const [canInstall, setCanInstall] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setPlatform(getPlatform());
      setStandalone(isStandalone());
    }, 0);

    const onPrompt = () => setCanInstall(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => {
      window.clearTimeout(handle);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (platform === "ios") {
      toast("Tap Share then Add to Home Screen", "info");
      return;
    }
    if (canInstall) {
      // Chrome/Edge install prompt is fired from a global event — dispatch a custom cue
      window.dispatchEvent(new CustomEvent("pulse-install-request"));
      return;
    }
    toast("Use your browser menu to install PULSE", "info");
  };

  if (standalone) return null;

  const steps =
    platform === "ios"
      ? [
          { icon: Share, text: "Tap the Share button in Safari" },
          { icon: Plus, text: 'Choose "Add to Home Screen"' },
          { icon: Smartphone, text: "Tap Add — PULSE is installed" },
        ]
      : platform === "android"
        ? [
            { icon: Wifi, text: "Open PULSE in Chrome" },
            { icon: Download, text: "Tap Install / Add to Home screen" },
            { icon: Smartphone, text: "Launch from your home screen" },
          ]
        : [
            { icon: Monitor, text: "Open PULSE in Chrome or Edge" },
            { icon: Download, text: "Click the install icon in the address bar" },
            { icon: Smartphone, text: "Launch from your desktop" },
          ];

  return (
    <section id="download" className="py-24 relative" aria-labelledby="download-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="mb-3 gap-1" variant="default">
            <Download className="h-3 w-3" aria-hidden="true" />
            Install PULSE
          </Badge>
          <h2
            id="download-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"
          >
            Take PULSE <span className="gradient-text">everywhere</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Install the app for a fast, full-screen experience — works offline,
            launches from your home screen, no app store required.
          </p>
        </m.div>

        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <m.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {steps.map((step, i) => (
              <div
                key={step.text}
                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/60 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary text-white shadow-glow">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Step {i + 1}
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">{step.text}</p>
                </div>
              </div>
            ))}
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-6 rounded-3xl border border-border/60 bg-card/60 p-10 text-center"
          >
            <div className="h-24 w-24 rounded-3xl gradient-primary shadow-glow flex items-center justify-center">
              <span className="text-4xl font-black text-white" aria-hidden="true">
                P
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">PULSE Fitness Tracker</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Free · Local-first · No ads
              </p>
            </div>
            <Button
              type="button"
              variant="gradient"
              size="lg"
              className="w-full max-w-xs"
              onClick={handleInstall}
              aria-label="Install PULSE app"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
              Install App
            </Button>
            <p className="text-xs text-muted-foreground">
              {platform === "ios"
                ? "Recommended: Safari"
                : platform === "android"
                  ? "Recommended: Chrome"
                  : "Works in Chrome, Edge & Chromium browsers"}
            </p>
          </m.div>
        </div>
      </div>
    </section>
  );
}
