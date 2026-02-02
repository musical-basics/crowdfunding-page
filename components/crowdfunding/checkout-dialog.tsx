"use client"

import { useEffect, useState } from "react"
import { useCampaign } from "@/context/campaign-context"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ExternalLink, ShieldCheck } from "lucide-react"

// --- CONFIGURATION ---

const SHOPIFY_DOMAIN = "your-shop-name.myshopify.com"

export function CheckoutDialog() {
    const { campaign, selectedRewardId, selectReward } = useCampaign()
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<1 | 2>(1)

    // Customization State
    const [keySize, setKeySize] = useState<"DS5.5" | "DS6.0">("DS5.5")
    const [variantColor, setVariantColor] = useState<"Midnight Black" | "Pearl White">("Midnight Black")

    // Form State
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [isRedirecting, setIsRedirecting] = useState(false)

    const { toast } = useToast()
    const reward = campaign?.rewards.find(r => r.id === selectedRewardId)

    // Check if this reward needs customization options
    const hasOptions = reward?.itemsIncluded.some(item => item.toLowerCase().includes("keyboard")) || false

    useEffect(() => {
        if (selectedRewardId && reward) {
            setIsOpen(true)
            // If reward has options, start at Step 1 (Customize). 
            // If it's a fixed digital reward, skip to Step 2 (Review).
            setStep(hasOptions ? 1 : 2)

            // Reset defaults
            setKeySize("DS5.5")
            setVariantColor("Midnight Black")
            setAgreedToTerms(false)
            setIsRedirecting(false)
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
            toast({ title: "Agreement Required", description: "Please agree to the crowdfunding terms.", variant: "destructive" })
            return
        }

        setIsRedirecting(true)

        // 0. Use direct override if custom URL is set
        if (reward?.checkoutUrl) {
            window.location.href = reward.checkoutUrl
            return
        }

        // 1. Get the config from the DB Reward
        const variantConfig = reward?.shopifyVariantId

        let variantId = ""

        if (!variantConfig) {
            // Fallback for simple items if no config is present (optional, or just error out)
            // For now, let's error to encourage configuration
            toast({ title: "Configuration Error", description: "Shopify ID missing for this reward.", variant: "destructive" })
            setIsRedirecting(false)
            return
        }

        // 2. Determine if it's a Single ID or a JSON Map
        if (variantConfig.trim().startsWith("{")) {
            // It's a JSON Map (Bundle Logic)
            try {
                const map = JSON.parse(variantConfig)
                const lookupKey = `${keySize}_${variantColor}` // e.g., "DS5.5_Midnight Black"
                variantId = map[lookupKey]
            } catch (e) {
                console.error("Invalid JSON in reward config")
            }
        } else {
            // It's a simple String ID (Single Item Logic)
            variantId = variantConfig.trim()
        }

        if (!variantId) {
            toast({ title: "Out of Stock", description: "This specific combination is not available.", variant: "destructive" })
            setIsRedirecting(false)
            return
        }

        // 3. Construct Cart Permalink
        // This will create a checkout with 1 unit of the variant
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
                        {step === 2 && hasOptions && (
                            <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <DialogTitle className="text-lg font-semibold">
                            {step === 1 ? `Customize Reward` : `Review & Checkout`}
                        </DialogTitle>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">

                    {/* STEP 1: CUSTOMIZE (Only if hasOptions) */}
                    {step === 1 && hasOptions && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
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
                                            <div className="text-xs text-muted-foreground mt-1">{size === "DS5.5" ? "Small Hands" : "Standard"}</div>
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

                            <Button onClick={() => setStep(2)} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-base">
                                Review Selection
                            </Button>
                        </div>
                    )}

                    {/* STEP 2: REVIEW & REDIRECT */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                            {/* Summary Card */}
                            <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-base">{reward.title}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {hasOptions ? `${keySize} • ${variantColor}` : "Standard Edition"}
                                        </p>
                                    </div>
                                    <span className="font-bold text-lg">${reward.price}</span>
                                </div>
                                <div className="h-px bg-border/50" />
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                    <span>Shipping & Taxes calculated at checkout</span>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start space-x-3 pt-2">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={(c) => setAgreedToTerms(c as boolean)}
                                    className="mt-1"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label htmlFor="terms" className="text-sm font-medium leading-tight cursor-pointer">
                                        I agree to the Terms of Use
                                    </label>
                                    <p className="text-xs text-muted-foreground text-balance leading-relaxed">
                                        I understand that I am pledging to a project in development. Shipping dates are estimates.
                                    </p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                onClick={handleShopifyRedirect}
                                disabled={isRedirecting}
                                className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 shadow-md group"
                            >
                                {isRedirecting ? "Preparing Checkout..." : (
                                    <>
                                        Proceed to Checkout
                                        <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
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
