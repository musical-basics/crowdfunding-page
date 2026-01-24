"use client"

import { useState } from "react"
import { Menu, X, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // We removed "Campaign" from here because the Logo will serve as the "Home/Campaign" link
  const navLinks = [
    { id: "rewards", label: "Rewards" },
    { id: "faq", label: "FAQ" },
    { id: "creator", label: "Creator" },
    { id: "community", label: "Community" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left: Logo (Acts as Home/Campaign Link) */}
        <div className="flex items-center">
          <button
            onClick={() => onTabChange("campaign")}
            className="text-xl font-bold tracking-tight flex items-center gap-2"
          >
            <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center">D</span>
            <span>DreamPlay</span>
          </button>
        </div>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`text-sm font-medium transition-colors hover:text-primary ${activeTab === link.id ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right: CTA Button */}
        <div className="hidden md:flex items-center">
          <Button
            onClick={() => onTabChange("rewards")}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6"
          >
            Back this project
          </Button>
        </div>

        {/* Mobile Menu Button */}
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
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { onTabChange(link.id); setMobileMenuOpen(false); }}
                className="block py-2 text-base font-medium text-muted-foreground hover:text-primary"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-4 pt-4 border-t border-border">
              <Button onClick={() => { onTabChange("rewards"); setMobileMenuOpen(false); }} className="w-full">
                Back this project
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
