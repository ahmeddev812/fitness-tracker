"use client";

import dynamic from "next/dynamic";

const loading = () => null;

export const WorkoutSimulatorSection = dynamic(
  () =>
    import("./workout-simulator-section").then(
      (mod) => mod.WorkoutSimulatorSection,
    ),
  { loading },
);

export const FeaturesSection = dynamic(
  () => import("./features-section").then((mod) => mod.FeaturesSection),
  { loading },
);

export const TimelineSection = dynamic(
  () => import("./timeline-section").then((mod) => mod.TimelineSection),
  { loading },
);

export const TestimonialsSection = dynamic(
  () => import("./testimonials-section").then((mod) => mod.TestimonialsSection),
  { loading },
);

export const PricingSection = dynamic(
  () => import("./pricing-section").then((mod) => mod.PricingSection),
  { loading },
);

export const FaqSection = dynamic(
  () => import("./faq-section").then((mod) => mod.FaqSection),
  { loading },
);

export const CtaSection = dynamic(
  () => import("./cta-section").then((mod) => mod.CtaSection),
  { loading },
);

export const Footer = dynamic(
  () => import("./footer").then((mod) => mod.Footer),
  { loading },
);
