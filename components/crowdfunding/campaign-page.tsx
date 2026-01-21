"use client"

import { useState, useEffect } from "react"
import { useCampaign } from "@/context/campaign-context"

export function CampaignPage() {
  const { campaign } = useCampaign() // <--- 1. Hook into Context
  const [activeSection, setActiveSection] = useState("story")

  const sections = [
    { id: "story", label: "Story" },
    { id: "features", label: "Features" },
    { id: "specs", label: "Tech Specs" },
    { id: "shipping", label: "Shipping" },
    { id: "risks", label: "Risks" },
  ]

  // 2. Scroll Spy Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is near top of screen
        threshold: 0
      }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // 3. Smooth Scroll Handler
  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      // Offset for the sticky header (approx 180px)
      const headerOffset = 180
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:col-span-1">
        <div className="sticky top-32 space-y-1 border-l-2 border-border pl-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`block text-left text-sm transition-all duration-200 ${activeSection === section.id
                  ? "font-bold text-emerald-600 translate-x-1"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile Horizontal Nav */}
      <div className="md:hidden sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border -mx-4 px-4 py-2 overflow-x-auto flex gap-4 no-scrollbar">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`whitespace-nowrap text-sm px-3 py-1 rounded-full transition-colors ${activeSection === section.id
                ? "bg-emerald-100 text-emerald-800 font-medium"
                : "text-muted-foreground bg-muted/50"
              }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="md:col-span-3 space-y-16">

        {/* Story Section (From Mock Data) */}
        <section id="story" className="space-y-6 scroll-mt-32">
          <h2 className="text-3xl font-bold">Story</h2>
          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: campaign.story }}
          />
          {/* Gallery Images from Mock Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {campaign.images.gallery.map((img, idx) => (
              <div key={idx} className="aspect-video bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground">
                Image {idx + 1}
              </div>
            ))}
          </div>
        </section>

        {/* Features Section (Static for now, could be dynamic) */}
        <section id="features" className="space-y-6 scroll-mt-32">
          <h3 className="text-2xl font-bold">Key Features</h3>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: "📦", title: "Shipping Starts Feb", description: "Fast delivery" },
              { icon: "🛡️", title: "1-Year Warranty", description: "Included" },
              { icon: "🌍", title: "Global Shipping", description: "Worldwide" },
              { icon: "💰", title: "Taxes Included", description: "No surprises" },
            ].map((feature, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-card p-6 text-center shadow-sm">
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h4 className="mb-1 font-semibold">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Specs */}
        <section id="specs" className="space-y-6 scroll-mt-32">
          <h3 className="text-2xl font-bold">Technical Specifications</h3>
          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Dimensions:</strong> 120cm x 30cm x 10cm</li>
              <li><strong>Weight:</strong> 12kg</li>
              <li><strong>Connectivity:</strong> USB-C, MIDI over Bluetooth</li>
              <li><strong>Keys:</strong> 88 weighted keys (DS5.5 standard)</li>
            </ul>
          </div>
        </section>

        {/* Shipping Info */}
        <section id="shipping" className="space-y-6 scroll-mt-32">
          <h3 className="text-2xl font-bold">Shipping Information</h3>
          <p className="text-muted-foreground leading-relaxed">
            We plan to ship worldwide. Shipping costs are calculated at checkout based on your location.
            Please note that VAT and import duties for EU/UK customers are included in the price.
          </p>
        </section>

        {/* Risks Section (From Mock Data) */}
        <section id="risks" className="space-y-6 scroll-mt-32 border-t pt-8">
          <h3 className="text-2xl font-bold">Risks & Challenges</h3>
          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: campaign.risks }}
          />
        </section>

      </main>
    </div>
  )
}
