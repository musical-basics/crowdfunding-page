"use client"

import { Button } from "@/components/ui/button"
import { Bookmark, Facebook, Twitter, Share2 } from "lucide-react"
import { useCampaign } from "@/context/campaign-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { joinEmailList } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function StatsPanel() {
  const { totalPledged, backersCount, campaign } = useCampaign()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!campaign) return null

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

  const handleJoinList = async (formData: FormData) => {
    startTransition(async () => {
      const result = await joinEmailList(formData)

      if (result.success) {
        toast({
          title: "You're on the list!",
          description: "We'll let you know when there are updates.",
        })
        setOpen(false)
      } else {
        toast({
          title: "Something went wrong",
          description: result.error || "Please try again.",
          variant: "destructive",
        })
      }
    })
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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 gap-2 bg-transparent">
              <Bookmark className="h-4 w-4" />
              Join the email list
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <form action={handleJoinList} className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Join the list</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified about project updates.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    className="h-8"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-8"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Joining..." : "Join list"}
              </Button>
            </form>
          </PopoverContent>
        </Popover>
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


    </div>
  )
}
