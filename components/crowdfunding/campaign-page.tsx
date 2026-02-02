"use client"

import { useState, useEffect } from "react"
import { useCampaign } from "@/context/campaign-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

export function CampaignPage() {
  const { campaign, isLoading, selectReward } = useCampaign()
  const [activeSection, setActiveSection] = useState("story")
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  if (isLoading || !campaign) {
    return <div className="py-12 text-center text-muted-foreground">Loading campaign...</div>
  }

  const sections = [
    { id: "story", label: "Story" },
    { id: "features", label: "Features" },
    { id: "specs", label: "Tech Specs" },
    { id: "risks", label: "Risks" },
    { id: "shipping", label: "Shipping" },
  ]

  // Scroll Spy Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={campaign.images.gallery.map((src: string) => ({ src }))}
      />

      {/* --- LEFT COLUMN: Table of Contents (Sticky) --- */}
      {/* Hidden on mobile, visible on desktop (2 cols wide) */}
      <aside className="hidden md:block md:col-span-2">
        <div className="sticky top-24 space-y-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Contents
          </p>
          <nav className="flex flex-col space-y-1 border-l-2 border-border pl-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-left text-sm py-1 transition-colors ${activeSection === section.id
                  ? "text-primary font-semibold -ml-[18px] border-l-2 border-primary pl-4"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* --- MIDDLE COLUMN: Main Content --- */}
      {/* Full width on mobile, 6 cols on desktop (was 7) */}
      <main className="col-span-1 md:col-span-6 space-y-16">

        {/* Story */}
        <section id="story" className="space-y-6 scroll-mt-24">
          <div
            className="prose prose-lg dark:prose-invert max-w-none 
                       prose-headings:font-bold prose-headings:tracking-tight 
                       prose-p:text-muted-foreground prose-p:leading-relaxed
                       prose-img:rounded-xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: campaign.story }}
          />

          {/* Gallery Insert */}
          <div className="grid grid-cols-2 gap-4 my-8">
            {campaign.images.gallery.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-video bg-muted rounded-lg border border-border overflow-hidden cursor-pointer"
                onClick={() => setLightboxIndex(idx)}
              >
                <Image
                  src={img}
                  alt={`Gallery Image ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-24 pt-8 border-t border-border">
          <h3 className="text-2xl font-bold mb-6">Key Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(campaign.keyFeatures?.length > 0 ? campaign.keyFeatures : [
              { icon: "🎹", title: "Narrower Keys", desc: "15/16th size for ergonomic reach." },
              { icon: "🔊", title: "Pro Sound Engine", desc: "Sampled from a 9ft Concert Grand." },
              { icon: "🔋", title: "Portable Power", desc: "Built-in battery for 8 hours of play." },
              { icon: "📱", title: "Bluetooth MIDI", desc: "Connect instantly to your tablet." },
            ]).map((feature, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-border bg-card/50">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specs */}
        <section id="specs" className="scroll-mt-24 pt-8 border-t border-border">
          <h3 className="text-2xl font-bold mb-6">Technical Specs</h3>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {campaign.techSpecs?.length > 0 ? (
                  campaign.techSpecs.map((spec, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <td className="p-4 font-medium">{spec.label}</td>
                      <td className="p-4 text-muted-foreground">{spec.value}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="bg-muted/30"><td className="p-4 font-medium">Dimensions</td><td className="p-4 text-muted-foreground">120cm x 30cm x 10cm</td></tr>
                    <tr><td className="p-4 font-medium">Weight</td><td className="p-4 text-muted-foreground">12kg (26 lbs)</td></tr>
                    <tr className="bg-muted/30"><td className="p-4 font-medium">Connectivity</td><td className="p-4 text-muted-foreground">USB-C, Bluetooth 5.0, MIDI</td></tr>
                    <tr><td className="p-4 font-medium">Power</td><td className="p-4 text-muted-foreground">Internal Battery (8hrs) or AC Adapter</td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {campaign.technicalDetails && (
            <div
              className="mt-8 prose dark:prose-invert max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: campaign.technicalDetails }}
            />
          )}
        </section>

        {/* Risks */}
        <section id="risks" className="scroll-mt-24 pt-8 border-t border-border">
          <h3 className="text-2xl font-bold mb-6">Risks & Challenges</h3>
          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: campaign.risks }}
          />
        </section>

        {/* Shipping */}
        <section id="shipping" className="scroll-mt-24 pt-8 border-t border-border">
          <h3 className="text-2xl font-bold mb-6">Shipping & Delivery</h3>
          {campaign.shipping ? (
            <div
              className="prose dark:prose-invert max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: campaign.shipping }}
            />
          ) : (
            <p className="text-muted-foreground">Shipping details coming soon.</p>
          )}
        </section>
      </main>

      {/* --- RIGHT COLUMN: Rewards & Creator --- */}
      <aside className="hidden md:block md:col-span-4 space-y-8"> {/* Increased span to 4 for better width */}

        {/* Creator Profile */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase text-muted-foreground tracking-wider">Creator</h4>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-border">
              <AvatarImage src={campaign.creator.avatarUrl} />
              <AvatarFallback>CR</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold leading-none">{campaign.creator.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{campaign.creator.location}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {campaign.creator.bio}
          </p>
          <Button variant="outline" className="w-full text-xs h-8">
            Contact Creator
          </Button>
        </div>

        <div className="h-px bg-border w-full" />

        {/* REWARDS LIST */}
        <div className="space-y-6">
          <h4 className="font-bold text-lg">Support</h4>

          {campaign.rewards.map(reward => (
            <Card
              key={reward.id}
              className={`overflow-hidden transition-all duration-200 border ${reward.isSoldOut ? "opacity-70" : "hover:border-emerald-500 hover:shadow-md"
                }`}
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="space-y-1">
                  <h3 className="font-bold text-lg leading-tight">{reward.title}</h3>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${reward.price} <span className="text-xs font-normal text-muted-foreground text-black">approx. ¥{(reward.price * 150).toLocaleString()}</span>
                  </p>
                </div>

                {/* Reward Image */}
                {reward.imageUrl && (
                  <div className="rounded-lg overflow-hidden aspect-video relative bg-slate-100">
                    <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {reward.description}
                </p>

                {/* Meta Data Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-muted-foreground py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Estimated Delivery</span>
                    <span>{reward.estimatedDelivery}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Ships To</span>
                    <span>{reward.shipsTo.length > 1 ? "Worldwide" : reward.shipsTo[0]}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Backers</span>
                    <span>{reward.backersCount}</span>
                  </div>
                  {reward.limitedQuantity && (
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Limited</span>
                      <span className="text-orange-600 font-medium">
                        {Math.max(0, reward.limitedQuantity - reward.backersCount)} left of {reward.limitedQuantity}
                      </span>
                    </div>
                  )}
                </div>

                {/* Items Included */}
                {reward.itemsIncluded.length > 0 && (
                  <div className="pt-2 border-t border-dashed">
                    <span className="font-semibold text-xs uppercase tracking-wider block mb-2">Includes:</span>
                    <ul className="text-sm space-y-1">
                      {reward.itemsIncluded.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-foreground" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="p-4 bg-muted/30 border-t border-border group cursor-pointer"
                onClick={() => !reward.isSoldOut && selectReward(reward.id)}>
                {reward.isSoldOut ? (
                  <Button disabled className="w-full" variant="outline">Sold Out</Button>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity rounded-md" />
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                      Pledge ${reward.price}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </aside>

    </div>
  )
}
