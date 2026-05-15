// src/components/sections/accommodation_facility_cinematic/Testimonials.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SectionContentMap } from "@/types/sections";

interface TestimonialsProps {
  content: SectionContentMap["testimonials"];
  autoPlayInterval?: number; // ms
}

export function Testimonials({
  content: { items, title, subtitle, showLocation, showRating },
  autoPlayInterval = 5000,
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentItem = items[currentIndex];

  // 🔁 Auto-play con pausa intelligente
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [items.length, isPaused, autoPlayInterval]);

  // ⌨️ Navigazione globale con tastiera
  const handleGlobalKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsPaused(true);
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        setIsPaused(true);
      }
    },
    [items.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [handleGlobalKey]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
  };

  if (!items?.length) return null;

  return (
    <section
      className="relative bg-bone text-ink py-24 md:py-32 lg:py-40 overflow-hidden"
      aria-labelledby="testimonials-heading"
      id="testimonials"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          {subtitle && (
            <p className="tracking-luxury text-[11px] uppercase text-gold mb-3">
              - {subtitle}
            </p>
          )}
          <h2
            id="testimonials-heading"
            className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-tight text-balance"
          >
            {title}
          </h2>
        </div>

        {/* Glass Card Container */}
        <div
          className="relative glass border border-border/50 backdrop-blur-xl rounded-lg p-8 md:p-12 lg:p-16 bg-card/30 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          {/* Decorative Quote Mark */}
          <span
            aria-hidden
            className="absolute -top-8 -left-4 md:-top-12 md:-left-8 font-serif text-[8rem] md:text-[12rem] lg:text-[14rem] leading-none text-gold/10 select-none pointer-events-none"
          >
            “
          </span>

          {/* Testimonial Content */}
          <div className="relative z-10 min-h-[180px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="w-full"
              >
                <blockquote className="font-serif italic text-xl md:text-2xl lg:text-3xl leading-relaxed text-balance mb-8">
                  “{currentItem.review}”
                </blockquote>

                <figcaption className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold flex-shrink-0" />
                    <span className="tracking-editorial text-[11px] uppercase font-medium">
                      {currentItem.name}
                    </span>
                  </div>

                  {showLocation && currentItem.location && (
                    <span className="text-muted-foreground text-sm tracking-wide">
                      · {currentItem.location}
                    </span>
                  )}

                  {showRating && typeof currentItem.rating === "number" && currentItem.rating > 0 && (
                    <span
                      className="sm:ml-auto flex items-center gap-0.5 text-gold text-sm"
                      aria-label={`Rating: ${Math.round(currentItem.rating)} out of 5 stars`}
                    >
                      {"★".repeat(Math.min(5, Math.round(currentItem.rating)))}
                      {"☆".repeat(Math.max(0, 5 - Math.round(currentItem.rating)))}
                    </span>
                  )}
                </figcaption>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Progress Indicators */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`h-1 rounded-full transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bone ${index === currentIndex ? "w-8 bg-gold" : "w-4 bg-border hover:bg-gold/50"
                    }`}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Go to testimonial ${index + 1}`}
                  tabIndex={index === currentIndex ? 0 : -1}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => goTo((currentIndex - 1 + items.length) % items.length)}
                className="group flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background/50 hover:bg-gold hover:border-gold hover:text-ink transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
                aria-label="Previous testimonial"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => goTo((currentIndex + 1) % items.length)}
                className="group flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background/50 hover:bg-gold hover:border-gold hover:text-ink transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
                aria-label="Next testimonial"
              >
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}