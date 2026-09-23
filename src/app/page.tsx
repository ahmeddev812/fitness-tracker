import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import {
  WorkoutSimulatorSection,
  FeaturesSection,
  TimelineSection,
  TestimonialsSection,
  PricingSection,
  FaqSection,
  CtaSection,
  Footer,
} from "@/components/landing/lazy-sections";
import { CursorGlow } from "@/components/landing/cursor-glow";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PULSE",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description:
    "PULSE is a workout, nutrition, and habit tracker. Every beat counts — log workouts, track macros, and build habits with real-time insights.",
  url: "https://pulse.fitness",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <LandingNav />
      <CursorGlow />
      <main>
        <HeroSection />
        <WorkoutSimulatorSection />
        <FeaturesSection />
        <TimelineSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
