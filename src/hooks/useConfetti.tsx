"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "pulse-confetti-seen";

const COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "#ffffff",
  "var(--color-success)",
  "var(--color-warning)",
];

const PIECES = 48;
const DURATION_MS = 1400;

type Piece = {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  height: number;
  rotate: number;
  delay: number;
};

function canFire(): boolean {
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return false;
    sessionStorage.setItem(STORAGE_KEY, "1");
    return true;
  } catch {
    return true;
  }
}

function buildPieces(): Piece[] {
  return Array.from({ length: PIECES }, (_, i) => {
    const angle = (Math.PI * 2 * i) / PIECES + (Math.random() - 0.5) * 0.6;
    const dist = 80 + Math.random() * 180;
    const size = 6 + Math.random() * 6;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 40,
      color: COLORS[i % COLORS.length],
      size,
      height: size * (0.6 + Math.random() * 0.8),
      rotate: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.12,
    };
  });
}

export function useConfettiBurst() {
  const [pieces, setPieces] = useState<Piece[] | null>(null);

  const fire = () => {
    if (prefersReduced()) return;
    if (!canFire()) return;
    setPieces(buildPieces());
    window.setTimeout(() => setPieces(null), DURATION_MS + 300);
  };

  const overlay = (
    <AnimatePresence>
      {pieces && (
        <m.div
          key="confetti"
          className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
          aria-hidden="true"
          exit={{ opacity: 0 }}
        >
          {pieces.map((p) => (
            <m.span
              key={p.id}
              className="absolute left-1/2 top-1/2 block rounded-[1px]"
              style={{
                width: p.size,
                height: p.height,
                background: p.color,
              }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
              animate={{
                x: p.x,
                y: p.y + 220,
                opacity: [1, 1, 0],
                rotate: p.rotate,
                scale: [1, 1.1, 0.7],
              }}
              transition={{
                duration: DURATION_MS / 1000,
                delay: p.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
          <m.div
            className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0.7, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </m.div>
      )}
    </AnimatePresence>
  );

  return { fireConfetti: fire, confetti: overlay };
}

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
