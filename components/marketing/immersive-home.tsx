"use client"

import { AmbientField } from "./landing/ambient-field"
import { AuditConsole } from "./landing/audit-console"
import { CtaSection } from "./landing/cta-section"
import { HeroSection } from "./landing/hero-section"
import { IntegrationMatrix } from "./landing/integration-matrix"
import { LandingFooter } from "./landing/landing-footer"
import { LandingHeader } from "./landing/landing-header"
import { useRunPhase } from "./landing/hooks"
import { StoryPanel } from "./landing/story-panel"

export function ImmersiveHome() {
  const phase = useRunPhase()

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#030512] text-white selection:bg-cyan-200/30 selection:text-white">
      <a
        href="#simulation"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:outline-none"
      >
        Skip to main content
      </a>

      <AmbientField />

      <section className="relative mx-auto flex min-h-svh w-full max-w-[118rem] flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <LandingHeader />
        <HeroSection phase={phase} />
      </section>

      <div id="integrations">
        <StoryPanel />
        <IntegrationMatrix />
      </div>

      <div id="audit">
        <AuditConsole />
      </div>

      <CtaSection />
      <LandingFooter />
    </main>
  )
}
