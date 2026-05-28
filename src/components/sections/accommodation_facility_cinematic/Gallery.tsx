// src/components/sections/accommodation_facility_cinematic/Gallery.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { AnimatePresence } from "framer-motion";
import { SectionContentMap } from "@/types/sections";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import { ImageTicker } from "@/components/ui/image-ticker/ImageTicker";

interface GalleryProps {
  content: SectionContentMap["gallery"];
}

export function Gallery({
  content: { images, title, subtitle },
}: GalleryProps) {
  // ============================================================================
  // 🔗 Refs
  // ============================================================================

  const wrap = useRef<HTMLDivElement>(null);

  // ============================================================================
  // 🎛️ State
  // ============================================================================

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ============================================================================
  // 🎬 Section Reveal Animation
  // ============================================================================

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-reveal",
        {
          opacity: 0,
          y: 80,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top 80%",
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, []);

  // ============================================================================
  // ⌨️ Keyboard Navigation
  // ============================================================================

  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenIndex(null);
      }

      if (e.key === "ArrowRight") {
        setOpenIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : null
        );
      }

      if (e.key === "ArrowLeft") {
        setOpenIndex((prev) =>
          prev !== null
            ? (prev - 1 + images.length) % images.length
            : null
        );
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, images.length]);

  // ============================================================================
  // ✨ Editorial Title Split
  // ============================================================================

  const titleParts = title?.split(" ") ?? [];

  const highlighted = titleParts.slice(-1).join(" ");

  const normal = titleParts.slice(0, -1).join(" ");

  // ============================================================================
  // 🎨 Render
  // ============================================================================

  return (
    <section
      id="gallery"
      ref={wrap}
      className="
        relative
        overflow-hidden
        bg-ink
        py-32
        text-bone
        md:py-48
      "
    >
      {/* ============================================================================
       🎭 Cinematic Side Fades
      ============================================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-30
          w-24
          bg-gradient-to-r
          from-ink
          via-ink/80
          to-transparent
          md:w-40
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          z-30
          w-24
          bg-gradient-to-l
          from-ink
          via-ink/80
          to-transparent
          md:w-40
        "
      />

      {/* ============================================================================
       🌫️ Top Gradient Atmosphere
      ============================================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-10
          h-64
          bg-gradient-to-b
          from-black/40
          to-transparent
        "
      />

      {/* ============================================================================
       📦 Container
      ============================================================================ */}

      <div
        className="
          relative
          z-20
          mx-auto
          flex
          flex-col
          gap-20
        "
      >
        {/* ============================================================================
         📝 Header
        ============================================================================ */}

        <header
          className="
            gallery-reveal
            mx-auto
            flex
            max-w-5xl
            flex-col
            items-center
            px-6
            text-center
            md:px-12
          "
        >
          {subtitle && (
            <p
              aria-hidden
              className="
                mb-6
                text-[11px]
                uppercase
                tracking-[0.4em]
                text-champagne
              "
            >
              — {subtitle}
            </p>
          )}

          {title && (
            <h2
              className="
                max-w-4xl
                font-serif
                text-[clamp(2.8rem,7vw,7rem)]
                leading-[0.9]
                tracking-[-0.03em]
              "
            >
              {normal}{" "}
              <em className="text-gradient-gold not-italic">
                {highlighted}
              </em>
            </h2>
          )}
        </header>

        {/* ============================================================================
         🎞️ Cinematic Media Rails
        ============================================================================ */}

        <div
          className="
            gallery-reveal
            relative
            left-1/2
            w-screen
            -translate-x-1/2
          "
        >
          <ImageTicker
            items={images}
            onClick={(i) => setOpenIndex(i)}
            rows={[
              {
                direction: "left",
                speed: 24,
              },
              {
                direction: "right",
                speed: 34,
              },
              {
                direction: "left",
                speed: 20,
              },
            ]}
          />
        </div>
      </div>

      {/* ============================================================================
       🖼️ Lightbox
      ============================================================================ */}

      <AnimatePresence>
        {openIndex !== null && (
          <GalleryLightbox
            images={images}
            currentIndex={openIndex}
            isOpen={true}
            onClose={() => setOpenIndex(null)}
            onNext={() =>
              setOpenIndex((prev) =>
                prev !== null
                  ? (prev + 1) % images.length
                  : null
              )
            }
            onPrev={() =>
              setOpenIndex((prev) =>
                prev !== null
                  ? (prev - 1 + images.length) % images.length
                  : null
              )
            }
            isImageLoaded={true}
          />
        )}
      </AnimatePresence>
    </section>
  );
}