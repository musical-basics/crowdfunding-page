"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Campaign } from '@/types/campaign'

interface CampaignContextType {
    campaign: Campaign | null
    isLoading: boolean
    error: string | null
    totalPledged: number
    backersCount: number
    selectedRewardId: string | null
    selectReward: (rewardId: string) => void
    pledge: (amount: number) => void
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export function CampaignProvider({ children }: { children: ReactNode }) {
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Stats state
    const [totalPledged, setTotalPledged] = useState(0)
    const [backersCount, setBackersCount] = useState(0)
    const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null)

    // Fetch data on mount
    useEffect(() => {
        async function fetchCampaign() {
            try {
                setIsLoading(true)
                const res = await fetch('/api/campaign')

                if (!res.ok) throw new Error('Failed to fetch campaign')

                const data = await res.json()
                setCampaign(data)

                // Initialize stats from the fetched data
                setTotalPledged(data.stats.totalPledged)
                setBackersCount(data.stats.totalBackers)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCampaign()
    }, [])

    const selectReward = (rewardId: string) => {
        setSelectedRewardId(rewardId)
    }

    const pledge = (amount: number) => {
        setTotalPledged((prev) => prev + amount)
        setBackersCount((prev) => prev + 1)
    }

    return (
        <CampaignContext.Provider
            value={{
                campaign,
                isLoading,
                error,
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

export function useCampaign() {
    const context = useContext(CampaignContext)
    if (context === undefined) {
        throw new Error('useCampaign must be used within a CampaignProvider')
    }
    return context
}
