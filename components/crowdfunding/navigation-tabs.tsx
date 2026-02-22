"use client"

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {

  // We removed "Campaign" from here because the Logo will serve as the "Home/Campaign" link
  const navLinks = [
    { id: "rewards", label: "Rewards" },
    { id: "faq", label: "FAQ" },
    { id: "community", label: "Community" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2 h-full">
          <button
            onClick={() => onTabChange("campaign")}
            className={`font-sans text-[10px] uppercase tracking-[0.2em] font-bold transition-colors whitespace-nowrap px-2 h-full border-b-2 cursor-pointer ${activeTab === "campaign" ? "text-foreground border-foreground" : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
          >
            Overview
          </button>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`font-sans text-[10px] uppercase tracking-[0.2em] font-bold transition-colors whitespace-nowrap px-2 h-full border-b-2 cursor-pointer ${activeTab === link.id ? "text-foreground border-foreground" : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
