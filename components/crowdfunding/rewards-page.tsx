"use client"

import { useState } from "react"
import { useCampaign } from "@/context/campaign-context"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function RewardsPage() {
  const { campaign, selectReward, selectedRewardId } = useCampaign()
  const [activeTab, setActiveTab] = useState<'bundle' | 'keyboard_only'>('bundle')

  const isAvailable = (reward: any) => !reward.isSoldOut

  if (!campaign) {
    return <div className="font-sans text-muted-foreground text-center py-10">Loading...</div>
  }

  const filteredRewards = campaign.rewards.filter(
    r => r.isVisible && (r.rewardType || 'bundle') === activeTab
  )

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6 text-center md:text-left mb-10">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">Pre-Order Now</p>
        <h2 className="text-3xl md:text-4xl font-serif">Select a Reward</h2>
      </div>

      {/* Reward Type Tabs */}
      <div className="flex gap-6 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab('bundle')}
          className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-200 border-b-2 cursor-pointer ${activeTab === 'bundle' ? 'text-foreground border-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          Premium Bundle
        </button>
        <button
          onClick={() => setActiveTab('keyboard_only')}
          className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-200 border-b-2 cursor-pointer ${activeTab === 'keyboard_only' ? 'text-foreground border-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          Keyboard Only
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-6">
        {filteredRewards.map((reward) => {
          const isFeatured = reward.badgeType === 'featured' || reward.isFeatured
          const isMinPackage = reward.badgeType === 'minimum_package'
          return (
            <div
              key={reward.id}
              className={`
                relative flex flex-col p-8 md:p-10 transition-all duration-300 group border
                ${isAvailable(reward)
                  ? isFeatured
                    ? "bg-neutral-50/50 border-foreground shadow-xl z-10"
                    : "bg-white border-border hover:border-neutral-400 hover:shadow-lg"
                  : "bg-neutral-50 border-border opacity-80 cursor-not-allowed grayscale-[0.5]"} 
              `}
            >
              {/* Overlay / Badges */}
              {!isAvailable(reward) && (
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-foreground text-background font-bold text-[10px] px-4 py-1.5 uppercase tracking-widest">
                    Sold Out
                  </div>
                </div>
              )}
              {isFeatured && isAvailable(reward) && (
                <div className="absolute top-0 right-0 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 z-20">
                  MOST POPULAR
                </div>
              )}

              {/* Header */}
              <div className="mb-6 mt-2">
                <h3 className="text-2xl font-serif leading-tight text-foreground flex items-center gap-3">
                  {reward.title}
                </h3>
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-4xl font-serif text-foreground tracking-tight">${reward.price}</span>
                  {reward.originalPrice && (
                    <span className="text-sm font-sans text-muted-foreground line-through">
                      ${reward.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Reward Image */}
              {reward.imageUrl && (
                <div className="mb-8 aspect-video relative bg-neutral-100 border border-neutral-200 overflow-hidden">
                  <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 hover:scale-105" />
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-8 font-sans flex-grow">{reward.description}</p>

              {/* Includes */}
              {reward.itemsIncluded.length > 0 && (
                <div className="space-y-4 mb-8 bg-neutral-50/50 p-6 border border-neutral-100">
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Includes:</p>
                  <ul className="space-y-3 font-sans text-sm">
                    {reward.itemsIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs text-muted-foreground border-t border-border pt-6 font-sans">
                <div>
                  <span className="text-[9px] uppercase tracking-widest block mb-1 font-bold">Reservations</span>
                  <span className="text-foreground text-sm font-medium">{reward.backersCount}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest block mb-1 font-bold">Delivery</span>
                  <span className="text-foreground text-sm font-medium">{reward.estimatedDelivery}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest block mb-1 font-bold">Ships To</span>
                  <span className="text-foreground text-sm font-medium">{reward.shipsTo.length > 1 ? "Worldwide" : reward.shipsTo[0]}</span>
                </div>
              </div>

              <Button
                disabled={!isAvailable(reward)}
                onClick={() => !reward.isSoldOut && selectReward(reward.id)}
                className={`w-full h-14 rounded-none uppercase tracking-widest text-[10px] font-bold mt-8 transition-colors cursor-pointer group ${isAvailable(reward) ? "bg-foreground hover:bg-foreground/90 text-background" : "bg-neutral-200 text-neutral-500 border-none hover:bg-neutral-200"
                  }`}
              >
                {isAvailable(reward) ? `Reserve for $${reward.price}` : "Sold Out"}
                {isAvailable(reward) && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
