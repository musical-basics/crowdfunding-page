"use client"

import { useEffect, useState } from "react"
import { useCampaign } from "@/context/campaign-context"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { submitPledge } from "@/app/actions" // <--- Import server action
import { useToast } from "@/hooks/use-toast"

export function CheckoutDialog() {
    const { campaign, selectedRewardId, selectReward, pledge } = useCampaign()
    const [isOpen, setIsOpen] = useState(false)
    const [bonusAmount, setBonusAmount] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false) // Loading state
    const { toast } = useToast()

    const reward = campaign?.rewards.find(r => r.id === selectedRewardId)

    useEffect(() => {
        if (selectedRewardId) {
            setIsOpen(true)
            setBonusAmount(0)
        } else {
            setIsOpen(false)
        }
    }, [selectedRewardId])

    const handleClose = (open: boolean) => {
        if (!open) {
            selectReward(null!)
            setIsOpen(false)
        }
    }

    // Handle the form submission
    const handlePaymentSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        try {
            // Append calculated values that aren't in inputs
            const total = (reward?.price || 0) + Number(bonusAmount)
            formData.append("amount", total.toString())
            formData.append("rewardId", reward?.id || "")

            // Call Server Action
            await submitPledge(formData)

            // Optimistic Update (Optional, as revalidatePath handles it mostly)
            pledge(total)

            toast({
                title: "Pledge Successful!",
                description: `You backed ${reward?.title} for $${total}.`,
                variant: "default"
            })

            handleClose(false)
        } catch (error) {
            console.error(error)
            toast({
                title: "Transaction Failed",
                description: "Please try again later.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!reward) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Confirm your pledge</DialogTitle>
                    <DialogDescription>
                        You chose <strong>{reward.title}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form action={handlePaymentSubmit} className="grid gap-6 py-4">

                    {/* Reward Summary */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Reward Base Price</p>
                            <p className="text-xs text-muted-foreground">{reward.itemsIncluded.join(", ")}</p>
                        </div>
                        <span className="font-semibold">${reward.price}</span>
                    </div>

                    <Separator />

                    {/* User Details (NEW) */}
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" required placeholder="Jane Doe" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
                        </div>
                    </div>

                    <Separator />

                    {/* Bonus Support */}
                    <div className="space-y-2">
                        <Label htmlFor="bonus">Bonus Support (Optional)</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">$</span>
                            <Input
                                id="bonus"
                                type="number"
                                min="0"
                                value={bonusAmount}
                                onChange={(e) => setBonusAmount(Number(e.target.value))}
                                className="max-w-[120px]"
                            />
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-medium">Total Pledge</span>
                        <span className="text-xl font-bold text-emerald-600">
                            ${reward.price + Number(bonusAmount)}
                        </span>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            {isSubmitting ? "Processing..." : "Confirm Payment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
