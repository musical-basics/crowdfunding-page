"use client"

import { useEffect, useState } from "react"
import { useCampaign } from "@/context/campaign-context"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { submitPledge } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

export function CheckoutDialog() {
    const { campaign, selectedRewardId, selectReward, pledge } = useCampaign()
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<1 | 2>(1) // Step 1: Shipping/Amount, Step 2: User Details
    const [pledgeAmount, setPledgeAmount] = useState(0)
    const [shippingLocation, setShippingLocation] = useState("United States")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const reward = campaign?.rewards.find(r => r.id === selectedRewardId)

    useEffect(() => {
        if (selectedRewardId && reward) {
            setIsOpen(true)
            setPledgeAmount(reward.price) // Reset to reward price
            setStep(1)
        } else {
            setIsOpen(false)
        }
    }, [selectedRewardId, reward])

    const handleClose = (open: boolean) => {
        if (!open) {
            selectReward(null!)
            setIsOpen(false)
        }
    }

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault()
        if (pledgeAmount < (reward?.price || 0)) {
            toast({ title: "Error", description: "Pledge cannot be lower than reward price", variant: "destructive" })
            return
        }
        setStep(2)
    }

    const handleFinalSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        try {
            formData.append("amount", pledgeAmount.toString())
            formData.append("rewardId", reward?.id || "")
            formData.append("shippingLocation", shippingLocation)

            await submitPledge(formData)
            pledge(pledgeAmount)

            toast({
                title: "Pledge Successful!",
                description: `You successfully backed this project!`,
                variant: "default" // Green success
            })

            handleClose(false)
        } catch (error) {
            toast({ title: "Error", description: "Transaction failed", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!reward) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0">

                {/* Header */}
                <div className="p-6 pb-4 border-b border-border bg-muted/10">
                    <div className="flex items-center gap-2">
                        {step === 2 && (
                            <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <DialogTitle className="text-xl">
                            {step === 1 ? `Pledge for ${reward.title}` : "Complete Payment"}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="mt-1">
                        {step === 1 ? "Choose shipping and confirm amount." : "Enter your details to finalize."}
                    </DialogDescription>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 1 ? (
                        <form onSubmit={handleContinue} className="space-y-6">
                            {/* Shipping */}
                            <div className="space-y-3">
                                <Label>Shipping destination</Label>
                                <Select value={shippingLocation} onValueChange={setShippingLocation}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="United States">United States</SelectItem>
                                        <SelectItem value="Canada">Canada</SelectItem>
                                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                        <SelectItem value="Germany">Germany</SelectItem>
                                        <SelectItem value="Australia">Australia</SelectItem>
                                        <SelectItem value="Rest of World">Rest of World</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Amount */}
                            <div className="space-y-3">
                                <Label>Pledge amount</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                    <Input
                                        type="number"
                                        value={pledgeAmount}
                                        onChange={(e) => setPledgeAmount(Number(e.target.value))}
                                        className="pl-7 h-11 text-lg font-medium"
                                        min={reward.price}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Minimum pledge is ${reward.price} for this reward.
                                </p>
                            </div>

                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base">
                                Continue
                            </Button>
                        </form>
                    ) : (
                        <form action={handleFinalSubmit} className="space-y-6">
                            <div className="p-4 bg-muted/30 rounded-lg border border-border flex justify-between items-center mb-6">
                                <span className="font-medium text-sm">Total Pledge</span>
                                <span className="text-xl font-bold text-emerald-600">${pledgeAmount}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" required placeholder="Cardholder Name" className="h-11" autoComplete="name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Shipping Address</Label>
                                    <Input id="address" name="address" required placeholder="123 Main St, Apt 4B" className="h-11" autoComplete="street-address" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" required placeholder="you@example.com" className="h-11" autoComplete="email" />
                                </div>
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base">
                                {isSubmitting ? "Processing..." : "Confirm Payment"}
                            </Button>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
