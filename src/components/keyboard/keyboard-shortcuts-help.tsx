"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Keyboard } from "lucide-react";

const SHORTCUTS = [
  { keys: ["G", "D"], description: "Go to Dashboard" },
  { keys: ["G", "W"], description: "Go to Workouts" },
  { keys: ["G", "N"], description: "Go to Nutrition" },
  { keys: ["G", "H"], description: "Go to Water" },
  { keys: ["G", "P"], description: "Go to Progress" },
  { keys: ["G", "O"], description: "Go to Goals" },
  { keys: ["G", "F"], description: "Go to Profile" },
  { keys: ["G", "A"], description: "Go to Analytics" },
  { keys: ["/"], description: "Search" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["Esc"], description: "Close dialog" },
  { keys: ["T"], description: "Toggle theme" },
];

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable
    ) return;

    if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setOpen((prev) => !prev);
      return;
    }

    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      return;
    }

    if (pendingKey === null) {
      if (e.key.toLowerCase() === "g") {
        setPendingKey("g");
        return;
      }
      if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        document.documentElement.classList.toggle("dark");
        return;
      }
    }

    if (pendingKey === "g") {
      const routes: Record<string, string> = {
        d: "/dashboard",
        w: "/workouts",
        n: "/nutrition",
        h: "/water",
        p: "/progress",
        o: "/goals",
        f: "/profile",
        a: "/analytics",
      };
      const route = routes[e.key.toLowerCase()];
      if (route) {
        window.location.href = route;
      }
      setPendingKey(null);
    }
  }, [open, pendingKey]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {SHORTCUTS.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, j) => (
                  <span key={j}>
                    <kbd className="px-2 py-0.5 text-xs font-mono bg-muted rounded border border-border">{key}</kbd>
                    {j < shortcut.keys.length - 1 && <span className="text-muted-foreground mx-0.5">+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
