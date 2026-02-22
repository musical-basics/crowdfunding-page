"use client"

import { useCampaign } from "@/context/campaign-context"
import { useImageLightbox, ImageLightbox } from "@/components/crowdfunding/image-lightbox"

export function CreatorPage() {
  const { campaign } = useCampaign()
  const { lightboxSrc, openLightbox, closeLightbox } = useImageLightbox()

  if (!campaign) return <div className="p-12 text-center text-muted-foreground">Loading creator story...</div>

  // Try to extract image URLs from pageContent JSON if available
  let images = {
    carnegie: "",
    personal: "",
    problem: "",
    product1: "",
    comparison: "",
  }
  if (campaign.creator.pageContent) {
    try {
      const parsed = JSON.parse(campaign.creator.pageContent)
      images.carnegie = parsed.story?.images?.carnegie || ""
      images.personal = parsed.story?.images?.personal || ""
      images.problem = parsed.problem?.image || ""
      images.product1 = parsed.solution?.images?.product1 || ""
      images.comparison = parsed.solution?.images?.comparison || ""
    } catch {
      // Not JSON, no images to extract
    }
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">The Creator</p>
        <h2 className="text-4xl md:text-5xl font-serif mb-4 text-foreground">Meet the Founder</h2>
        <p className="text-muted-foreground font-sans text-lg">
          Concert pianist turned entrepreneur, building the keyboard I always wished existed.
        </p>
      </div>

      {/* My Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-4">
        <div className="space-y-6">
          <h3 className="text-3xl font-serif text-foreground">My Story</h3>
          <p className="font-sans text-muted-foreground leading-relaxed">
            I've been a concert pianist for years, performing at Carnegie Hall, Lincoln Center, and venues around the world. But there's something most people never saw: I was constantly fighting against the piano.
          </p>
          <p className="font-sans text-muted-foreground leading-relaxed">
            My hands span just under 8.5 inches. That meant many traditional pieces were difficult, sometimes impossible, for me to play comfortably. No matter how much I practiced, I felt like the instrument wasn't built for me.
          </p>
          <p className="font-sans text-foreground font-medium leading-relaxed">
            So I asked myself: "What if the piano could be designed to fit the pianist, instead of the other way around?"
          </p>
          <p className="font-sans text-foreground text-lg font-medium">
            That's where DreamPlay was born.
          </p>
        </div>
        <div className="space-y-4">
          {/* Carnegie Image */}
          <div className="aspect-video bg-muted/50 border border-border overflow-hidden flex items-center justify-center relative">
            {images.carnegie ? (
              <img src={images.carnegie} alt="Performance at Carnegie Hall" className="object-cover w-full h-full cursor-pointer" onClick={() => openLightbox(images.carnegie)} />
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <p className="font-medium">Carnegie Hall Performance Photo</p>
              </div>
            )}
          </div>
          {/* Personal Image */}
          <div className="aspect-video bg-muted/50 border border-border overflow-hidden flex items-center justify-center relative">
            {images.personal ? (
              <img src={images.personal} alt="Personal" className="object-cover w-full h-full cursor-pointer" onClick={() => openLightbox(images.personal)} />
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <p className="font-medium">Personal Photo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* The Problem Section */}
      <div className="border-t border-border pt-12 space-y-8">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">The Problem</p>
          <h3 className="text-3xl md:text-4xl font-serif text-foreground">The Problem I Wanted to Solve</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="font-sans text-muted-foreground leading-relaxed">
              Most pianos are designed for large hand spans, at least 8.5 inches. But <strong className="text-foreground">87% of women</strong> and <strong className="text-foreground">24% of men</strong> fall short of that.
            </p>
            <p className="font-sans text-muted-foreground leading-relaxed">
              That means strain, tension, and frustration. I know because I lived it.
            </p>
          </div>
          <div className="aspect-square bg-muted/50 border border-border overflow-hidden flex items-center justify-center relative">
            {images.problem ? (
              <img src={images.problem} alt="Hand span statistics" className="object-cover w-full h-full cursor-pointer" onClick={() => openLightbox(images.problem)} />
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <p className="font-medium">Infographic</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* The Solution Section */}
      <div className="border-t border-border pt-12 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">The Answer</p>
          <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-4">The Solution: DreamPlay</h3>
          <p className="font-sans text-lg text-muted-foreground">
            DreamPlay is the instrument I always wished I had: a professional keyboard designed to fit your hands.
          </p>
        </div>

        {/* Product Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-video bg-muted/50 border border-border overflow-hidden flex items-center justify-center">
            {images.product1 ? (
              <img src={images.product1} alt="DreamPlay One" className="object-cover w-full h-full cursor-pointer" onClick={() => openLightbox(images.product1)} />
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <p className="font-medium">Keyboard Product Shot</p>
              </div>
            )}
          </div>
          <div className="aspect-video bg-muted/50 border border-border overflow-hidden flex items-center justify-center">
            {images.comparison ? (
              <img src={images.comparison} alt="Key size comparison" className="object-cover w-full h-full cursor-pointer" onClick={() => openLightbox(images.comparison)} />
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <p className="font-medium">Comparison Shot</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {[
            { title: "Two Sizes Available", desc: "Choose between DS5.5 (hand spans < 7.6\") or DS6.0 (7.6–8.5\")." },
            { title: "Authentic Grand Piano Feel", desc: "Weighted keys with expressive touch for a truly professional playing experience." },
            { title: "LED Learning System", desc: "My proprietary system designed for faster learning and improved practice sessions." },
            { title: "Portable, Modern Design", desc: "Perfect for home, studio, or stage. Take your music anywhere." },
            { title: "Professional Sound Quality", desc: "Inspiring, studio-quality tone that brings your music to life." },
          ].map((feature, idx) => (
            <div key={idx} className="p-8 bg-background">
              <h4 className="font-serif text-xl mb-3 text-foreground">{feature.title}</h4>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Who DreamPlay Is For */}
      <div className="border-t border-border pt-12 space-y-8">
        <div className="text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">Our Audience</p>
          <h3 className="text-3xl md:text-4xl font-serif text-foreground">Who DreamPlay Is For</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
          {[
            { num: "1", label: "Pianists with smaller hand spans", desc: "like me, who want comfort and freedom." },
            { num: "2", label: "Students", desc: "starting their piano journey with the right foundation." },
            { num: "3", label: "Professionals", desc: "who want speed, comfort, and expressive control." },
            { num: "4", label: "Anyone", desc: "who wants to unlock their full musical potential." },
          ].map((item, idx) => (
            <div key={idx} className="p-8 bg-background flex items-start gap-6">
              <div className="h-10 w-10 flex items-center justify-center bg-secondary border border-border font-serif text-xl text-foreground shrink-0">
                {item.num}
              </div>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{item.label}</strong> {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxSrc && <ImageLightbox src={lightboxSrc} onClose={closeLightbox} />}
    </div>
  )
}
