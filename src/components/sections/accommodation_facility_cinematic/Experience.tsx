// src/components/sections/Experience.tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import Image from "next/image";
import { SectionContentMap } from "@/types/sections";

interface ExperienceProps {
  content: SectionContentMap["experiences"];
}

export function Experience({
  content: { title, subtitle, items, layout = "grid", showDescriptions = true, backgroundImage, cit },
}: ExperienceProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // 🎬 GSAP: Parallax + Counters (Blindato per re-entry)
  // ============================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      // Parallax background solido
      if (bgRef.current) {
        gsap.fromTo(bgRef.current,
          { yPercent: isMobile ? -5 : -10 },
          {
            yPercent: isMobile ? 5 : 10,
            ease: "none",
            scrollTrigger: {
              trigger: wrap.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Counter animation attivata ONCE per evitare glitch visivi
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = Number(el.dataset.target);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true // 🛑 Impedisce il loop al rientrare della card
          },
          onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
        });
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  // ============================================================================
  // 🎠 Carousel Logic (Frecce + Swipe Nativo, No Wheel Override distruttivo)
  // ============================================================================
  const scrollToPage = useCallback((direction: "next" | "prev") => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const amount = container.clientWidth * 0.85;

    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (layout !== "carousel") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToPage("next");
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToPage("prev");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [layout, scrollToPage]);

  return (
    <section
      id="experiences"
      ref={wrap}
      // 🧱 Cambiato h-[110vh] in altezza dinamica (py) per preservare layout e responsive su schermi bassi
      className="relative w-full overflow-hidden text-bone bg-ink py-24 md:py-36"
    >
      {/* 🖼️ Parallax Background Wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundImage ? (
          <div ref={bgRef} className="absolute inset-x-0 top-[-20%] h-[140%] w-full transform-gpu will-change-transform">
            <Image
              src={backgroundImage.src}
              alt={backgroundImage.alt || "Background Experience"}
              fill
              priority
              className="object-cover select-none"
              sizes="100vw"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-ink/90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/30 to-ink z-1" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 flex flex-col h-full justify-center">
        {/* Header */}
        {subtitle && (
          <p className="tracking-luxury text-[10px] md:text-[11px] uppercase text-champagne mb-4 select-none">
            — {subtitle} —
          </p>
        )}
        {title && (
          <h2 className="font-serif text-[clamp(2.3rem,6vw,5.5rem)] leading-[0.95] max-w-4xl text-balance tracking-tight">
            {title}
          </h2>
        )}

        {/* 🎠 Items Container */}
        {items && (
          <>
            {layout === "carousel" ? (
              <div className="relative w-full">
                {/* Track con Snap Nativo ed efficiente (Ripulito dai duplicati) */}
                <div
                  ref={carouselRef}
                  className="mt-12 flex gap-6 overflow-x-scroll snap-x snap-mandatory touch-pan-x select-none scroll-smooth pb-6 -mx-6 px-6 md:-mx-12 md:px-12 scrollbar-none"
                  style={{
                    WebkitOverflowScrolling: "touch", // Inerzia nativa per iOS
                    maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                  }}
                >
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id || i}
                      // 💡 Fix: bg-[rgba(...)] racchiuso correttamente tra parentesi quadre Tailwind native
                      className="min-w-[85vw] min-h-[38vh] sm:min-w-[50vw] md:min-w-[400px] flex justify-end flex-col snap-center relative overflow-hidden p-6 md:p-8 rounded-sm text-left 
                      border border-bone/10 bg-[rgba(255,255,255,0.02)] backdrop-blur-sm shrink-0 transform-gpu"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                      whileHover={{ y: -4, borderColor: "rgba(196,167,125,0.3)", transition: { duration: 0.2 } }}
                    >
                      {item.image?.src && (
                        <Image
                          src={item.image.src}
                          alt={item.image.alt ?? item.title}
                          fill
                          className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity duration-500 pointer-events-none select-none"
                          sizes="(max-width: 768px) 85vw, 400px"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent z-1 pointer-events-none" />

                      <div className="relative z-10 w-full mt-auto pointer-events-none">
                        <div className="font-serif text-5xl md:text-6xl text-gradient-gold leading-none font-light select-none">
                          <span className="stat-num" data-target={i + 1}>0</span>
                        </div>

                        <div className="mt-4 tracking-editorial text-[10px] uppercase text-bone/90 tracking-widest font-medium">
                          {item.title}
                        </div>

                        {showDescriptions && item.description && (
                          <p className="mt-2 text-xs md:text-sm text-bone/60 line-clamp-3 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        {item.link && (
                          <a
                            href={item.link}
                            // 💡 Fix: classe inline ricomposta correttamente su un'unica linea
                            className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-editorial text-champagne hover:text-bone transition-colors group pointer-events- 
                            auto"
                          >
                            Scopri <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              /* Grid layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12 w-full">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id || i}
                    className="group relative overflow-hidden p-6 md:p-8 rounded-sm text-left bg-white/[0.02] border border-bone/10 transition-all duration-300 hover:border-champagne/30 
                    transform-gpu"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                  >
                    {item.image?.src && (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt ?? item.title}
                        fill
                        className="absolute inset-0 h-full w-full object-cover opacity-40 transition-all duration-500 group-hover:scale-103 pointer-events-none select-none"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent z-1 pointer-events-none" />
                    <div className="relative z-10 w-full h-full flex flex-col justify-end">
                      <div className="font-serif text-5xl md:text-6xl text-gradient-gold leading-none font-light">
                        <span className="stat-num" data-target={i + 1}>0</span>
                      </div>
                      <div className="mt-4 tracking-editorial text-[10px] uppercase text-bone/90 tracking-widest font-medium">{item.title}</div>
                      {showDescriptions && item.description && (
                        <p className="mt-2 text-xs text-bone/60 line-clamp-3 leading-relaxed">{item.description}</p>
                      )}
                      {item.link && (
                        <a href={item.link} className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-editorial text-champagne hover:text-bone transition-colors">
                          Scopri <span className="transition-transform group-hover:translate-x-1">→</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 🎯 Carousel Navigation Buttons */}
            {layout === "carousel" && items.length > 1 && (
              <div className="mt-8 flex items-center justify-start gap-4 select-none">
                <button
                  onClick={() => scrollToPage("prev")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/10 bg-white/5 backdrop-blur-sm transition-all hover:border-champagne/40 hover:bg-
                  white/10 active:scale-95 cursor-pointer text-sm"
                  aria-label="Previous experiences"
                >
                  ←
                </button>

                <button
                  onClick={() => scrollToPage("next")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/10 bg-white/5 backdrop-blur-sm transition-all hover:border-champagne/40 hover:bg-
                  white/10 active:scale-95 cursor-pointer text-sm"
                  aria-label="Next experiences"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}

        {/* Cit quote */}
        {cit && (
          <motion.blockquote
            className="mt-14 max-w-3xl font-serif italic text-xl md:text-2xl text-bone/80 text-balance border-l border-champagne/30 pl-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            “{cit.text}”
            <footer className="mt-3 not-italic tracking-editorial text-[9px] uppercase text-champagne tracking-widest font-medium">
              — {cit.author}
            </footer>
          </motion.blockquote>
        )}
      </div>
    </section>
  );
}