"use client";

import { useTheme } from "next-themes";
import React from "react";

import { BentoHighlightsSection } from "@/components/landing/bento-highlights-section";
import { FeatureGridSection } from "@/components/landing/feature-grid-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { FloatingBrandIcons } from "@/components/landing/floating-brand-icons";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { UserFlowsSection } from "@/components/landing/user-flows-section";

export default function Page() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? resolvedTheme === "dark" : false;
  const logoSrc = isDarkMode ? "/logo-white.svg" : "/logo.svg";

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <LandingNav logoSrc={logoSrc} />
      <main>
        <LandingHero logoSrc={logoSrc} />
        <FloatingBrandIcons />
        <UserFlowsSection />
        <BentoHighlightsSection />
        <FeatureGridSection />
        <TestimonialsSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
