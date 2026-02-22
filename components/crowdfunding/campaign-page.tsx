"use client"

import { useState, useEffect } from "react"
import { useCampaign } from "@/context/campaign-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { CommunityTab } from "@/components/crowdfunding/community-tab"
import { CreatorPage } from "@/components/crowdfunding/creator-page"
import { useImageLightbox, ImageLightbox } from "@/components/crowdfunding/image-lightbox"

export function CampaignPage() {
  const { campaign, isLoading, selectReward } = useCampaign()
  const [activeSection, setActiveSection] = useState("story")
  const [rewardTab, setRewardTab] = useState<'bundle' | 'keyboard_only'>('bundle')
  const { lightboxSrc, openLightbox, closeLightbox, handleContainerClick } = useImageLightbox()


  if (isLoading || !campaign) {
    return <div className="py-12 text-center text-muted-foreground">Loading campaign...</div>
  }

  const hiddenSections = campaign.hiddenSections || []

  const sections = [
    { id: "story", label: "Story" },
    { id: "features", label: "Features" },
    { id: "specs", label: "Technical Details" },
    { id: "creator", label: "Creator" },
    { id: "manufacturer", label: "Manufacturer" },
    { id: "shipping", label: "Shipping" },
    { id: "community", label: "Community" },
  ].filter(s => !hiddenSections.includes(s.id))

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">

        {/* --- MAIN CONTENT COLUMN --- */}
        {/* Full width on mobile, 8 cols on desktop */}
        <main className="col-span-1 md:col-span-8 space-y-16">

          {/* Story */}
          {!hiddenSections.includes('story') && (
            <section id="story" className="space-y-12 scroll-mt-24">
              {/* Intro */}
              <div className="space-y-6">
                <div className="border-b border-border pb-6">
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">Our Story</p>
                  <h2 className="text-3xl md:text-4xl font-serif text-foreground">Why playing the piano shouldn't hurt.</h2>
                </div>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  I've been a concert pianist for years. But I have a confession: <strong className="text-foreground">I always struggled with the size of the keyboard.</strong> It was just a tiny bit too big for my hands.
                </p>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  For years, I thought it was <em>my</em> fault. I thought I just needed to practice more or stretch further. But then I realized: <strong className="text-foreground">I wasn't alone.</strong>
                </p>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  That's why I created <strong className="text-foreground">DreamPlay One</strong>. It isn't just a "smaller keyboard". It's a professional instrument designed to fit your hands, not fight them.
                </p>
              </div>

              {/* Why DreamPlay One */}
              <div className="border-t border-border pt-12 space-y-8">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">Benefits</p>
                  <h3 className="text-3xl md:text-4xl font-serif text-foreground">Why DreamPlay One?</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
                  {[
                    { title: "Reach More, Strain Less", desc: "The keys are slightly narrower (15/16ths or 7/8ths of standard). This means you can finally reach octaves and large chords without stretching until it hurts." },
                    { title: "University Approved", desc: "We use the official \"DS Standard\" sizes. These are the exact same sizes used by top universities worldwide. You are playing on a professional standard, not a toy." },
                    { title: "Concert Hall Sound", desc: "We didn't sacrifice quality for comfort. We partnered with top sound engineers to ensure the DreamPlay One sounds as rich and grand as it feels." },
                    { title: "Play Anywhere", desc: "It's lightweight and compact. Take your music with you, wherever you go." },
                  ].map((item, idx) => (
                    <div key={idx} className="p-8 bg-background">
                      <h4 className="font-serif text-xl mb-3 text-foreground">{item.title}</h4>
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Choose Your Fit */}
              <div className="border-t border-border pt-12 space-y-8">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">Sizing</p>
                  <h3 className="text-3xl md:text-4xl font-serif text-foreground">Choose Your Perfect Fit</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border border-border p-8 space-y-3">
                    <h4 className="font-serif text-xl text-foreground">DS5.5 — "Small" Size</h4>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                      Designed for pianists with hands under 7.6 inches. This size allows players in "Zone A" to play octaves and 9ths with ease, and even the occasional 10th interval comfortably.
                    </p>
                  </div>
                  <div className="border border-border p-8 space-y-3">
                    <h4 className="font-serif text-xl text-foreground">DS6.0 — "Medium" Size</h4>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                      Designed for pianists with hands between 7.6 and 8.5 inches. This size allows players in "Zone B" to play octaves and 9ths with ease, and the occasional 10th without strain.
                    </p>
                  </div>
                </div>
              </div>

              {/* Specs Highlight */}
              <div className="border-t border-border pt-12 space-y-8">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">Specifications</p>
                  <h3 className="text-3xl md:text-4xl font-serif text-foreground">DreamPlay One Specs</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
                  <div className="p-8 bg-background">
                    <h4 className="font-serif text-xl mb-3 text-foreground">Authentic Feel & Sound</h4>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed">We didn't cut corners. The DreamPlay One features graded "hammer-feel" weighted keys and a beautiful, modern piano sound engine.</p>
                  </div>
                  <div className="p-8 bg-background">
                    <h4 className="font-serif text-xl mb-3 text-foreground">Smart & Connected</h4>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed">Built for the modern musician, it comes equipped with an onboard metronome, full MIDI connectivity, interactive LEDs, and seamless learning app connectivity.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Technical Details */}
          {!hiddenSections.includes('specs') && (
            <section id="specs" className="scroll-mt-24 pt-12 border-t border-border space-y-8">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">Engineering</p>
                <h3 className="text-3xl md:text-4xl font-serif text-foreground">Technical Specs</h3>
              </div>
              <div className="border border-border divide-y divide-border font-sans text-sm">
                {[
                  { label: "Keyboard Versions", value: "DS5.5 (7/8ths size) or DS6.0 (15/16ths size)" },
                  { label: "Overall Dimensions (LxWxH)", value: '48.27" × 11.65" × 5.9" (1226 × 296 × 150 mm)' },
                  { label: "Active Key Width", value: "DS 6.0: 44.53\" (1131 mm) · DS 5.5: 41.1\" (1044 mm)" },
                  { label: "Action", value: "Graded Hammer Action (Weighted)" },
                  { label: "Polyphony", value: "256 Notes (Never cut off a sound)" },
                  { label: "Connectivity", value: "USB-MIDI, Bluetooth Audio, 2× Headphone Jacks, Aux In/Out, Sustain Pedal" },
                ].map((spec, idx) => (
                  <div key={idx} className={`flex flex-col sm:flex-row ${idx % 2 === 0 ? 'bg-neutral-50/50' : 'bg-background'}`}>
                    <div className="sm:w-2/5 px-6 py-4 font-bold text-foreground">{spec.label}</div>
                    <div className="sm:w-3/5 px-6 py-4 text-muted-foreground">{spec.value}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Creator */}
          {!hiddenSections.includes('creator') && (
            <section id="creator" className="scroll-mt-24 pt-8 border-t border-border">
              <CreatorPage />
            </section>
          )}

          {/* Manufacturer */}
          {!hiddenSections.includes('manufacturer') && (
            <section id="manufacturer" className="scroll-mt-24 pt-12 border-t border-border space-y-8">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">Manufacturing</p>
                <h3 className="text-3xl md:text-4xl font-serif text-foreground">About Our Manufacturer</h3>
              </div>
              <p className="font-sans text-muted-foreground leading-relaxed">
                Our supplier, Ebulent Technologies Corporation, has been a cornerstone of precision manufacturing in Shenzhen for over two decades. We chose them not just for their factory size, but for their specific expertise in building next-generation musical instruments.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
                <div className="p-8 bg-background">
                  <h4 className="font-serif text-xl mb-3 text-foreground">The Aeroband Connection</h4>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">Ebulent is the manufacturing force behind the viral Aeroband Smart Guitar. They understand that a digital instrument must feel as responsive and soulful as an acoustic one.</p>
                </div>
                <div className="p-8 bg-background">
                  <h4 className="font-serif text-xl mb-3 text-foreground">Total Quality Control</h4>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">Unlike factories that just assemble bought parts, Ebulent builds from the ground up. From lithium batteries to complex electronics, they manufacture critical components in-house.</p>
                </div>
                <div className="p-8 bg-background">
                  <h4 className="font-serif text-xl mb-3 text-foreground">Decades of Experience</h4>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">Established in the early 2000s, Ebulent has evolved from display technologies to advanced consumer electronics. Your DreamPlay One is built with mature, time-tested reliability.</p>
                </div>
              </div>

              {/* Satisfaction Guarantee */}
              <div className="border border-border p-6 bg-neutral-50/50 text-center space-y-2">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-foreground font-bold">🛡️ Satisfaction Guarantee</p>
                <p className="font-sans text-sm text-muted-foreground">
                  Not sure if you will like it? We offer a <strong className="text-foreground">90-day, 100% full refund policy</strong> (with <strong className="text-foreground">return shipping covered</strong>).
                </p>
              </div>
            </section>
          )}

          {/* Shipping & Risks */}
          {!hiddenSections.includes('shipping') && (
            <section id="shipping" className="scroll-mt-24 pt-12 border-t border-border space-y-10">
              {/* Shipping */}
              <div className="space-y-6">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">Logistics</p>
                  <h3 className="text-3xl md:text-4xl font-serif text-foreground">Shipping & Delivery</h3>
                </div>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  We ship worldwide! Shipping costs will be calculated after the campaign ends to ensure you get the best current rates.
                </p>
                <div className="border border-border bg-neutral-50/50 p-6 space-y-2">
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-foreground font-bold">⚠️ Important for International Backers (EU/UK/Asia)</p>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    Shipping estimates <strong className="text-foreground">do not include</strong> local VAT (e.g., 19% MwSt), Import Duties, or Customs fees. These are collected by your local carrier upon delivery in accordance with your country's regulations.
                  </p>
                </div>
                <a
                  href="https://www.dreamplaypianos.com/information-and-policies/shipping"
                  target="_blank"
                  className="inline-block bg-foreground text-background font-sans text-[10px] uppercase tracking-widest font-bold px-8 py-4 hover:bg-foreground/90 transition-colors"
                >
                  View Estimated Shipping Rates →
                </a>
              </div>

              {/* Risks & Challenges */}
              <div className="border-t border-border pt-10 space-y-6">
                <h3 className="text-3xl md:text-4xl font-serif text-foreground">Risks & Challenges</h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  Every crowdfunding campaign involves some risk, but we have mitigated the biggest ones already:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
                  <div className="p-6 bg-background space-y-2">
                    <p className="font-sans text-sm font-bold text-foreground">✅ Prototype is finished</p>
                    <p className="font-sans text-sm text-muted-foreground">We aren't guessing; the piano works.</p>
                  </div>
                  <div className="p-6 bg-background space-y-2">
                    <p className="font-sans text-sm font-bold text-foreground">✅ Manufacturer secured</p>
                    <p className="font-sans text-sm text-muted-foreground">We have partnered with a reputable factory.</p>
                  </div>
                  <div className="p-6 bg-background space-y-2">
                    <p className="font-sans text-sm font-bold text-foreground">✅ Experienced Team</p>
                    <p className="font-sans text-sm text-muted-foreground">We know music and logistics.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="font-serif text-xl text-foreground">The Production Reality</h4>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">1. Tooling (90 Days):</strong> The most complex part is creating the steel molds for our custom 15/16th size keys. This takes approximately 3 months. We cannot rush this without risking quality.
                  </p>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">2. Delivery Date (August 2026):</strong> We have built a 2-month buffer into our timeline to account for potential ocean freight delays or customs congestion.
                  </p>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    We promise 100% transparency. You will be updated every single month with photos from the factory floor until the DreamPlay One is in your living room.
                  </p>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    We are working <strong className="text-foreground">overtime</strong> to make sure you get your <strong className="text-foreground">DreamPlay One</strong> within the estimated time frame. If we cannot hit the deadline, you have the option of getting your <strong className="text-foreground underline">100% of your money back</strong>, or <strong className="text-foreground">keeping your reservation spot</strong>.
                  </p>
                </div>

                {/* Refund Policy */}
                <div className="border border-border p-6 bg-neutral-50/50 text-center space-y-2">
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-foreground font-bold">Refund Policy</p>
                  <p className="font-sans text-sm text-muted-foreground">
                    Not sure if you will like it? We offer a <strong className="text-foreground">90-day, 100% full refund policy</strong> (with <strong className="text-foreground">return shipping covered</strong>).
                  </p>
                  <p className="font-sans text-sm text-muted-foreground">
                    Every crowdfunding campaign comes with risks, but we've done our homework. We have a working prototype and have partnered with a reputable manufacturer.
                  </p>
                  <p className="font-sans text-sm text-muted-foreground">
                    However, unforeseen delays can happen in manufacturing and shipping. We promise to keep you updated every step of the way.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Community / Updates */}
          {!hiddenSections.includes('community') && (
            <section id="community" className="scroll-mt-24 pt-8 border-t border-border">
              <h3 className="text-2xl font-bold mb-6">Community & Updates</h3>
              <CommunityTab isAdmin={false} />
            </section>
          )}
        </main>

        {/* --- RIGHT COLUMN: Rewards & Creator --- */}
        <aside className="hidden md:block md:col-span-4 space-y-8">

          {/* REWARDS LIST — placed above Creator for immediate pricing visibility */}
          <div className="space-y-6">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Pre-Order Now</p>

            {/* Reward Type Tabs */}
            <div className="flex gap-6 border-b border-border pb-px">
              <button
                type="button"
                onClick={() => setRewardTab('bundle')}
                className={`pb-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-200 border-b-2 cursor-pointer ${rewardTab === 'bundle'
                  ? 'text-foreground border-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                Premium Bundle
              </button>
              <button
                type="button"
                onClick={() => setRewardTab('keyboard_only')}
                className={`pb-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-200 border-b-2 cursor-pointer ${rewardTab === 'keyboard_only'
                  ? 'text-foreground border-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                Keyboard Only
              </button>
            </div>

            {campaign.rewards
              .filter(r => r.isVisible !== false)
              .filter(r => (r.rewardType || 'bundle') === rewardTab)
              .sort((a, b) => {
                if (a.isSoldOut === b.isSoldOut) return 0;
                return a.isSoldOut ? 1 : -1; // Push sold-out to bottom
              })
              .map(reward => {
                const isFeatured = reward.badgeType === 'featured' || reward.isFeatured
                const isMinPackage = reward.badgeType === 'minimum_package'
                return (
                  <Card
                    key={reward.id}
                    className={`overflow-hidden transition-all duration-200 border relative rounded-none
                    ${reward.isSoldOut
                        ? "opacity-75 bg-neutral-50 border-border grayscale-[0.5]"
                        : isFeatured
                          ? "border-2 border-foreground shadow-xl z-10 bg-neutral-50/50"
                          : isMinPackage
                            ? "border-2 border-foreground shadow-xl z-10 bg-neutral-50/50"
                            : "hover:border-neutral-400 hover:shadow-lg"
                      }`}
                  >
                    {/* SOLD OUT OVERLAY */}
                    {reward.isSoldOut && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-foreground text-background font-bold text-[10px] px-4 py-1.5 uppercase tracking-widest">
                          Sold Out
                        </div>
                      </div>
                    )}

                    {/* Badge */}
                    {isFeatured && !reward.isSoldOut && (
                      <div className="absolute top-0 right-0 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 z-20">
                        MOST POPULAR
                      </div>
                    )}
                    {isMinPackage && !reward.isSoldOut && (
                      <div className="absolute top-0 right-0 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 z-20">
                        ESSENTIAL KIT
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="space-y-1">
                        <h3 className="font-serif text-lg leading-tight flex items-center gap-2 flex-wrap">
                          {reward.title}
                        </h3>
                        <p className="text-2xl font-serif text-foreground tracking-tight">
                          ${reward.price} <span className="text-xs font-sans font-normal text-muted-foreground">approx. ¥{(reward.price * 150).toLocaleString()}</span>
                        </p>
                      </div>

                      {/* Reward Image */}
                      {reward.imageUrl && (
                        <div className="overflow-hidden aspect-video relative bg-neutral-100 border border-neutral-200 cursor-pointer" onClick={() => openLightbox(reward.imageUrl!)}>
                          <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
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
                          <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Reservations</span>
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
                        <div className="pt-2 border-t border-border">
                          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-2">Includes:</span>
                          <ul className="text-sm space-y-1 font-sans">
                            {reward.itemsIncluded.map((item, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                                <span className="text-foreground/80">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Scarcity Progress Bar */}
                    {reward.limitedQuantity && !reward.isSoldOut && (
                      <div className="px-6 pb-4">
                        <div className="flex justify-between text-[10px] font-bold text-orange-600 mb-1.5 uppercase tracking-wider">
                          <span>High Demand</span>
                          <span>{Math.max(0, reward.limitedQuantity - reward.backersCount)} Left!</span>
                        </div>
                        <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (reward.backersCount / reward.limitedQuantity) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="p-4 border-t border-border group cursor-pointer"
                      onClick={() => !reward.isSoldOut && selectReward(reward.id)}>
                      {reward.isSoldOut ? (
                        <Button disabled className="w-full bg-neutral-200 text-neutral-500 rounded-none" variant="ghost">Sold Out</Button>
                      ) : (
                        <Button className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-none uppercase tracking-widest text-[10px] font-bold h-12 cursor-pointer">
                          Reserve for ${reward.price}
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
          </div>

          <div className="h-px bg-border w-full" />

          {/* Creator Profile — moved below rewards */}
          <div className="space-y-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Creator</p>
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
            <Button variant="outline" className="w-full text-xs h-8" asChild>
              <a href="mailto:lionel@dreamplaypianos.com">Contact Creator</a>
            </Button>
          </div>
        </aside>

      </div>

      {/* Lightbox Overlay */}
      {lightboxSrc && <ImageLightbox src={lightboxSrc} onClose={closeLightbox} />}
    </>
  )
}
