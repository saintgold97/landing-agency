"use client"

import { SectionContentMap } from "@/types/sections/index"
import { useRef, useEffect, useState } from "react"

interface TestimonialsSectionProps {
content: SectionContentMap['testimonials'] 
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const { items } = content
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [items.length])

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-24 md:py-32 lg:py-40 bg-secondary"
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 md:mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-4">
            Testimonianze
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-medium text-balance">
            Le Storie dei Nostri Ospiti
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Quote */}
          <div className="text-center mb-12 min-h-[200px] flex flex-col items-center justify-center">
            {/* Rating Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={`star-${i}`}
                  className={`w-5 h-5 ${
                    i < items[activeIndex].rating!
                      ? "text-accent"
                      : "text-muted-foreground/30"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Review Text */}
            <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground font-medium leading-relaxed mb-8 text-balance">
              &ldquo;{items[activeIndex].review}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="text-center">
              <p className="font-medium text-foreground">
                {items[activeIndex].name}
              </p>
              {items[activeIndex].location && (
                <p className="text-sm text-muted-foreground">
                  {items[activeIndex].location}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3">
            {items.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-accent"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
