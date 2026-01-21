"use client"

import { useState } from "react"
import { SuccessBanner } from "@/components/crowdfunding/success-banner"
import { ProjectHeader } from "@/components/crowdfunding/project-header"
import { NavigationTabs } from "@/components/crowdfunding/navigation-tabs"
import { CampaignPage } from "@/components/crowdfunding/campaign-page"

export default function Campaign() {
  const [activeTab, setActiveTab] = useState("campaign")

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <SuccessBanner />
        <ProjectHeader />
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-8">
          <CampaignPage />
        </div>
      </div>
    </main>
  )
}
