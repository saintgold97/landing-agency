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
      gsap.to(".cta-bg", {
        scale: 1.5,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
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
      className="relative h-[100vh] min-h-[700px] overflow-hidden text-bone"
    >
      {backgroundImage &&
        <Image
          src={backgroundImage?.src}
          alt={backgroundImage?.alt ?? "Background"}
          loading="lazy"
          width={1920}
          height={1200}
          className="cta-bg absolute inset-0 h-full w-full object-cover will-change-transform"
        />
      }
      {overlay && <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/80" />}
      <div className="absolute inset-0 grain" />

      <div className="relative z-10 h-full mx-auto max-w-[1300px] px-6 md:px-12 flex flex-col justify-center items-center text-center">
        <p className="tracking-luxury text-[11px] uppercase text-muted mb-8 animate-float">
          {subtitle}
        </p>
        <h2 className="font-serif text-[clamp(3rem,9vw,9rem)] leading-[0.92] text-balance max-w-5xl">
          {normal} <em className="italic text-gradient-gold">{highlighted}</em>.
        </h2>
        <p className="mt-10 max-w-xl text-pretty text-[15px] leading-relaxed text-bone/80">
          {description}
        </p>

        <div className="mt-14 flex flex-col sm:flex-row items-center gap-5">
          {primaryButton &&
            <a
              href={primaryButton.href}
              target="_blank"
        rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 bg-bone text-ink px-10 py-5 tracking-editorial text-[11px] uppercase overflow-hidden"
            >
              <span className="relative z-10">{primaryButton.text}</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 gradient-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            </a>
          }
          {secondaryButton &&
            <a
              href={secondaryButton.href}
              className="tracking-editorial text-[10px] uppercase border-b border-champagne/60 pb-1 hover:text-champagne transition-colors"
            >
              {secondaryButton.text}
            </a>
          }
        </div>
      </div>
    </section>
  );
}
