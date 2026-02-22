"use client"

import { Button } from "@/components/ui/button"
import { Bookmark, Facebook, Twitter, Share2, Heart, ShieldCheck } from "lucide-react"
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


  // Format currency
  const formattedPledged = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalPledged)


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
    <div className="space-y-8 bg-neutral-50/50 p-8 md:p-10 border border-neutral-200 h-full">
      {/* Funding Amount */}
      {(campaign.showReservedAmount !== false) && (
        <div className="border-b border-neutral-200 pb-6">
          <div className="flex flex-col items-start gap-2">
            <p className="text-5xl md:text-6xl font-serif text-foreground">{formattedPledged}</p>
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-muted-foreground">Reserved</span>
          </div>
        </div>
      )}

      {/* Percentage Funded */}
      {(campaign.showSoldOutPercent !== false) && (
        <div className="border-b border-neutral-200 pb-6">
          <p className="text-3xl font-serif text-foreground">
            {Math.floor((totalPledged / campaign.stats.goalAmount) * 100)}%
          </p>
          <p className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-muted-foreground mt-2">Sold Out</p>
        </div>
      )}

      {/* Days & Backers */}
      <div className="flex gap-12 border-b border-neutral-200 pb-6">
        <div>
          <p className="text-2xl font-serif text-foreground mb-1">{backersCount}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Backers</p>
        </div>
        <div>
          <p className="text-2xl font-serif text-foreground mb-1">{campaign.stats.daysLeft}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Days Left</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <Button
          onClick={handleBackProject}
          className="w-full bg-foreground hover:bg-foreground/90 text-background font-sans uppercase tracking-widest text-[10px] font-bold py-7 rounded-none shadow-md transition-all cursor-pointer"
        >
          Reserve for Founder's Batch
        </Button>
      </div>

      {/* No-Risk Guarantee */}
      <div className="bg-white border border-neutral-200 p-6 text-center space-y-3 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-foreground font-sans font-bold uppercase tracking-widest text-[10px]">
          <ShieldCheck className="h-4 w-4" />
          The "No-Risk" Guarantee
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed font-sans">
          Your pre-order is held securely until production begins. If we do not hit our minimums, <strong className="text-foreground font-medium">you get a 100% refund immediately.</strong> You risk nothing.
        </p>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full gap-2 font-sans text-xs uppercase tracking-widest font-bold py-6 rounded-none border-border hover:bg-neutral-100 hover:text-foreground cursor-pointer">
              <Bookmark className="h-4 w-4" />
              Join The Waitlist
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            {hasJoined ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none text-foreground">Success!</h4>
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
                  <h4 className="font-medium leading-none">Join the waitlist</h4>
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
                  {isPending ? "Joining..." : "Join waitlist"}
                </Button>
              </form>
            )}
          </PopoverContent>
        </Popover>
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
