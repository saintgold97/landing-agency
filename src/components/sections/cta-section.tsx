"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { SectionContentMap } from "@/types/sections"

interface CtaSectionProps {
  content: SectionContentMap['cta'] 
}

export function CtaSection({ content }: CtaSectionProps) {
  const { title, subtitle, primaryButton, secondaryButton } = content
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="py-24 md:py-32 lg:py-40 bg-accent"
    >
      <div className="container mx-auto px-6">
        <div
          className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Title */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-accent-foreground font-medium mb-6 text-balance">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-accent-foreground/80 text-lg md:text-xl leading-relaxed mb-10 text-pretty">
            {subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={primaryButton.link}
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-foreground/90 transition-all duration-300"
            >
              {primaryButton.text}
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
            </Link>

            {secondaryButton && (
              <Link
                href={secondaryButton.link}
                className="inline-flex items-center gap-3 border border-accent-foreground text-accent-foreground px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-accent-foreground hover:text-accent transition-all duration-300"
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
