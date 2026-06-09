"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { SectionContentMap } from "@/types/sections/index";

interface HeroCinematicScrollProps { content: SectionContentMap["heroCinematicScroll"] }

export function HeroCinematicScrollV2({ content: {
  title,
  subtitle,
  fallbackImage,
  scrollImage,
  ctaPrimary,
  ctaSecondary,
  description,
  insideCopy,
  scrollCopy,
} }: HeroCinematicScrollProps) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "+=200%",
          scrub: isMobile ? 0.4 : 0.8,
          pin: true,
          anticipatePin: 1,
        },
      });

      // =========================================================================
      // 🎬 1. Exterior zoom + headline exit
      // =========================================================================
      tl.to(".hero-exterior-wrap", {
        scale: isMobile ? 1.15 : 1.25,
        ease: "none",
      }, 0)

        .to(".hero-headline", {
          y: -40,
          opacity: 0,
          ease: "none",
        }, 0)

        // =========================================================================
        // 🚪 2. Doors open (sync)
        // =========================================================================
        .to(".door-left", {
          xPercent: -100,
          ease: "power1.inOut",
        }, 0.1)

        .to(".door-right", {
          xPercent: 100,
          ease: "power1.inOut",
        }, 0.1)

        // =========================================================================
        // ✨ 3. Light bloom moment
        // =========================================================================
        .to(".door-glow", {
          opacity: 1,
          scale: 1.1,
          ease: "power1.out",
        }, 0.15)

        // =========================================================================
        // 🟦 4. Interior entrance (FOCUS PULL)
        // =========================================================================
        .fromTo(
          ".hero-interior",
          {
            opacity: 0,
            scale: 1.05,
          },
          {
            opacity: 1,
            scale: 1,
            ease: "power1.out",
          },
          0.35
        )

        // =========================================================================
        // 🎥 5. Interior parallax (subtle camera drift)
        // =========================================================================
        .to(".hero-interior", {
          scale: 1.02,
          ease: "none",
        }, 0.5)

        // =========================================================================
        // 📝 6. Inside copy reveal
        // =========================================================================
        .fromTo(
          ".hero-inside-copy",
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            ease: "power1.out",
          },
          0.55
        );

    }, wrap);

    return () => ctx.revert();
  }, []);

  const titleSplit = title.split(" ");
  const highlighted = titleSplit.slice(-1).join(" ");
  const normal = titleSplit.slice(0, -1).join(" ");

  return (
    <section id="heroCinematicScroll" ref={wrap} className="relative h-screen w-full overflow-hidden bg-ink text-bone">

      {/* LAYER 1: Interior layer (Sfondo profondo) */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <Image
          src={fallbackImage.src}
          alt={fallbackImage.alt}
          className="hero-interior absolute inset-0 h-full w-full object-cover opacity-0 will-change-transform"
          width={fallbackImage?.width ?? 1920}
          height={fallbackImage?.height ?? 1080}
          priority
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/60 pointer-events-none" />
      </div>

      {/* LAYER 2: Exterior layer (Le porte che si aprono - Z-INDEX 20) */}
      <div className="hero-exterior-wrap absolute inset-0 will-change-transform transform-gpu z-20">
        <div className="absolute inset-0 overflow-hidden">
          {/* LEFT HALF */}
          <div
            className="door-left absolute inset-0 will-change-[transform,clip-path] transform-gpu"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
          >
            {scrollImage && (
              <Image
                src={scrollImage.src}
                alt={scrollImage.alt}
                className="absolute inset-0 h-full w-full object-cover"
                width={scrollImage.width ?? 1920}
                height={scrollImage.height ?? 1080}
                priority
                loading="eager"
              />
            )}
          </div>

          {/* RIGHT HALF */}
          <div
            className="door-right absolute inset-0 will-change-[transform,clip-path] transform-gpu"
            style={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" }}
          >
            {scrollImage && (
              <Image
                src={scrollImage.src}
                alt={scrollImage.alt}
                className="absolute inset-0 h-full w-full object-cover"
                width={scrollImage.width ?? 1920}
                height={scrollImage.height ?? 1080}
                priority
                loading="eager"
              />
            )}
          </div>

          {/* Glow */}
          <div
            className="door-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[50vh] w-[50vh] rounded-full opacity-0 blur-2xl pointer-events-none z-30"
            style={{
              background: "radial-gradient(circle, rgba(244, 207, 147, 0.8), rgba(206, 159, 99, 0.3) 40%, transparent 70%)",
            }}
          />
        </div>
        <div className="absolute inset-0 vignette grain pointer-events-none z-40" />
      </div>

      {/* LAYER 3: Particles (Z-INDEX 30) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden sm:block z-30">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="particle absolute block h-[3px] w-[3px] rounded-full bg-champagne/70 blur-[1px]" style={{ left: `${(i * 53) % 100}%`, bottom: `-${(i * 7) % 30}vh`, animationDuration: `${14 + (i % 7) * 3}s`, animationDelay: `${(i % 9) * 1.4}s` }} />
        ))}
      </div>

      {/* LAYER 4: Headline Principale (SOPRA TUTTO - Z-INDEX 50) */}
      <div className="relative z-50 flex h-full flex-col items-center justify-center px-6 text-center pointer-events-auto">
        <div className="hero-headline">
          <p className="mb-8 tracking-luxury text-[11px] uppercase text-champagne">— {subtitle} —</p>
          <h1 className="font-serif text-[clamp(3rem,11vw,11rem)] leading-[0.92] text-balance">
            <span className="block italic font-extralight">{normal}</span>
            <span className="block text-gradient-gold -mt-2">{highlighted}</span>
          </h1>
          <p className="mx-auto mt-10 max-w-xl text-pretty text-[15px] leading-relaxed text-bone/80">
            {description}
          </p>
          <div className="mt-12 flex items-center justify-center gap-4">
            {ctaPrimary && (
              <a
                href={ctaPrimary.href}
                className="group inline-flex bg-primary text-primary-foreground hover:bg-primary/90 items-center gap-3 px-7 py-3.5 text-ink tracking-editorial text-[10px] uppercase transition-all duration-500 rounded-md"
              >
                {ctaPrimary.text}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            )}
            {ctaSecondary && (
              <a
                href={ctaSecondary.href}
                className={`group inline-flex items-center gap-3 px-7 py-3.5 tracking-editorial text-[10px] uppercase transition-all duration-500 `}
              >
                {ctaSecondary.text}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* LAYER 5: Inside reveal (Testo finale che compare dopo l'apertura - Z-INDEX 50) */}
      {insideCopy && (
        <div className="hero-inside-copy absolute bottom-24 left-0 right-0 z-50 px-6 text-center opacity-0 pointer-events-none">
          <p className="tracking-luxury text-[11px] uppercase text-champagne">{insideCopy?.title}</p>
          <p className="mx-auto mt-4 max-w-md font-serif text-2xl italic text-bone/95">{insideCopy?.description}</p>
        </div>
      )}

      {/* LAYER 6: Scroll indicator (Z-INDEX 50) */}
      {scrollCopy && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-bone/60 pointer-events-none">
          <span className="tracking-editorial text-[10px] uppercase">{scrollCopy}</span>
          <span className="block h-10 w-px bg-gradient-to-b from-champagne to-transparent" />
        </div>
      )}
    </section>
  );
}