"use client"

import { useRef, useEffect, Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { SuccessBanner } from "./crowdfunding/success-banner"
import { ProjectHeader } from "./crowdfunding/project-header"
import { HeroSection } from "./crowdfunding/hero-section"
import { StatsPanel } from "./crowdfunding/stats-panel"
import { NavigationTabs } from "./crowdfunding/navigation-tabs"
import { CampaignPage } from "./crowdfunding/campaign-page"
import { RewardsPage } from "./crowdfunding/rewards-page"
import { CreatorPage } from "./crowdfunding/creator-page"
import { FAQPage } from "./crowdfunding/faq-page"
import { SectionPlaceholder } from "./crowdfunding/section-placeholder"

// We split the logic into a sub-component because useSearchParams requires Suspense boundary
function CrowdfundingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)

  // Default to 'campaign' if no tab is in the URL
  const activeTab = searchParams.get("tab") || "campaign"

  const handleTabChange = (tabId: string) => {
    // 1. Update the URL without reloading the page
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tabId)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })

    // 2. Scroll logic (optional: only scroll if nav is out of view)
    // We use a small timeout to ensure the UI updates first
    setTimeout(() => {
      navRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <ProjectHeader />

      <div id="section-1" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <HeroSection />
        </div>
        <div className="lg:col-span-1">
          <StatsPanel />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div ref={navRef} className="scroll-mt-4 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Dynamic Content Section */}
      <div id="content-section">
        <section className="mt-8 pt-8 border-t border-border min-h-[500px]">
          {activeTab === "campaign" && <CampaignPage />}
          {activeTab === "rewards" && <RewardsPage />}
          {activeTab === "creator" && <CreatorPage />}
          {activeTab === "faq" && <FAQPage />}
          {activeTab === "updates" && <SectionPlaceholder title="Updates" />}
          {activeTab === "comments" && <SectionPlaceholder title="Comments" />}
          {activeTab === "community" && <SectionPlaceholder title="Community" />}
        </section>
      </div>
    </main>
  )
}

export function CrowdfundingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SuccessBanner />
      <Suspense fallback={<div className="h-screen" />}>
        <CrowdfundingContent />
      </Suspense>
    </div>
  )
}
