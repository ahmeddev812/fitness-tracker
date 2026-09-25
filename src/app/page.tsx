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
  DownloadSection,
  Footer,
} from "@/components/landing/lazy-sections";
import { CursorGlow } from "@/components/landing/cursor-glow";
import { AppRedirect } from "@/components/pwa/app-redirect";
import { IosInstallModal } from "@/components/landing/ios-install-modal";

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
      <AppRedirect />
      <IosInstallModal />
      <link
        rel="preload"
        as="image"
        href="https://assets.mixkit.co/videos/52112/52112-thumb-720-0.jpg"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <LandingNav />
      <CursorGlow />
      <main>
        <HeroSection />
        <DownloadSection />
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
