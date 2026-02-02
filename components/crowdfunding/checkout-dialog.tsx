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
    const [step, setStep] = useState<1 | 2 | 3>(1) // Step 1: Shipping/Amount, Step 2: Options, Step 3: User Details
    const [pledgeAmount, setPledgeAmount] = useState(0)
    const [shippingLocation, setShippingLocation] = useState("United States")
    const [keySize, setKeySize] = useState<"DS5.5" | "DS6.0">("DS5.5")
    const [variantColor, setVariantColor] = useState<"Midnight Black" | "Pearl White">("Midnight Black")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const reward = campaign?.rewards.find(r => r.id === selectedRewardId)
    const hasOptions = reward?.itemsIncluded.some(item => item.toLowerCase().includes("keyboard")) || false

    useEffect(() => {
        if (selectedRewardId && reward) {
            setIsOpen(true)
            setPledgeAmount(reward.price) // Reset to reward price
            setStep(1)
            // Reset defaults
            setKeySize("DS5.5")
            setVariantColor("Midnight Black")
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

    const handleContinueFromPledge = (e: React.FormEvent) => {
        e.preventDefault()
        if (pledgeAmount < (reward?.price || 0)) {
            toast({ title: "Error", description: "Pledge cannot be lower than reward price", variant: "destructive" })
            return
        }
        if (hasOptions) {
            setStep(2)
        } else {
            setStep(3)
        }
    }

    const handleContinueFromOptions = (e: React.FormEvent) => {
        e.preventDefault()
        setStep(3)
    }

    const handleBack = () => {
        if (step === 3) {
            setStep(hasOptions ? 2 : 1)
        } else if (step === 2) {
            setStep(1)
        }
    }

    const handleFinalSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        try {
            formData.append("amount", pledgeAmount.toString())
            formData.append("rewardId", reward?.id || "")
            formData.append("shippingLocation", shippingLocation)

            if (hasOptions) {
                formData.append("keySize", keySize)
                formData.append("variantColor", variantColor)
            }

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
                        {step > 1 && (
                            <button onClick={handleBack} className="text-muted-foreground hover:text-foreground">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <DialogTitle className="text-xl">
                            {step === 1 && `Pledge for ${reward.title}`}
                            {step === 2 && "Customize Your Reward"}
                            {step === 3 && "Complete Payment"}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="mt-1">
                        {step === 1 && "Choose shipping and confirm amount."}
                        {step === 2 && "Select your preferred model and finish."}
                        {step === 3 && "Enter your details to finalize."}
                    </DialogDescription>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 1 && (
                        <form onSubmit={handleContinueFromPledge} className="space-y-6">
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
                    )}

                    {step === 2 && (
                        <form onSubmit={handleContinueFromOptions} className="space-y-8">
                            {/* Key Size */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Key Size</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setKeySize("DS5.5")}
                                        className={`h-14 rounded-full border-2 font-medium transition-all ${keySize === "DS5.5"
                                                ? "border-black bg-black text-white"
                                                : "border-border hover:border-black/50"
                                            }`}
                                    >
                                        DS5.5
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setKeySize("DS6.0")}
                                        className={`h-14 rounded-full border-2 font-medium transition-all ${keySize === "DS6.0"
                                                ? "border-black bg-black text-white"
                                                : "border-border hover:border-black/50"
                                            }`}
                                    >
                                        DS6.0
                                    </button>
                                </div>
                            </div>

                            {/* Color */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Color</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setVariantColor("Midnight Black")}
                                        className={`h-14 rounded-full border-2 font-medium transition-all ${variantColor === "Midnight Black"
                                                ? "border-black bg-black text-white"
                                                : "border-border hover:border-black/50"
                                            }`}
                                    >
                                        Midnight Black
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setVariantColor("Pearl White")}
                                        className={`h-14 rounded-full border-2 font-medium transition-all ${variantColor === "Pearl White"
                                                ? "border-black bg-black text-white"
                                                : "border-border hover:border-black/50"
                                            }`}
                                    >
                                        Pearl White
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base mt-4">
                                Continue
                            </Button>
                        </form>
                    )}

                    {step === 3 && (
                        <form action={handleFinalSubmit} className="space-y-6">
                            <div className="p-4 bg-muted/30 rounded-lg border border-border flex justify-between items-center mb-6">
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">Total Pledge</span>
                                    {hasOptions && (
                                        <span className="text-xs text-muted-foreground">
                                            {keySize}, {variantColor}
                                        </span>
                                    )}
                                </div>
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
