"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { SectionContentMap } from "@/types/sections/index"


interface AboutSectionProps {
  content: SectionContentMap['about']
}

export function AboutSection({ content }: AboutSectionProps) {
  const { title, description, features, image, subtitle } = content
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
      id="about"
      className="py-24 md:py-32 lg:py-40 bg-beige"
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
              {subtitle}
            </p>

            {/* Title */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-medium mb-8 text-balance">
              {title}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 text-pretty">
              {description}
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={`feature-${index}`}
                  className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  style={{ transitionDelay: `${300 + index * 150}ms` }}
                >
                  <div className="w-12 h-px bg-accent mb-4" />
                  <h3 className="font-medium text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div
            className={`relative aspect-[4/5] lg:aspect-[3/4] transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <div className="absolute inset-0 bg-muted rounded-sm overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-accent -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
