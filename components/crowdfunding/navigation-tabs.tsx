"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

// Define the interface for props to ensure type safety
interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs = [
    { id: "campaign", label: "Campaign" },
    { id: "rewards", label: "Rewards" },
    { id: "creator", label: "Creator" },
    { id: "faq", label: "FAQ", count: 36 },
    { id: "updates", label: "Updates", count: 2 },
    { id: "comments", label: "Comments", count: 65 },
    { id: "community", label: "Community" },
  ]

  const handleMobileTabClick = (tabId: string) => {
    onTabChange(tabId)
    setMobileMenuOpen(false)
  }

  return (
    <div className="mt-8 border-t border-border bg-background"> {/* Added bg-background for sticky overlap */}
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-wrap gap-x-6 gap-y-2 pt-4 pb-2"> {/* Added pb-2 */}
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            label={tab.label}
            count={tab.count}
            id={tab.id}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden pt-4 pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {tabs.find(t => t.id === activeTab)?.label || "Menu"}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute right-4 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
            <div className="py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleMobileTabClick(tab.id)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeTab === tab.id
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <sup className="ml-1 text-xs text-muted-foreground">{tab.count}</sup>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TabItem({ label, count, id, active, onClick }: { label: string; count?: number; id: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm py-2 border-b-2 transition-colors ${active
          ? "border-foreground text-foreground font-medium"
          : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
    >
      {label}
      {count !== undefined && (
        <sup className="ml-0.5 text-xs text-muted-foreground">{count}</sup>
      )}
    </button>
  )
}
