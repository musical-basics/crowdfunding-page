"use client"

import { useCampaign } from "@/context/campaign-context"

export function ProjectHeader() {
  const { campaign } = useCampaign()
  if (!campaign) return null

  return (
    <div className="text-center pt-8 pb-4">
      <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">
        The Founder's Batch
      </p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-foreground text-balance tracking-tight leading-tight">
        {campaign.title}
      </h1>
      <p className="text-base md:text-lg text-muted-foreground mt-6 max-w-2xl mx-auto font-sans leading-relaxed">
        {campaign.subtitle}
      </p>
    </div>
  )
}
