// src/components/sections/hero-cinematic-scroll.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import Image from "next/image"
import { SectionContentMap } from "@/types/sections/index"
import { BaseSectionProps } from "."

interface HeroCinematicScrollProps extends BaseSectionProps {
    content: SectionContentMap['heroCinematicScroll']
}

export function HeroCinematicScrollV1({ content, theme }: HeroCinematicScrollProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const stickyRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const scrollIndicatorRef = useRef<HTMLDivElement>(null)
    const fallbackRef = useRef<HTMLDivElement>(null)
    const framesContainerRef = useRef(null)

    const [images, setImages] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Config
    const frameCount = content.totalFrames ?? 3
    const framesPath = content.framesPath ?? "/content/sites/villa-serena/assets/hero-frame-"

    // ============================================================================
    // 🖼️ Preload immagini di sequenza
    // ============================================================================
    useEffect(() => {
        const imgList = Array.from({ length: frameCount }, (_, i) =>
            `${framesPath}${i + 1}.jpg`
        )
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImages(imgList)

        // Preload reale per evitare flicker
        const preload = imgList.map(src => {
            const img = new window.Image()
            img.src = src
            return new Promise(resolve => {
                img.onload = img.onerror = resolve
            })
        })

        Promise.all(preload).then(() => setIsLoaded(true))
    }, [framesPath, frameCount])

    // ============================================================================
    // ✨ GSAP: Fallback + Frame sequence + Contenuti
    // ============================================================================
    useEffect(() => {
        if (!isLoaded) return

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: 0.15,
                    pin: stickyRef.current,
                    anticipatePin: 1,
                }
            })

            // 🖼️ Fallback fade out (subito all'inizio dello scroll)
            if (fallbackRef.current) {
                tl.to(fallbackRef.current, {
                    opacity: 0,
                    ease: "none",
                    duration: 0.1
                }, 0.02) // Inizia quasi subito (2% dello scroll)
            }

            // 🎞️ Frame sequence: ogni immagine fade in/out in sequenza
            images.forEach((_, index) => {
                const start = (index / frameCount) * 0.9
                const end = start + 0.3

                tl.fromTo(`.frame-${index}`,
                    { opacity: 0, scale: 1.02 },
                    {
                        opacity: 1,
                        scale: 1,
                        ease: "none",
                        duration: 0.3
                    },
                    Math.max(0.05, start) // Inizia dopo il fallback fade
                )
                if (index < frameCount - 1) {
                    tl.to(`.frame-${index}`,
                        { opacity: 0, ease: "none" },
                        end
                    )
                }
            })

            // 🎭 Zoom progressivo su TUTTI i frame
            tl.fromTo(".frames-wrapper",
                { scale: 1 },
                { scale: 1.08, ease: "none" },
                0
            )

            // 🧍 Content fade + slide
            tl.to(contentRef.current, {
                opacity: 0, y: 50, scale: 0.95, ease: "none"
            }, 0.25)

            // ↓ Scroll indicator fade
            tl.to(scrollIndicatorRef.current, {
                opacity: 0, ease: "none"
            }, 0)

        }, sectionRef)

        return () => ctx.revert()
    }, [isLoaded, images, frameCount])

    // ============================================================================
    // 🎨 Render
    // ============================================================================
    return (
        <section ref={sectionRef} className="relative" id="hero">
            <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">

                {/* 🖼️ FALLBACK IMAGE (visibile all'inizio, poi sfuma) */}
                <div
                    ref={fallbackRef}
                    className="absolute inset-0 z-10"
                    style={{ willChange: "opacity" }}
                >
                    <Image
                        src={content.fallbackImage.src}
                        alt={content.fallbackImage.alt}
                        fill
                        priority
                        quality={90}
                        className="object-cover"
                        sizes="100vw"
                        onError={(e) => {
                            console.error("❌ Fallback failed:", content.fallbackImage)
                            e.currentTarget.style.display = "none"
                        }}
                    />
                </div>

                {/* 🎞️ Frames container (sopra il fallback) */}
                <div ref={framesContainerRef} className="frames-wrapper absolute inset-0 z-20">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className={`frame-${index} absolute inset-0`}
                            style={{
                                opacity: index === 0 && !isLoaded ? 1 : 0, // Primo frame visibile solo se fallback non c'è
                                willChange: "opacity, transform"
                            }}
                        >
                            <Image
                                src={src}
                                alt={`${content.fallbackImage.alt} - frame ${index + 1}`}
                                fill
                                priority={index === 0}
                                loading={index === 0 ? "eager" : "lazy"}
                                className="object-cover"
                                sizes="100vw"
                                quality={90}
                            />
                        </div>
                    ))}
                </div>

                {/* Vignette overlay (sopra tutto) */}
                <div className="absolute inset-0 pointer-events-none z-30"
                    style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)" }}
                />

                {/* Content (sopra vignette) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-40">
                    <div ref={contentRef} className="text-center px-6 md:px-12 max-w-5xl"
                        style={{ willChange: "transform, opacity" }}>

                        {content.title && (
                            <h1 className="font-serif text-primary-foreground text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight mb-8 md:mb-12 leading-[1.1]">
                                {content.title}
                            </h1>
                        )}
                        {content.subtitle && (
                            <p className="text-primary-foreground/80 text-xs md:text-sm uppercase tracking-[0.4em] mb-6 md:mb-8 font-light">
                                {content.subtitle}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 justify-center">
                            {content.ctaPrimary && (
                                <a href={content.ctaPrimary.href}
                                    className="group text-primary bg-primary-foreground inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 text-sm uppercase tracking-widest font-medium transition-all duration-500 hover:gap-5">
                                    <span>{content.ctaPrimary.text}</span>
                                    <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </a>
                            )}
                            {content.ctaSecondary && (
                                <a href={content.ctaSecondary.href}
                                    className="group text-primary bg-primary-foreground inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 text-sm uppercase tracking-widest font-medium transition-all duration-500 hover:gap-5">
                                    <span>{content.ctaSecondary.text}</span>
                                    <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 pointer-events-none z-40"
                    style={{ background: `linear-gradient(to top, ${theme?.colors?.background} 0%, transparent 100%)` }}
                />
            </div>

            <style jsx global>{`
                @keyframes scrollIndicator {
                    0%, 100% { transform: translateY(-100%); opacity: 0; }
                    50% { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </section>
    )
}