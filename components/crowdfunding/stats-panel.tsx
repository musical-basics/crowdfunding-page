"use client"

import { Button } from "@/components/ui/button"
import { Bookmark, Facebook, Twitter, Share2, Heart } from "lucide-react"
import { useCampaign } from "@/context/campaign-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition, useEffect } from "react"
import { joinEmailList, incrementProjectLoves } from "@/app/actions"
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
  const [hasJoined, setHasJoined] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Love Feature State
  const [lovesCount, setLovesCount] = useState(0)
  const [isLoved, setIsLoved] = useState(false)

  useEffect(() => {
    if (campaign) {
      setLovesCount(campaign.stats.lovesCount || 0)
      // Check local storage to see if already loved
      const loved = localStorage.getItem("project_loved")
      if (loved) setIsLoved(true)
    }
  }, [campaign])

  const handleLove = async () => {
    if (isLoved) return

    // Optimistic Update
    setIsLoved(true)
    setLovesCount(prev => prev + 1)
    localStorage.setItem("project_loved", "true")

    // Server Action
    const result = await incrementProjectLoves()
    if (!result.success) {
      // Revert if failed
      setIsLoved(false)
      setLovesCount(prev => prev - 1)
      localStorage.removeItem("project_loved")
    }
  }

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
        setHasJoined(true)
        // setOpen(false) // Don't close immediately, show success state
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

      {/* Backers & Days Left Hidden
      <div>
        <p className="text-2xl font-semibold text-foreground">{backersCount}</p>
        <p className="text-sm text-muted-foreground">backers</p>
      </div>

      <div>
        <p className="text-2xl font-semibold text-foreground">{campaign.stats.daysLeft}</p>
        <p className="text-sm text-muted-foreground">days to go</p>
      </div>
      */}

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
            {hasJoined ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none text-emerald-600">Success!</h4>
                  <p className="text-sm text-muted-foreground">
                    You've been added to the list. Check your email for confirmation.
                  </p>
                </div>
                <Button
                  onClick={() => setOpen(false)}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            ) : (
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
            )}
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

      {/* Project Love Section */}
      <div className="flex items-center gap-2 justify-center pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLove}
          className={`group gap-2 hover:bg-red-50 ${isLoved ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
        >
          <Heart className={`h-5 w-5 transition-all ${isLoved ? "fill-red-500 scale-110" : "group-hover:scale-110"}`} />
          <span className="font-medium text-sm">
            {isLoved ? "You loved this project" : "Love this project"}
          </span>
        </Button>
        <span className="text-xs text-muted-foreground">
          {lovesCount} people loved this project.
        </span>
      </div>
    </div>


  )
}
