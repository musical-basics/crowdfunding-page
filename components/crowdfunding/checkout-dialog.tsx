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

export function CheckoutDialog() {
    const { campaign, selectedRewardId, selectReward, pledge } = useCampaign()
    const [isOpen, setIsOpen] = useState(false)
    const [bonusAmount, setBonusAmount] = useState(0)

    // Find the actual reward object from the ID
    const reward = campaign.rewards.find(r => r.id === selectedRewardId)

    // Sync internal state with Context state
    useEffect(() => {
        if (selectedRewardId) {
            setIsOpen(true)
            setBonusAmount(0) // Reset bonus on new open
        } else {
            setIsOpen(false)
        }
    }, [selectedRewardId])

    const handleClose = (open: boolean) => {
        if (!open) {
            selectReward(null!) // Clear selection in context (using ! to bypass null check for now)
            setIsOpen(false)
        }
    }

    const handleConfirm = () => {
        if (!reward) return

        // Calculate total (Base Price + Bonus)
        const total = reward.price + Number(bonusAmount)

        // Execute the pledge
        pledge(total)

        // Close the modal
        handleClose(false)

        // Optional: Trigger a success toast here via sonner/toast hook
        alert(`Woohoo! You successfully pledged $${total}!`)
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

                <div className="grid gap-6 py-4">
                    {/* Reward Summary */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Reward Base Price</p>
                            <p className="text-xs text-muted-foreground">{reward.itemsIncluded.join(", ")}</p>
                        </div>
                        <span className="font-semibold">${reward.price}</span>
                    </div>

                    <Separator />

                    {/* Bonus Support Input */}
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
                        <p className="text-xs text-muted-foreground">
                            Add a little extra to help the creator reach their stretch goals!
                        </p>
                    </div>

                    {/* Total Calculation */}
                    <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-medium">Total Pledge</span>
                        <span className="text-xl font-bold text-emerald-600">
                            ${reward.price + Number(bonusAmount)}
                        </span>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Confirm Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
