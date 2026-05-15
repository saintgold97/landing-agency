"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { SectionContentMap } from "@/types/sections/index"

interface ServicesSectionProps {
  content: SectionContentMap['services']
}

export function ServicesSection({ content }: ServicesSectionProps) {
  const { description, image, services, subtitle, title } = content
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
      id="services"
      className="py-24 md:py-32 lg:py-40 bg-primary text-primary-foreground overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div
            className={`relative aspect-[4/5] lg:aspect-square order-2 lg:order-1 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
          >
            {image &&
              <div className="absolute inset-0 bg-primary-foreground/10 rounded-sm overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt || "Spa Image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            }
            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-32 h-32 border border-primary-foreground/30 -z-10" />
          </div>

          {/* Content */}
          <div
            className={`order-1 lg:order-2 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
          >
            {/* Subtitle */}
            <p className="text-primary-foreground/70 text-sm uppercase tracking-[0.3em] mb-4">
              {subtitle}
            </p>

            {/* Title */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-8 text-balance">
              {title}
            </h2>

            {/* Description */}
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-10 text-pretty">
              {description}
            </p>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-primary-foreground/60 mb-6">
                Trattamenti Esclusivi
              </h3>
              {services.map((service, index) => (
                <div
                  key={`service-${index}`}
                  className={`flex items-center justify-between py-4 border-b border-primary-foreground/20 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-primary-foreground/60">{service.duration}</p>
                  </div>
                  <span className="text-primary-foreground/80">{service.price}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#contatti"
              className="inline-flex items-center gap-3 mt-10 text-sm uppercase tracking-wider text-primary-foreground border-b border-primary-foreground pb-1 hover:border-primary-foreground/50 transition-colors"
            >
              Prenota un Trattamento
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
