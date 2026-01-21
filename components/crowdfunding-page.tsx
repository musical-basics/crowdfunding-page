"use client"

import { useState, useRef, useEffect } from "react"
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

export function CrowdfundingPage() {
  const [activeTab, setActiveTab] = useState("campaign")
  const navRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // Scroll to nav section so nav bar stays at top
    setTimeout(() => {
      navRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  return (
    <div className="min-h-screen bg-background">
      <SuccessBanner />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <ProjectHeader />
        {/* Section 1: Always visible - Hero Image and Stats */}
        <div id="section-1" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <HeroSection />
          </div>
          <div className="lg:col-span-1">
            <StatsPanel />
          </div>
        </div>
        {/* Navigation Tabs - Always visible */}
        <div ref={navRef} className="scroll-mt-4">
          <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        
        {/* Content Area - Changes based on active tab */}
        <div id="content-section">
          <section className="mt-8 pt-8 border-t border-border">
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
    </div>
  )
}
