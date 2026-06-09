// src/components/sections/experiences-section.tsx
"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { SectionContentMap } from "@/types/sections/index"


interface ExperiencesSectionProps {
  content: SectionContentMap['experiences']
}

export function ExperiencesSection({ content }: ExperiencesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const { items = [], showDescriptions = true } = content

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])


  return (
    <section
      id={"experiences"}
      ref={sectionRef}
      className="py-24 md:py-32 lg:py-40 bg-muted"
    >
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 md:mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {content.subtitle && (
            <p className="text-sm uppercase text-accent tracking-[0.3em] mb-4" >
              {content.subtitle}
            </p>
          )}
          {content.title && (
            <h2 className="font-serif text-foreground text-4xl md:text-5xl lg:text-6xl font-medium text-balance">
              {content.title}
            </h2>
          )}
        </div>

        {/* Items Grid */}
        {/* <div className={`grid ${layout === "carousel" ? "md:grid-cols-1" : "md:grid-cols-3"} gap-6`}> */}
        <div className="overflow-x-auto pb-6 md:pb-0 md:grid md:grid-cols-3 gap-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          {items.map((experience, index) => (
            <article
              key={experience.id || `exp-${index}`}
              className={`group mb-8 cursor-pointer transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-secondary rounded-sm">
                <Image
                  src={experience.image.src}
                  alt={experience.image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 33vw"
                />
                {experience.link && (
                  <a href={experience.link} className="absolute inset-0" aria-label={experience.title} />
                )}
              </div>

              {/* Content */}
              <div>
                <h3 className="font-serif text-foreground text-2xl mb-2 group-hover:opacity-80 transition-colors">
                  {experience.title}
                </h3>
                {showDescriptions && experience.description && (
                  <p className="text-sm textmuted-foreground">
                    {experience.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}