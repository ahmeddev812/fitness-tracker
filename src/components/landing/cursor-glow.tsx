"use client";

import { useEffect, useRef } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";

const SIZE = 320;

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-SIZE);
  const y = useMotionValue(-SIZE);
  const sx = useSpring(x, { stiffness: 180, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 28, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce || !ref.current) return;

    let visible = false;

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX - SIZE / 2;
      const ny = e.clientY - SIZE / 2;
      x.set(nx);
      y.set(ny);
      if (!visible && ref.current) {
        visible = true;
        ref.current.style.opacity = "1";
      }
    };

    const onLeave = () => {
      if (ref.current) {
        visible = false;
        ref.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  return (
    <m.div
      ref={ref}
      className="pointer-events-none fixed z-[5] hidden md:block"
      style={{
        x: sx,
        y: sy,
        width: SIZE,
        height: SIZE,
        opacity: 0,
        transition: "opacity 0.4s ease",
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    >
      <div
        className="h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 35%, transparent) 0%, color-mix(in srgb, var(--color-accent) 18%, transparent) 35%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </m.div>
  );
}
