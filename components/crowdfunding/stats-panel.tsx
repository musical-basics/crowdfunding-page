"use client"

import { Button } from "@/components/ui/button"
import { Bookmark, Facebook, Twitter } from "lucide-react"

export function StatsPanel() {
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-emerald-600 rounded-full" style={{ width: "100%" }} />
      </div>

      {/* Funding Amount */}
      <div>
        <p className="text-3xl font-bold text-foreground">$88,808</p>
        <p className="text-sm text-muted-foreground">pledged of $5,000 goal</p>
      </div>

      {/* Backers */}
      <div>
        <p className="text-2xl font-semibold text-foreground">224</p>
        <p className="text-sm text-muted-foreground">backers</p>
      </div>

      {/* CTA Button */}
      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6">
        Back this project
      </Button>

      {/* Secondary Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" className="flex-1 gap-2 bg-transparent">
          <Bookmark className="h-4 w-4" />
          Save
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" strokeWidth="2"/>
              <polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
