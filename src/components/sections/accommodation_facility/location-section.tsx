"use client"

import { SectionContentMap } from "@/types/sections/index"
import { useRef, useEffect, useState } from "react"

interface LocationSectionProps {
  content: SectionContentMap['location']
}

export function LocationSection({ content }: LocationSectionProps) {
  const { address, description, title, coordinates, mapEmbed } = content
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="location"
      className="py-24 md:py-32 lg:py-40 bg-background"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Subtitle */}
            <p className="text-accent text-sm uppercase tracking-[0.3em] mb-4">
              Posizione
            </p>

            {/* Title */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-medium mb-8 text-balance">
              {title}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 text-pretty">
              {description}
            </p>

            {/* Address */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-10 h-10 bg-secondary flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Indirizzo</h3>
                <p className="text-muted-foreground">{address}</p>
              </div>
            </div>

            {/* Directions Link */}
            {coordinates && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-wider text-primary border-b border-primary pb-1 hover:border-primary/50 transition-colors"
              >
                Ottieni Indicazioni
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>

          {/* Map Placeholder */}
          <div
            className={`relative aspect-square lg:aspect-[4/3] transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {mapEmbed ? (
              <iframe
                src={mapEmbed}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location map"
              />
            ) : (
              <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center">
                {/* Decorative Map Illustration */}
                <div className="w-full h-full relative overflow-hidden bg-secondary">
                  {/* Abstract map pattern */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute border-l border-border"
                        style={{
                          left: `${(i + 1) * 8}%`,
                          top: 0,
                          height: "100%",
                        }}
                      />
                    ))}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute border-t border-border"
                        style={{
                          top: `${(i + 1) * 12}%`,
                          left: 0,
                          width: "100%",
                        }}
                      />
                    ))}
                  </div>
                  {/* Location Pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg mb-3">
                      <svg
                        className="w-6 h-6 text-background"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C7.02 0 3 4.02 3 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.98-4.02-9-9-9zm0 12.75a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z" />
                      </svg>
                    </div>
                    <div className="bg-background px-4 py-2 shadow-md">
                      <p className="text-xs font-medium text-foreground whitespace-nowrap">
                        {address.split(",")[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
