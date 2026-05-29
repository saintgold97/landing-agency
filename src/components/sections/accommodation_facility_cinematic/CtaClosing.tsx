// src/components/sections/CtaClosing.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { SectionContentMap } from "@/types/sections/index";

interface CtaClosingProps { content: SectionContentMap["cta"] }

export function CtaClosing({ content: { title, subtitle, description, primaryButton, secondaryButton, backgroundImage, overlay = true } }: CtaClosingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      gsap.fromTo(".cta-bg",
        {
          scale: isMobile ? 1.2 : 1.35,
          yPercent: isMobile ? -10 : -15
        },
        {
          scale: 1.05,
          yPercent: isMobile ? 10 : 15,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: isMobile ? true : 0.5
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  const titleSplit = title.split(" ");
  const highlighted = titleSplit.slice(-2).join(" ");
  const normal = titleSplit.slice(0, -2).join(" ");

  return (
    <section
      id="cta"
      ref={ref}
      className="relative h-[100dvh] min-h-[650px] md:min-h-[750px] w-full overflow-hidden text-bone bg-ink"
    >
      {backgroundImage &&
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt ?? "Background Closing Call to Action"}
          loading="lazy"
          width={1920}
          height={1200}
          className="cta-bg absolute inset-0 h-full w-full object-cover will-change-transform transform-gpu select-none pointer-events-none"
        />
      }

      {overlay && <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/90 z-1" />}
      <div className="absolute inset-0 grain z-2 pointer-events-none" />

      <div className="relative z-10 h-full mx-auto max-w-[1300px] px-6 md:px-12 flex flex-col justify-center items-center text-center">
        {subtitle && (
          <p className="tracking-luxury text-[10px] md:text-[11px] uppercase text-balance mb-6 md:mb-8 select-none">
            — {subtitle} —
          </p>
        )}

        <h2 className="font-serif text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.95] text-balance max-w-5xl tracking-tight">
          {normal} <em className="italic font-extralight text-gradient-gold not-italic">{highlighted}</em>
        </h2>

        {description && (
          <p className="mt-8 md:mt-10 max-w-xl text-pretty text-[14px] md:text-[15px] leading-relaxed text-bone/70 px-2">
            {description}
          </p>
        )}

        <div className="mt-10 md:mt-14 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto px-6 sm:px-0">
          {primaryButton &&
            <a
              href={primaryButton.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 bg-bone text-ink px-10 py-4.5 md:py-5 tracking-editorial text-[10px] md:text-[11px] uppercase overflow-hidden w-full sm:w-auto transition-colors duration-300"
            >
              <span className="relative z-10">{primaryButton.text}</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#C4A77D] to-[#E5D3B3] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.7,0,0.2,1]" />
            </a>
          }
          {secondaryButton &&
            <a
              href={secondaryButton.href}
              className="tracking-editorial text-[10px] uppercase border-b border-champagne/40 pb-1 hover:text-champagne hover:border-champagne transition-all duration-300 w-full sm:w-auto py-2 sm:py-0"
            >
              {secondaryButton.text}
            </a>
          }
        </div>
      </div>
    </section>
  );
}
