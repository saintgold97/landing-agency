// src/components/sections/accommodation_facility_cinematic/Gallery.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SectionContentMap } from "@/types/sections";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";

interface GalleryProps {
  content: SectionContentMap["gallery"];
}

export function Gallery({ content: { images, title, subtitle, layout = "grid" } }: GalleryProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // ============================================================================
  // 🎬 GSAP Animations: reveal + parallax on hover
  // ============================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gal-item").forEach((el, i) => {
        // Reveal animation on scroll
        gsap.fromTo(
          el,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: (i % 4) * 0.05,
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
        // Subtle parallax on scroll
        const img = el.querySelector("img");
        if (img) {
          gsap.to(img, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  // ============================================================================
  // ⌨️ Keyboard navigation for lightbox
  // ============================================================================
  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenIndex(null);
      } else if (e.key === "ArrowRight") {
        setOpenIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
      } else if (e.key === "ArrowLeft") {
        setOpenIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, images.length]);

  // ============================================================================
  // 🖱️ Track loaded images for smooth lightbox open
  // ============================================================================
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  // ============================================================================
  // 🎨 Title split for gradient highlight
  // ============================================================================
  const titleParts = title?.split(" ") ?? [];
  const highlighted = titleParts.slice(-1).join(" ");
  const normal = titleParts.slice(0, -1).join(" ");

  return (
    <section id="gallery" ref={wrap} className="relative bg-ink text-bone py-32 md:py-48">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        {/* Header */}
        <header className="flex items-end justify-between mb-16">
          <div>
            {subtitle && (
              <p className="tracking-luxury text-[11px] uppercase text-champagne mb-6" aria-hidden>
                - {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95]">
                {normal} <em className="text-gradient-gold">{highlighted}</em>
              </h2>
            )}
          </div>
        </header>

        {/* Gallery Grid */}
        <div
          role="list"
          aria-label="Photo gallery"
          className={`grid gap-3 md:gap-4 ${layout === "carousel"
            ? "grid-flow-col auto-cols-[85%] md:auto-cols-[30%] overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:-mx-12 md:px-12 scrollbar-hide"
            : "grid-cols-2 md:grid-cols-4 auto-rows-[26vh] md:auto-rows-[30vh]"
            }`}
        >
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              type="button"
              onClick={() => setOpenIndex(i)}
              className={`gal-item group relative overflow-hidden bg-card/10 focus:outline-none focus:ring-2 focus:ring-champagne/50 focus:ring-offset-2 focus:ring-offset-ink transition-all duration-300 cursor-pointer`}
              aria-label={`View ${img.alt}`}
              role="listitem"
            >
              {/* Image with optimized loading */}
              <Image
                src={img.src}
                alt={img.alt}
                fill
                loading={i < 4 ? "eager" : "lazy"}
                priority={i < 2}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="absolute inset-0 h-[120%] w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
                onLoad={() => handleImageLoad(i)}
              />

              {/* Hover overlay */}
              <span className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500" aria-hidden />

              {/* Caption on hover */}
              <span className="absolute bottom-4 left-4 right-4 tracking-editorial text-[10px] uppercase text-bone/90 opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus:translate-y-0 transition-all duration-500 line-clamp-2">
                {img.alt}
              </span>

              {/* Category badge (optional) */}
              {img.category && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-ink/70 backdrop-blur-sm text-[9px] uppercase tracking-wider text-champagne rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.category}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {openIndex !== null && (
          <GalleryLightbox
            images={images}
            currentIndex={openIndex}
            isOpen={true}
            onClose={() => setOpenIndex(null)}
            onNext={() => setOpenIndex((prev) => (prev !== null ? (prev + 1) % images.length : null))}
            onPrev={() => setOpenIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null))}
            isImageLoaded={loadedImages.has(openIndex)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}