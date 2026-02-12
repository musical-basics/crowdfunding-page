"use client"

import { useCampaign } from "@/context/campaign-context"

export function ProjectHeader() {
  const { campaign } = useCampaign()

  if (!campaign) return null

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-5xl font-extrabold text-foreground text-balance tracking-tight">
        {campaign.title}
      </h1>
      <p className="text-md md:text-xl text-muted-foreground mt-3 max-w-3xl mx-auto">
        {campaign.subtitle}
      </p>

      {/* NEW: Sold Out Announcement Banner */}
      <div className="max-w-4xl mx-auto py-6 px-4 bg-muted/30 rounded-xl border border-dashed border-border/60">
        <p className="text-lg md:text-xl font-bold text-foreground leading-relaxed">
          *** Important note: We are sold out for the Summer 2026 batch.
          <br className="hidden md:block" />
          We are now accepting reservations for the End of Year batch. ***
        </p>
      </div>
    </div>
  )
}
