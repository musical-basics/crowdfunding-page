"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Campaign } from '@/types/campaign'
import { CAMPAIGN_DATA } from '@/lib/mock-data'

interface CampaignContextType {
    campaign: Campaign
    totalPledged: number
    backersCount: number
    selectedRewardId: string | null
    selectReward: (rewardId: string) => void
    pledge: (amount: number) => void
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export function CampaignProvider({ children }: { children: ReactNode }) {
    // Initialize state with data from our mock file
    const [campaign] = useState<Campaign>(CAMPAIGN_DATA)

    // These are the "live" stats that will change when a user interacts
    const [totalPledged, setTotalPledged] = useState(CAMPAIGN_DATA.stats.totalPledged)
    const [backersCount, setBackersCount] = useState(CAMPAIGN_DATA.stats.totalBackers)
    const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null)

    // Action: User selects a reward card
    const selectReward = (rewardId: string) => {
        setSelectedRewardId(rewardId)
        // Optional: Scroll to checkout or open modal logic would trigger here
        console.log(`Reward selected: ${rewardId}`)
    }

    // Action: User actually pledges money
    const pledge = (amount: number) => {
        setTotalPledged((prev) => prev + amount)
        setBackersCount((prev) => prev + 1)
        // Here is where you would eventually call an API or Stripe
        console.log(`Pledged $${amount}`)
    }

    return (
        <CampaignContext.Provider
            value={{
                campaign,
                totalPledged,
                backersCount,
                selectedRewardId,
                selectReward,
                pledge
            }}
        >
            {children}
        </CampaignContext.Provider>
    )
}

// Custom hook to use the context easily
export function useCampaign() {
    const context = useContext(CampaignContext)
    if (context === undefined) {
        throw new Error('useCampaign must be used within a CampaignProvider')
    }
    return context
}
