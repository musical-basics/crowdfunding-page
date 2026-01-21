"use client"

import Image from "next/image"
import { Heart, AtSign, MapPin } from "lucide-react"

export function HeroSection() {
  return (
    <div className="space-y-4">
      {/* Hero Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-border">
        <Image
          src="/images/hero-piano.png"
          alt="DreamPlay One - Standard Piano Keys Are Too Wide"
          fill
          className="object-cover px-[0] py-[0] my-[0]"
          priority
        />
      </div>

      {/* Project Badges */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
          <span>Project We Love</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AtSign className="h-4 w-4" />
          <span>Gadgets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>Las Vegas, NV</span>
        </div>
      </div>
    </div>
  )
}
