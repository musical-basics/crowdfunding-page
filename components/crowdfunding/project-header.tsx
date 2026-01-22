"use client"

import { useCampaign } from "@/context/campaign-context"

export function ProjectHeader() {
  const { campaign } = useCampaign()

  if (!campaign) return null

  return (
    <div className="text-center">
      <h1 className="text-xl md:text-2xl font-bold text-foreground text-balance">
        {campaign.title}
      </h1>
      <p className="text-sm text-muted-foreground mt-2">
        {campaign.subtitle}
      </p>
    </div>
  )
}
