"use client";

import { useEffect, useRef } from "react";
import { animate, m, useInView, useMotionValue, useTransform } from "framer-motion";

export interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => {
    const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US");
    return `${prefix}${n}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, value, duration, mv]);

  return (
    <m.span ref={ref} className={className}>
      {text}
    </m.span>
  );
}
