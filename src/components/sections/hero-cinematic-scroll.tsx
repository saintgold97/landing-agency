// src/components/sections/hero-cinematic-scroll.tsx
"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import type { BaseSectionProps, SectionContentMap } from "."

interface HeroCinematicScrollProps extends BaseSectionProps {
    content: SectionContentMap['heroCinematicScroll']
}

// Easing function for smooth interpolation
const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
}

export function HeroCinematicScroll({ content, theme }: HeroCinematicScrollProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const stickyRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

    // Image sequence refs
    const imagesRef = useRef<(HTMLImageElement | null)[]>([])

    // ✅ Frame count dinamico: usa 3 se non specificato
    const frameCount = content.totalFrames ?? 3
    const framesPath = content.framesPath ?? "/content/sites/villa-serena/assets/hero-frame-"

    // Animation state refs
    const targetFrameRef = useRef(0)
    const currentFrameRef = useRef(0)
    const lastDrawnFrameRef = useRef(-1)
    const scrollProgressRef = useRef(0)
    const rafRef = useRef<number | null>(null)

    // Content refs
    const contentRef = useRef<HTMLDivElement>(null)
    const scrollIndicatorRef = useRef<HTMLDivElement>(null)

    // State
    const [isLoaded, setIsLoaded] = useState(false)
    const [loadError, setLoadError] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)

    // ============================================================================
    // 🎨 Canvas Setup
    // ============================================================================
    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current
        const sticky = stickyRef.current
        if (!canvas || !sticky) return

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const rect = sticky.getBoundingClientRect()

        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        const ctx = canvas.getContext("2d", {
            alpha: true,
            desynchronized: true
        })
        if (ctx) {
            ctx.scale(dpr, dpr)
            ctxRef.current = ctx
        }
    }, [])

    // ============================================================================
    // 🖼️ Draw Frame - con cycling per pochi frame
    // ============================================================================
    const drawFrame = useCallback((frameIndex: number) => {
        const ctx = ctxRef.current
        const canvas = canvasRef.current
        const progress = scrollProgressRef.current

        // ✅ Cycling: se hai 3 frame e chiedi il frame 10, usa 10 % 3 = 1
        const actualIndex = frameIndex % frameCount
        const img = imagesRef.current[actualIndex]

        if (!ctx || !canvas || !img) return
        if (lastDrawnFrameRef.current === actualIndex) return

        lastDrawnFrameRef.current = actualIndex

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const canvasWidth = canvas.width / dpr
        const canvasHeight = canvas.height / dpr

        // Cover fit calculation
        const imgRatio = img.width / img.height
        const canvasRatio = canvasWidth / canvasHeight

        let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number

        if (imgRatio > canvasRatio) {
            drawHeight = canvasHeight
            drawWidth = canvasHeight * imgRatio
            offsetX = (canvasWidth - drawWidth) / 2
            offsetY = 0
        } else {
            drawWidth = canvasWidth
            drawHeight = canvasWidth / imgRatio
            offsetX = 0
            offsetY = (canvasHeight - drawHeight) / 2
        }

        // Cinematic zoom basato su scroll progress

        const zoomScale = 1 + progress * 0.08
        const zoomedWidth = drawWidth * zoomScale
        const zoomedHeight = drawHeight * zoomScale
        const zoomOffsetX = offsetX - (zoomedWidth - drawWidth) / 2
        const zoomOffsetY = offsetY - (zoomedHeight - drawHeight) / 2

        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        ctx.drawImage(img, zoomOffsetX, zoomOffsetY, zoomedWidth, zoomedHeight)
    }, [frameCount])

    // ============================================================================
    // 🖼️ Preload immagini
    // ============================================================================
    useEffect(() => {
        let mounted = true
        const images: (HTMLImageElement | null)[] = new Array(frameCount).fill(null)
        let loaded = 0

        const loadImage = (index: number): Promise<void> => {
            return new Promise((resolve) => {
                const img = new window.Image();
                img.crossOrigin = "anonymous"

                const imageUrl = `${framesPath}${index + 1}.jpg`

                img.onload = () => {
                    if (mounted) {
                        images[index] = img
                        loaded++
                        if (loaded === frameCount && !isLoaded) {
                            setIsLoaded(true)
                        }
                    }
                    resolve()
                }

                img.onerror = () => {
                    loaded++
                    if (mounted && loaded === frameCount) {
                        const allFailed = images.every(img => img === null)
                        if (allFailed) setLoadError(true)
                        else if (!isLoaded) setIsLoaded(true)
                    }
                    resolve()
                }

                img.src = imageUrl
            })
        }

        Promise.all(Array.from({ length: frameCount }, (_, i) => loadImage(i)))
            .then(() => {
                if (!mounted) return

                imagesRef.current = images

                if (loaded > 0) {
                    imagesRef.current = images
                    setupCanvas()
                    if (scrollProgressRef.current >= 0.02) {
                        drawFrame(0)
                    }
                    setIsLoaded(true)
                } else {
                    setLoadError(true)
                }
            })

        return () => { mounted = false }
    }, [framesPath, frameCount, isLoaded, setupCanvas, drawFrame])

    // ============================================================================
    // ✨ Content Animation
    // ============================================================================
    const updateContentTransforms = useCallback((progress: number) => {
        const fadeStart = 0.2
        const fadeEnd = 0.6

        let opacity = 1
        let scale = 1
        let translateY = 0

        if (progress > fadeStart) {
            const fadeProgress = Math.min(1, (progress - fadeStart) / (fadeEnd - fadeStart))
            opacity = 1 - fadeProgress
            scale = 1 - fadeProgress * 0.1
            translateY = fadeProgress * 60
        }

        if (contentRef.current) {
            contentRef.current.style.opacity = String(opacity)
            contentRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`
        }

        if (scrollIndicatorRef.current) {
            const indicatorOpacity = Math.max(0, 1 - progress * 3)
            scrollIndicatorRef.current.style.opacity = String(indicatorOpacity)
        }
    }, [])

    // ============================================================================
    // 🎞️ Animation Loop (funziona su tutti i dispositivi)
    // ============================================================================
    useEffect(() => {
        if (!isLoaded || loadError) return

        setupCanvas()

        const animate = () => {
            const diff = targetFrameRef.current - currentFrameRef.current

            if (Math.abs(diff) > 0.01) {
                // Easing più fluido su mobile
                const easingFactor = 0.12
                currentFrameRef.current = lerp(currentFrameRef.current, targetFrameRef.current, easingFactor)

                const frameIndex = Math.round(currentFrameRef.current)
                const clampedFrame = Math.max(0, Math.min(frameCount - 1, frameIndex))

                if (imagesRef.current[clampedFrame % frameCount]) {
                    drawFrame(clampedFrame)
                }
            }

            rafRef.current = requestAnimationFrame(animate)
        }

        rafRef.current = requestAnimationFrame(animate)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [isLoaded, loadError, frameCount, setupCanvas, drawFrame])

    // ============================================================================
    // 📜 Scroll Handler - ✅ ABILITATO SU TUTTI I DISPOSITIVI
    // ============================================================================
    useEffect(() => {
        const handleScroll = () => {
            const section = sectionRef.current
            if (!section) return

            const rect = section.getBoundingClientRect()
            const sectionHeight = section.offsetHeight - window.innerHeight
            if (sectionHeight <= 0) return

            const scrolled = -rect.top
            const progress = Math.max(0, Math.min(1, scrolled / sectionHeight))

            scrollProgressRef.current = progress
            setScrollProgress(progress)
            scrollProgressRef.current = progress

            if (progress < 0.05) {
                targetFrameRef.current = 0
            } else {
                const cyclesPerFrame = 1.5
                const targetFrame = Math.floor(progress * (frameCount * cyclesPerFrame))

                targetFrameRef.current = Math.max(0, targetFrame)
            }

            updateContentTransforms(progress)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll() // Initial call

        return () => window.removeEventListener("scroll", handleScroll)
    }, [frameCount, updateContentTransforms])

    // ============================================================================
    // 🔄 Resize Handler
    // ============================================================================
    useEffect(() => {
        const handleResize = () => {
            setupCanvas()
            lastDrawnFrameRef.current = -1
            const frame = Math.round(currentFrameRef.current)
            if (imagesRef.current[frame % frameCount]) {
                drawFrame(frame)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [frameCount, setupCanvas, drawFrame])

    // ============================================================================
    // 🎨 Render
    // ============================================================================
    return (
        <section
            ref={sectionRef}
            className="relative"
            id="hero"
            style={{ height: "280vh" }} // ✅ Sempre 280vh per scroll su tutti i dispositivi
        >
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full overflow-hidden"
            >
                {/* (!isLoaded || loadError || scrollProgress < 0.05) && */ (
                    <div
                        className="absolute inset-0"
                        style={{
                            opacity: scrollProgress < 0.05 ? 1 : 0,
                            transition: "opacity 200ms ease",
                        }}
                    >
                        <Image
                            src={content.fallbackImage}
                            alt={`${content.title} - Hero`}
                            fill
                            priority
                            quality={90}
                            className="object-cover"
                            sizes="100vw"
                            onError={(e) => {
                                console.error("❌ Fallback failed:", content.fallbackImage)
                                setLoadError(true)
                                e.currentTarget.style.display = "none"
                                e.currentTarget.parentElement!.style.background =
                                    `linear-gradient(135deg, ${theme?.colors?.background}40, ${theme?.colors?.background}80)`
                            }}
                        />
                    </div>
                )}

                {/* Canvas layer - renderizzato SOLO quando caricato */}
                {isLoaded && !loadError && (
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full"
                        style={{
                            opacity: scrollProgress < 0.05 ? 0 : 1,
                            transition: "opacity 200ms ease",
                        }}
                        aria-hidden="true"
                    />
                )}

                {/* Gradient overlay */}

                {/* Vignette */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)"
                    }}
                />

                {/* Content layer */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                        ref={contentRef}
                        className="text-center px-6 md:px-12 max-w-5xl"
                        style={{
                            willChange: "transform, opacity",
                            backfaceVisibility: "hidden",
                        }}
                    >

                        {/* Title - dinamico da config */}
                        {content.title && <h1
                            className="font-serif text-primary-foreground text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight mb-8 md:mb-12 leading-[1.1]"
                        >
                            {content.title}
                        </h1>}

                        {/* Subtitle - dinamico da config */}
                        {content.subtitle && <p
                            className="text-primary-foreground/80 text-xs md:text-sm uppercase tracking-[0.4em] mb-6 md:mb-8 font-light"
                        >
                            {content.subtitle}
                        </p>}

                        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 justify-center">
                            {/* CTA Button - dinamico da config */}
                            {content.ctaPrimary && (
                                <a
                                    href={content.ctaPrimary.link}
                                    className="group text-primary bg-primary-foreground inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 text-sm uppercase tracking-widest font-medium transition-all duration-500 hover:gap-5 cursor-pointer"
                                >
                                    <span>{content.ctaPrimary.text}</span>
                                    <svg
                                        className="w-4 h-4 transition-transform duration-500 group-hover:translate-y-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                        />
                                    </svg>
                                </a>
                            )}
                            {/* CTA Button - dinamico da config */}
                            {content.ctaSecondary && (
                                <a
                                    href={content.ctaSecondary.link}
                                    className="group text-primary bg-primary-foreground inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 text-sm uppercase tracking-widest font-medium transition-all duration-500 hover:gap-5 cursor-pointer"
                                >
                                    <span>{content.ctaSecondary.text}</span>
                                    <svg
                                        className="w-4 h-4 transition-transform duration-500 group-hover:translate-y-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                        />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div
                    ref={scrollIndicatorRef}
                    className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-primary bg-primary-foreground/B3"
                    style={{
                        willChange: "opacity",
                    }}
                >
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light bg-primary-foreground">Scorri</span>
                    <div className="w-px h-14 md:h-16 relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 w-full h-1/3"
                            style={{
                                background: `linear-gradient(to bottom, ${theme?.colors?.primaryForeground}CC, transparent)`,
                                animation: "scrollIndicator 2s ease-in-out infinite",
                            }}
                        />
                    </div>
                </div>

                {/* Bottom gradient */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-32 md:h-48 pointer-events-none"
                    style={{
                        background: `linear-gradient(to top, ${theme?.colors?.background} 0%, transparent 100%)`,
                    }}
                />
            </div>

            {/* CSS Keyframes */}
            <style jsx global>{`
                @keyframes scrollIndicator {
                    0%, 100% { transform: translateY(-100%); opacity: 0; }
                    50% { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </section>
    )
}