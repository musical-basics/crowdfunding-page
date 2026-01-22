"use client"

import { Button } from "@/components/ui/button"
import { Bookmark, Facebook, Twitter, Share2 } from "lucide-react"
import { useCampaign } from "@/context/campaign-context"
import { useRouter, useSearchParams } from "next/navigation" // <--- Added imports

export function StatsPanel() {
  const { totalPledged, backersCount, campaign } = useCampaign()
  const router = useRouter() // <--- Initialize router
  const searchParams = useSearchParams()

  // Calculate dynamic progress
  const progressPercentage = Math.min(
    (totalPledged / campaign.stats.goalAmount) * 100,
    100
  )

  // Format currency
  const formattedPledged = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalPledged)

  const formattedGoal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(campaign.stats.goalAmount)

  // --- NEW HANDLER ---
  const handleBackProject = () => {
    // 1. Update URL to switch tab to 'rewards'
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", "rewards")
    router.push(`?${params.toString()}`, { scroll: false })

    // 2. Smooth scroll to the anchor we created earlier
    // We use a tiny timeout to allow the Rewards tab to render first
    setTimeout(() => {
      const rewardsAnchor = document.getElementById("rewards-section-anchor")
      if (rewardsAnchor) {
        rewardsAnchor.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Funding Amount */}
      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-foreground">{formattedPledged}</p>
          <span className="text-sm text-muted-foreground">pledged of {formattedGoal} goal</span>
        </div>
      </div>

      {/* Backers */}
      <div>
        <p className="text-2xl font-semibold text-foreground">{backersCount}</p>
        <p className="text-sm text-muted-foreground">backers</p>
      </div>

      {/* Days Left */}
      <div>
        <p className="text-2xl font-semibold text-foreground">{campaign.stats.daysLeft}</p>
        <p className="text-sm text-muted-foreground">days to go</p>
      </div>

      {/* CTA Button - NOW CONNECTED */}
      <Button
        onClick={handleBackProject} // <--- Added click handler
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-lg"
      >
        Back this project
      </Button>

      {/* Secondary Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" className="flex-1 gap-2 bg-transparent">
          <Bookmark className="h-4 w-4" />
          Remind me
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-blue-600">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-sky-500">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        All or nothing. This project will only be funded if it reaches its goal by {new Date().toLocaleDateString()}.
      </p>
    </div>
  )
}
