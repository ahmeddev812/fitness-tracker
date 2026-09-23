"use client";

import { useEffect, type RefObject } from "react";

const STRENGTH = 0.35;
const MAX_SHIFT = 14;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isFinePointer() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches
  );
}

export function useMagnetic(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion() || !isFinePointer()) return;

    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>('[data-magnetic="true"]')
    );
    if (nodes.length === 0) return;

    const cleanups: Array<() => void> = [];

    for (const el of nodes) {
      let frame = 0;

      const reset = () => {
        cancelAnimationFrame(frame);
        el.style.transform = "";
        el.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
      };

      const onMove = (e: MouseEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          const tx = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, dx * STRENGTH));
          const ty = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, dy * STRENGTH));
          el.style.transition = "transform 0.08s linear";
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        });
      };

      const onLeave = () => {
        reset();
      };

      el.addEventListener("mouseenter", () => {
        el.addEventListener("mousemove", onMove);
      });
      el.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        cancelAnimationFrame(frame);
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        reset();
      });
    }

    return () => {
      for (const fn of cleanups) fn();
    };
  }, [containerRef]);
}
