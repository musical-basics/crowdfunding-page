"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

import Image from "next/image" // <--- Import Image

interface SiteHeaderProps {
    onTabChange: (tab: string) => void
}

export function SiteHeader({ onTabChange }: SiteHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Left: Logo (Home Link) */}
                <div className="flex items-center">
                    <button
                        onClick={() => onTabChange("campaign")}
                        className="flex items-center gap-2"
                    >
                        <Image
                            src="/images/DP update_DP outline black2.png"
                            alt="DreamPlay"
                            width={150}
                            height={40}
                            className="h-8 w-auto object-contain"
                            priority
                        />
                    </button>
                </div>

                {/* Center: Navigation Links (Desktop) */}
                <nav className="hidden md:flex items-center">
                    <div className="flex items-center gap-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-4 py-1">
                        <button
                            onClick={() => onTabChange("campaign")}
                            className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-white/5"
                        >
                            Overview
                        </button>
                        <div className="w-px h-4 bg-white/20" />
                        <button
                            onClick={() => onTabChange("rewards")}
                            className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-white/5"
                        >
                            Rewards
                        </button>
                        <div className="w-px h-4 bg-white/20" />
                        <button
                            onClick={() => onTabChange("faq")}
                            className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-white/5"
                        >
                            FAQ
                        </button>
                        <div className="w-px h-4 bg-white/20" />
                        <button
                            onClick={() => onTabChange("creator")}
                            className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-white/5"
                        >
                            Creator
                        </button>
                        <div className="w-px h-4 bg-white/20" />
                        <button
                            onClick={() => onTabChange("community")}
                            className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-white/5"
                        >
                            Community
                        </button>
                    </div>
                </nav>

                {/* Right: CTA + Mobile Menu */}
                <div className="flex items-center gap-4">
                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center">
                        <Button
                            onClick={() => onTabChange("rewards")}
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6"
                        >
                            Back this project
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <div className="space-y-1 px-4 py-6">
                        <button
                            onClick={() => { onTabChange("campaign"); setMobileMenuOpen(false); }}
                            className="block py-2 text-base font-semibold text-foreground"
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => { onTabChange("rewards"); setMobileMenuOpen(false); }}
                            className="block py-2 text-base font-medium text-muted-foreground hover:text-primary"
                        >
                            Rewards
                        </button>
                        <button
                            onClick={() => { onTabChange("faq"); setMobileMenuOpen(false); }}
                            className="block py-2 text-base font-medium text-muted-foreground hover:text-primary"
                        >
                            FAQ
                        </button>
                        <button
                            onClick={() => { onTabChange("creator"); setMobileMenuOpen(false); }}
                            className="block py-2 text-base font-medium text-muted-foreground hover:text-primary"
                        >
                            Creator
                        </button>
                        <button
                            onClick={() => { onTabChange("community"); setMobileMenuOpen(false); }}
                            className="block py-2 text-base font-medium text-muted-foreground hover:text-primary"
                        >
                            Community
                        </button>

                        <div className="mt-4 pt-4 border-t border-border">
                            <Button onClick={() => { onTabChange("rewards"); setMobileMenuOpen(false); }} className="w-full">
                                Back this project
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
