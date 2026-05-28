"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { SectionContentMap } from "@/types/sections/index"
import { GalleryLightbox } from "@/components/ui/GalleryLightbox"
import { AnimatePresence } from "framer-motion"

interface GallerySectionProps {
  content: SectionContentMap['gallery']
}

export function GallerySection({ content }: GallerySectionProps) {
  const { images } = content
  const sectionRef = useRef<HTMLElement>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index)
    setLightboxOpen(true)
  }, [])

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  return (
    <>
      <section
        ref={sectionRef}
        id="gallery"
        className="py-24 md:py-32 lg:py-40 bg-background"
      >
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div
            className={`text-center max-w-2xl mx-auto mb-16 md:mb-20 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-accent text-sm uppercase tracking-[0.3em] mb-4">
              Galleria
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-medium text-balance">
              Momenti di Bellezza
            </h2>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {images.map((image, index) => {
              // Create varied aspect ratios for visual interest
              const isLarge = index === 0 || index === 4
              const isTall = index === 2

              return (
                <button
                  key={image.id || `gallery-image-${index}`}
                  onClick={() => openLightbox(index)}
                  className={`relative overflow-hidden bg-muted cursor-pointer group transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  } ${isLarge ? "md:col-span-2 md:row-span-2" : ""} ${
                    isTall ? "row-span-2" : ""
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  aria-label={`View ${image.alt}`}
                >
                  <div
                    className={`relative w-full ${
                      isLarge
                        ? "aspect-square md:aspect-[4/3]"
                        : isTall
                        ? "aspect-[3/4]"
                        : "aspect-square"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt || `Gallery image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={
                        isLarge
                          ? "(max-width: 768px) 100vw, 66vw"
                          : "(max-width: 768px) 50vw, 33vw"
                      }
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500" />
                    {/* Category Badge */}
                    {image.category && (
                      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {image.category}
                      </div>
                    )}
                    {/* Expand Icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <svg
                        className="w-5 h-5 text-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      
      <AnimatePresence>
        {lightboxOpen && (
          <GalleryLightbox
            images={images}
            currentIndex={activeIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            onNext={nextImage}
            onPrev={prevImage}
            isImageLoaded={true}
          />
        )}
      </AnimatePresence>
    </>
  )
}
