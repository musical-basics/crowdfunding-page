"use client"

import * as React from "react"
import Image from "next/image"
import { Play, X, Loader2 } from "lucide-react" // Added Loader2
import { useCampaign } from "@/context/campaign-context"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

export function HeroSection() {
  const { campaign } = useCampaign()

  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [videoOpen, setVideoOpen] = React.useState(false)

  // State to track when video is ready to show
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false)

  // Reset video loaded state when dialog closes
  React.useEffect(() => {
    if (!videoOpen) {
      setIsVideoLoaded(false)
    }
  }, [videoOpen])

  const allImages = campaign ? [campaign.images.hero, ...campaign.images.gallery] : []

  React.useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (!campaign) return null

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
                  onClick={() => {
                    if (index === 0) {
                      setVideoOpen(true)
                    } else {
                      setLightboxOpen(true)
                    }
                  }}
                >
                  {src && src.startsWith('/') ? (
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

                  {index === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 transition-transform hover:scale-110 cursor-pointer">
                        <Play className="h-6 w-6 text-white fill-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute inset-0 pointer-events-none flex items-center justify-between p-4">
            <CarouselPrevious className="pointer-events-auto relative left-0 translate-x-0 h-10 w-10 bg-white/80 hover:bg-white text-black border-none shadow-sm" />
            <CarouselNext className="pointer-events-auto relative right-0 translate-x-0 h-10 w-10 bg-white/80 hover:bg-white text-black border-none shadow-sm" />
          </div>
        </Carousel>

        <div className="absolute bottom-4 right-4 z-10">
          <Button
            size="sm"
            variant="secondary"
            className="gap-2 shadow-sm"
            onClick={(e) => {
              e.stopPropagation()
              if (current === 0) {
                setVideoOpen(true)
              } else {
                setLightboxOpen(true)
              }
            }}
          >
            {current === 0 ? <Play className="h-4 w-4" /> : null}
            {current === 0 ? "Play Video" : "View Fullscreen"}
          </Button>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={current}
        slides={allImages.map(src => ({ src }))}
      />

      {/* Video Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent
          className="sm:max-w-5xl p-0 border-none bg-black overflow-hidden shadow-2xl"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Campaign Video</DialogTitle>

          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">

            {/* iframe is always rendered when dialog is open so autoplay works */}
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full"
              style={{ background: 'black' }}
              src="https://www.youtube.com/embed/r_FxvWH32DM?autoplay=1&mute=0&rel=0&modestbranding=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => {
                // Give YouTube player time to fully render its UI
                setTimeout(() => setIsVideoLoaded(true), 800)
              }}
            />

            {/* Black overlay that covers the iframe until it's ready - prevents any flash */}
            <div
              className={`absolute inset-0 bg-black flex items-center justify-center z-20 transition-opacity duration-500 pointer-events-none ${isVideoLoaded ? 'opacity-0' : 'opacity-100'
                }`}
            >
              <Loader2 className="h-10 w-10 text-white/50 animate-spin" />
            </div>

            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-50"
              aria-label="Close video"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
