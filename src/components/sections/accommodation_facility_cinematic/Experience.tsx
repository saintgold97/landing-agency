"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";
import { SectionContentMap } from "@/types/sections";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceProps {
  content: SectionContentMap["experiences"];
}

export function Experience({
  content: { title, subtitle, items, layout = "grid", showDescriptions = true, backgroundImage, cit },
}: ExperienceProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging] = useState(false);

  // ============================================================================
  // 🎬 GSAP: Parallax + Counters (inalterato)
  // ============================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Counter animation
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = Number(el.dataset.target);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
          onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
        });
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  // ============================================================================
  // 🎠 Carousel: Scroll to Page con Framer Motion
  // ============================================================================
  const scrollToPage = useCallback((direction: "next" | "prev") => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;

    const amount = container.clientWidth * 0.9;

    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }, []);

  // ============================================================================
  // ⌨️ Keyboard navigation
  // ============================================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (layout !== "carousel") return;

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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [layout, scrollToPage]);

  // ============================================================================
  // 🔄 Sync indicatori con drag (opzionale: highlight mentre trascini)
  // ============================================================================
  useEffect(() => {
    if (layout !== "carousel" || !carouselRef.current || !items) return;

    const container = carouselRef.current;
    const updateIndexOnScroll = () => {
      if (isDragging) return;
    };

    container.addEventListener("scroll", updateIndexOnScroll, { passive: true });
    return () => container.removeEventListener("scroll", updateIndexOnScroll);
  }, [isDragging, items, layout]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container || layout !== "carousel") return;

    const handleWheel = (e: WheelEvent) => {
      // se lo scroll verticale è maggiore
      // trasformalo in orizzontale
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();

        container.scrollBy({
          left: e.deltaY,
          behavior: "smooth",
        });
      }
    };

    container.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [layout]);

  // ============================================================================
  // 🎨 Render
  // ============================================================================
  return (
    <section
      id="experiences"
      ref={wrap}
      className="relative h-[110vh] overflow-hidden text-bone"
    >
      {/* 🖼️ Parallax Background */}
      <div className="exp-bg absolute inset-x-0 top-[-50%] h-[150%] w-full">
        {backgroundImage ? (
          <div ref={bgRef} className="absolute inset-0 h-[130%] w-full">
            <Image
              src={backgroundImage.src}
              alt={backgroundImage.alt || ""}
              fill
              priority
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div ref={bgRef} className="absolute inset-0 h-[130%] w-full bg-ink/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/80" />
      </div>

      <div className="relative h-full mx-auto max-w-[1400px] px-6 md:px-12 flex flex-col justify-center">

        {/* Header */}
        {subtitle && (
          <p className="tracking-luxury text-[11px] uppercase text-champagne mb-8">
            — {subtitle} —
          </p>
        )}
        {title && (
          <h2 className="font-serif text-[clamp(2.5rem,7vw,7rem)] leading-[0.95] max-w-4xl text-balance">
            {title}
          </h2>
        )}

        {/* 🎠 Items Container */}
        {items && (
          <>
            {layout === "carousel" ? (
              // Carousel con Framer Motion drag + snap
              <motion.div
                ref={carouselRef}
                className="carousel-track mt-16 flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scroll-px-6 pb-8 -mx-6 px-6 md:-mx-12 md:px-12 scrollbar-hide [scrollbar-width:none]"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                }}
              >
                {items.map((item, i) => (
                  <motion.div
                    key={item.id || i}
                    className="min-w-[80vw] min-h-[40vh] md:min-w-[400px] flex justify-end flex-col snap-center relative overflow-hidden p-6 md:p-8 rounded-sm text-left border border-bone/10 bg-card/5 shrink-0"
                    // Entrance animation staggered
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.1
                    }}
                    // Hover effect
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    {/* Item image */}
                    {item.image?.src && (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={400}
                        height={300}
                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-30"
                        loading="eager"
                      />
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

                    <div
                      className="relative z-10 p-6 md:p-8 rounded-sm"
                      style={{
                        background: "radial-gradient(ellipse at center, rgba(45,36,24,0.8) 0%, rgba(26,26,26,0.95) 70%)"
                      }}
                    >
                      {/* Animated counter */}
                      <div className="font-serif text-5xl md:text-6xl text-gradient-gold leading-none">
                        <span className="stat-num" data-target={i + 1}>
                          {i + 1}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="mt-4 tracking-editorial text-[10px] uppercase text-bone/90">
                        {item.title}
                      </div>

                      {/* Description */}
                      {showDescriptions && item.description && (
                        <p className="mt-2 text-sm text-bone/70 line-clamp-3">
                          {item.description}
                        </p>
                      )}

                      {/* Link */}
                      {item.link && (
                        <a
                          href={item.link}
                          className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-editorial text-champagne hover:text-bone transition-colors group"
                        >
                          Scopri
                          <motion.span
                            className="inline-block"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          >
                            →
                          </motion.span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // Grid layout (inalterato)
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id || i}
                    className="group relative overflow-hidden p-6 md:p-8 rounded-sm text-left transition-all duration-500 bg-card/10 hover:bg-card/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                  >
                    {item.image?.src && (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={400}
                        height={300}
                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:opacity-30 group-hover:scale-105"
                        loading="eager"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
                    <div className="relative z-10">
                      <div className="font-serif text-5xl md:text-6xl text-gradient-gold leading-none">
                        <span className="stat-num" data-target={i + 1}>{i + 1}</span>
                      </div>
                      <div className="mt-4 tracking-editorial text-[10px] uppercase text-bone/90">{item.title}</div>
                      {showDescriptions && item.description && (
                        <p className="mt-2 text-sm text-bone/70 line-clamp-3">{item.description}</p>
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

            {/* 🎯 Carousel Indicators - Animati con Framer Motion */}
            {layout === "carousel" && items.length > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  onClick={() => scrollToPage("prev")}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/20 backdrop-blur transition-all hover:border-primary hover:bg-background/40 cursor-pointer"
                  aria-label="Previous experiences"
                >
                  ←
                </button>

                <button
                  onClick={() => scrollToPage("next")}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/20 backdrop-blur transition-all hover:border-primary hover:bg-background/40 cursor-pointer"
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
            className="mt-10 max-w-2xl font-serif italic text-2xl md:text-3xl text-bone/90 text-balance"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            “{cit.text}”
            <footer className="mt-4 not-italic tracking-editorial text-[10px] uppercase text-champagne">
              — {cit.author}
            </footer>
          </motion.blockquote>
        )}
      </div>
    </section>
  );
}