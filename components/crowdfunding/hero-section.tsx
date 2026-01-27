"use client"

import * as React from "react"
import Image from "next/image"
import { Heart, Share2, Play } from "lucide-react"
import { useCampaign } from "@/context/campaign-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

export function HeroSection() {
  const { campaign } = useCampaign() // Fixes lint: 'campaign' is possibly 'null'
  if (!campaign) return null
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [textboxOpen, setTextboxOpen] = React.useState(false)

  // Combine hero and gallery into one list for the slider
  const allImages = [campaign.images.hero, ...campaign.images.gallery]

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const handleThumbnailClick = (index: number) => {
    if (api) api.scrollTo(index)
  }

  return (
    <div className="space-y-4">
      {/* Main Slider */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
        <Carousel setApi={setApi} className="w-full h-full">
          <CarouselContent>
            {allImages.map((src, index) => (
              <CarouselItem key={index}>
                <div
                  className="relative aspect-video w-full h-full flex items-center justify-center bg-black/5 cursor-zoom-in"
                  onClick={() => setTextboxOpen(true)}
                >
                  {/* In a real app, use next/image here. For mock, we use a placeholder if src is invalid */}
                  {src.startsWith('/') ? (
                    <Image
                      src={src}
                      alt={`Product view ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  ) : (
                    <span className="text-muted-foreground">Image {index + 1}</span>
                  )}

                  {/* Play Button Overlay (Mock for video) */}
                  {index === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 transition-transform hover:scale-110">
                        <Play className="h-6 w-6 text-white fill-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between p-4">
            <CarouselPrevious className="pointer-events-auto relative left-0 translate-x-0 h-10 w-10 bg-white/80 hover:bg-white text-black border-none shadow-sm" />
            <CarouselNext className="pointer-events-auto relative right-0 translate-x-0 h-10 w-10 bg-white/80 hover:bg-white text-black border-none shadow-sm" />
          </div>
        </Carousel>

        {/* Full Screen Button Overlay */}
        <div className="absolute bottom-4 right-4 z-10">
          <Button size="sm" variant="secondary" className="gap-2 shadow-sm" onClick={() => setTextboxOpen(true)}>
            <Play className="h-4 w-4" /> View Fullscreen
          </Button>
        </div>


      </div>

      <Lightbox
        open={textboxOpen}
        close={() => setTextboxOpen(false)}
        index={current}
        slides={allImages.map(src => ({
          src
        }))}
      />

      {/* Thumbnails Strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {allImages.map((src, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`
              relative flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all
              ${current === index
                ? "border-emerald-600 ring-2 ring-emerald-600/20"
                : "border-transparent opacity-60 hover:opacity-100"}
            `}
          >
            {src.startsWith('/') ? (
              <Image src={src} alt="thumbnail" fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-xs">
                {index + 1}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
