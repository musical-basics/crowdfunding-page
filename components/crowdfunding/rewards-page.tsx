"use client"

import { useCampaign } from "@/context/campaign-context"
import { Button } from "@/components/ui/button"

export function RewardsPage() {
  const { campaign, selectReward } = useCampaign()

  // Helper to determine if a reward is active
  const isAvailable = (reward: any) => !reward.isSoldOut

  if (!campaign) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Select a Reward</h2>

      <div className="grid grid-cols-1 gap-6">
        {campaign.rewards.map((reward) => (
          <div
            key={reward.id}
            className={`
              relative overflow-hidden rounded-2xl p-8 transition-all duration-300 group
              ${isAvailable(reward)
                ? "bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1"
                : "bg-slate-100 opacity-60 grayscale border border-slate-200 cursor-not-allowed"}
            `}
          >
            {/* Add a colored accent bar at the top */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${isAvailable(reward) ? "bg-primary" : "bg-gray-300"}`} />
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{reward.title}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-emerald-600">${reward.price}</span>
                  {reward.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${reward.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <Button
                disabled={!isAvailable(reward)}
                onClick={() => selectReward(reward.id)}
                className={isAvailable(reward) ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
              >
                {isAvailable(reward) ? "Select Reward" : "Sold Out"}
              </Button>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6">{reward.description}</p>

            {/* Includes */}
            <div className="space-y-2 mb-6">
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Includes:</p>
              <ul className="text-sm space-y-1">
                {reward.itemsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Stats */}
            <div className="flex gap-6 text-xs text-muted-foreground border-t border-border pt-4">
              <div>
                <span className="font-semibold text-foreground block">{reward.backersCount}</span>
                backers
              </div>
              <div>
                <span className="font-semibold text-foreground block">{reward.estimatedDelivery}</span>
                estimated delivery
              </div>
              <div>
                <span className="font-semibold text-foreground block">
                  {reward.shipsTo.length > 1 ? "Worldwide" : reward.shipsTo[0]}
                </span>
                ships to
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
