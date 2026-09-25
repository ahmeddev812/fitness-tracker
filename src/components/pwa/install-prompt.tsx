"use client";

import { useEffect } from "react";

/**
 * Deferred install prompt — global owner of `beforeinstallprompt`.
 *
 * The DownloadSection's Install button dispatches a `pulse-install-request`
 * cue; this component owns the captured prompt event and calls `.prompt()`
 * on it (must happen synchronously inside the click's user gesture, so the
 * listener lives on window and runs during dispatch).
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstallPromptEvent | null = null;

export function InstallPrompt() {
  useEffect(() => {
    const onPrompt = (e: Event) => {
      // Defer the native mini-infobar and keep the event for our own button.
      e.preventDefault();
      deferred = e as BeforeInstallPromptEvent;
    };

    const onRequest = () => {
      if (!deferred) return;
      const evt = deferred;
      deferred = null;
      evt.prompt().catch(() => {
        /* prompt rejected — user can retry from the browser menu */
      });
      evt.userChoice
        .then((choice) => {
          if (choice.outcome === "dismissed") deferred = null;
        })
        .catch(() => {
          /* ignore */
        });
    };

    const onInstalled = () => {
      deferred = null;
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("pulse-install-request", onRequest);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("pulse-install-request", onRequest);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return null;
}
