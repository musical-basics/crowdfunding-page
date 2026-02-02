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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ExternalLink, ShieldCheck } from "lucide-react"

// ------------------------------------------------------------------
// 🔧 CONFIGURATION: Map your selections to Shopify Variant IDs
// You can find these IDs in your Shopify Admin URL for each variant
// ------------------------------------------------------------------
const SHOPIFY_VARIANTS: Record<string, string> = {
    // FORMAT: "RewardID_Size_Color" : "ShopifyVariantID"

    // BUNDLE VARIANTS
    "bundle_DS5.5_Midnight Black": "44444444444", // Replace with real ID
    "bundle_DS5.5_Pearl White": "44444444445",
    "bundle_DS6.0_Midnight Black": "44444444446",
    "bundle_DS6.0_Pearl White": "44444444447",

    // KEYBOARD ONLY VARIANTS
    "solo_DS5.5_Midnight Black": "55555555555",
    "solo_DS5.5_Pearl White": "55555555556",
    "solo_DS6.0_Midnight Black": "55555555557",
    "solo_DS6.0_Pearl White": "55555555558",

    // DEFAULT FALLBACK (for testing)
    "default": "123456789"
}

const SHOPIFY_DOMAIN = "your-shop-name.myshopify.com"
// ------------------------------------------------------------------

export function CheckoutDialog() {
    const { campaign, selectedRewardId, selectReward } = useCampaign()
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [pledgeAmount, setPledgeAmount] = useState(0)

    // Customization State
    const [keySize, setKeySize] = useState<"DS5.5" | "DS6.0">("DS5.5")
    const [variantColor, setVariantColor] = useState<"Midnight Black" | "Pearl White">("Midnight Black")

    // Form State
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const { toast } = useToast()

    const reward = campaign?.rewards.find(r => r.id === selectedRewardId)
    // Check if this reward needs customization
    const hasOptions = reward?.itemsIncluded.some(item => item.toLowerCase().includes("keyboard")) || false

    useEffect(() => {
        if (selectedRewardId && reward) {
            setIsOpen(true)
            setPledgeAmount(reward.price)
            setStep(hasOptions ? 2 : 3) // Skip step 1 if price is fixed, or adjust logic as needed
            // Reset defaults
            setKeySize("DS5.5")
            setVariantColor("Midnight Black")
            setAgreedToTerms(false)
        } else {
            setIsOpen(false)
        }
    }, [selectedRewardId, reward, hasOptions])

    const handleClose = (open: boolean) => {
        if (!open) {
            selectReward(null!)
            setIsOpen(false)
        }
    }

    const handleShopifyRedirect = () => {
        if (!agreedToTerms) {
            toast({ title: "Agreement Required", description: "Please agree to the crowdfunding terms to continue.", variant: "destructive" })
            return
        }

        setIsRedirecting(true)

        // 0. Use direct override if custom URL is set
        if (reward?.checkoutUrl) {
            window.location.href = reward.checkoutUrl
            return
        }

        // 1. Construct the lookup key
        // Note: Make sure your reward IDs in 'mock-data.ts' match the keys here (e.g., 'bundle', 'solo')
        const lookupKey = `${selectedRewardId}_${keySize}_${variantColor}`

        // 2. Find the variant ID
        const variantId = SHOPIFY_VARIANTS[lookupKey] || SHOPIFY_VARIANTS["default"]

        // 3. Construct Shopify Cart Permalink
        // Logic: https://domain/cart/{variant_id}:{quantity}
        const checkoutUrl = `https://${SHOPIFY_DOMAIN}/cart/${variantId}:1`

        // 4. Redirect
        window.location.href = checkoutUrl
    }

    if (!reward) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0 bg-background">

                {/* Header */}
                <div className="p-6 pb-4 border-b border-border bg-muted/5">
                    <div className="flex items-center gap-2">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(prev => (prev - 1) as 1 | 2 | 3)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <DialogTitle className="text-lg font-semibold">
                            {step === 1 && `Back this project`}
                            {step === 2 && "Customize your reward"}
                            {step === 3 && "Review & Checkout"}
                        </DialogTitle>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">

                    {/* STEP 1: AMOUNT (Optional, can be skipped if fixed price) */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="p-4 border rounded-lg bg-muted/20">
                                <h4 className="font-medium text-sm mb-1">{reward.title}</h4>
                                <p className="text-xs text-muted-foreground">{reward.description}</p>
                            </div>
                            <div className="space-y-3">
                                <Label>Pledge Amount</Label>
                                <Input
                                    type="number"
                                    value={pledgeAmount}
                                    onChange={(e) => setPledgeAmount(Number(e.target.value))}
                                    className="h-12 text-lg font-medium"
                                    min={reward.price}
                                />
                            </div>
                            <Button onClick={() => setStep(hasOptions ? 2 : 3)} className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700">
                                Continue
                            </Button>
                        </div>
                    )}

                    {/* STEP 2: OPTIONS */}
                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Label className="text-base">Keyboard Size</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["DS5.5", "DS6.0"].map((size) => (
                                        <div
                                            key={size}
                                            onClick={() => setKeySize(size as any)}
                                            className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${keySize === size ? 'border-emerald-600 bg-emerald-50/50' : 'border-border hover:border-gray-300'}`}
                                        >
                                            <div className="font-bold">{size}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {size === "DS5.5" ? "Small Hands (< 8.5\")" : "Standard Fit"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base">Finish</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Midnight Black", "Pearl White"].map((color) => (
                                        <div
                                            key={color}
                                            onClick={() => setVariantColor(color as any)}
                                            className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${variantColor === color ? 'border-emerald-600 bg-emerald-50/50' : 'border-border hover:border-gray-300'}`}
                                        >
                                            <div className={`h-6 w-6 rounded-full border border-gray-200 ${color === "Midnight Black" ? "bg-neutral-900" : "bg-white"}`} />
                                            <span className="font-medium text-sm">{color}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button onClick={() => setStep(3)} className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700">
                                Review Selection
                            </Button>
                        </div>
                    )}

                    {/* STEP 3: REVIEW & REDIRECT */}
                    {step === 3 && (
                        <div className="space-y-6">

                            {/* Summary Card */}
                            <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-base">{reward.title}</h4>
                                        {hasOptions && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {keySize} • {variantColor}
                                            </p>
                                        )}
                                    </div>
                                    <span className="font-bold text-lg">${pledgeAmount}</span>
                                </div>
                                <div className="h-px bg-border/50" />
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                    <span>Secure checkout via Shopify</span>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start space-x-3 pt-2">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={(c) => setAgreedToTerms(c as boolean)}
                                    className="mt-1"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        I agree to the Terms of Use
                                    </label>
                                    <p className="text-xs text-muted-foreground text-balance leading-relaxed">
                                        I understand that I am pledging to a project in development. Shipping dates (August 2026) are estimates. Shipping fees and taxes will be calculated at checkout.
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={handleShopifyRedirect}
                                disabled={isRedirecting}
                                className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 shadow-md group"
                            >
                                {isRedirecting ? (
                                    "Redirecting to Checkout..."
                                ) : (
                                    <>
                                        Proceed to Checkout
                                        <ExternalLink className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
