"use client";

import { useEffect, useState } from "react";
import { Share, Plus, X, Smartphone } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "pulse_ios_install_dismissed";

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    nav.standalone === true
  );
}

export function IosInstallModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isIos() || isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // storage unavailable
    }
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={dismiss}
      title="Install PULSE on your iPhone"
      description="Add PULSE to your Home Screen for a full-screen, app-like experience."
      className="max-w-md"
    >
      <div className="space-y-4">
        <ol className="space-y-3">
          <li className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Share className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Tap Share</p>
              <p className="text-xs text-muted-foreground">
                The Share icon in the Safari toolbar
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Add to Home Screen
              </p>
              <p className="text-xs text-muted-foreground">
                Scroll the share sheet and select it
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Smartphone className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Tap Add</p>
              <p className="text-xs text-muted-foreground">
                PULSE appears on your Home Screen
              </p>
            </div>
          </li>
        </ol>

        <div className="flex gap-3">
          <Button type="button" variant="gradient" className="flex-1" onClick={dismiss}>
            Got it
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={dismiss}
            aria-label="Dismiss install instructions"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
