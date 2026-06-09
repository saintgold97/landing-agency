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
    const imageRef = useRef<HTMLDivElement>(null)

    const [isLoaded, setIsLoaded] = useState(false)

    const frameCount = content.totalFrames ?? 3
    const framesPath = content.framesPath ?? "/content/sites/villa-serena/assets/hero-frame-"

    const imgList = Array.from({ length: frameCount }, (_, i) => `${framesPath}${i + 1}.jpg`)
    const [currentImgSrc, setCurrentImgSrc] = useState(content.fallbackImage.src)

    useEffect(() => {
        let active = true;
        const preloadImages = async () => {
            try {
                const promises = imgList.map(src => {
                    return new Promise((resolve) => {
                        const img = new window.Image()
                        img.src = src
                        img.onload = img.onerror = resolve
                    })
                })
                await Promise.all(promises)
                if (active) setIsLoaded(true)
            } catch (e) {
                console.error("Errore nel precaricamento dei frame", e)
            }
        }
        preloadImages()
        return () => { active = false }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [framesPath, frameCount])

    useEffect(() => {
        const ctx = gsap.context(() => {
            const frameObj = { frame: -1 }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: 0.1,
                    pin: stickyRef.current,
                    anticipatePin: 1,
                }
            })

            if (isLoaded) {
                tl.to(frameObj, {
                    frame: frameCount - 1,
                    snap: "frame",
                    ease: "none",
                    duration: 1,
                    onUpdate: () => {
                        if (frameObj.frame === -1) {
                            setCurrentImgSrc(content.fallbackImage.src)
                        } else {
                            const targetSrc = imgList[frameObj.frame]
                            if (targetSrc) setCurrentImgSrc(targetSrc)
                        }
                    }
                }, 0)
            }

            if (imageRef.current) {
                tl.fromTo(imageRef.current,
                    { scale: 1 },
                    { scale: 1.06, ease: "none", duration: 1 },
                    0
                )
            }

            if (contentRef.current) {
                tl.to(contentRef.current, {
                    opacity: 0,
                    y: 30,
                    ease: "power1.inOut",
                    duration: 0.4
                }, 0.3)
            }

            if (scrollIndicatorRef.current) {
                tl.to(scrollIndicatorRef.current, {
                    opacity: 0, ease: "none", duration: 0.1
                }, 0)
            }

        }, sectionRef)

        return () => ctx.revert()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, frameCount, content.fallbackImage.src])

    return (
        <section ref={sectionRef} className="relative w-full min-h-[300vh]" id="hero">
            <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-background">

                {/* 🎞️ TAG IMAGE UNICO (Immagini pulite al 100%) */}
                <div className="absolute inset-0 z-10 overflow-hidden">
                    <div ref={imageRef} className="relative w-full h-full will-change-transform">
                        <Image
                            src={currentImgSrc}
                            alt={content.fallbackImage.alt}
                            fill
                            priority
                            quality={90}
                            className="object-cover"
                            sizes="100vw"
                        />
                    </div>
                </div>

                {/* Sfumatura radiale minima per dare profondità ai bordi dello schermo */}
                <div className="absolute inset-0 pointer-events-none z-20"
                    style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.15) 100%)" }}
                />

                {/* Content Container */}
                <div className="absolute inset-0 flex items-center justify-center z-30 px-4 sm:px-6">
                    <div
                        ref={contentRef}
                        className="text-center px-8 py-12 md:px-14 md:py-16 max-w-2xl will-change-[transform,opacity] 
                        bg-white/[0.03] backdrop-blur-[4px] border border-white/10 rounded-xl shadow-xl"
                        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)" }}
                    >

                        {content.title && (
                            <h1
                                className="font-serif text-primary-foreground text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-5 md:mb-6 leading-[1.1]"
                                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}
                            >
                                {content.title}
                            </h1>
                        )}
                        {content.subtitle && (
                            <p
                                className="text-primary-foreground/90 text-xs sm:text-sm tracking-[0.2em] uppercase mb-8 md:mb-10 font-light leading-relaxed max-w-xl mx-auto"
                                style={{ textShadow: "0 1px 5px rgba(0,0,0,0.2)" }}
                            >
                                {content.subtitle}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                            {content.ctaPrimary && (
                                <a href={content.ctaPrimary.href}
                                    className="group w-full sm:w-auto text-primary bg-primary-foreground inline-flex items-center justify-center gap-3 px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-md transition-all duration-300 hover:bg-primary-foreground/90 shadow-md cursor-pointer">
                                    <span>{content.ctaPrimary.text}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 pointer-events-none z-30"
                    style={{ background: `linear-gradient(to top, ${theme?.colors?.background} 0%, transparent 100%)` }}
                />
            </div>
        </section>
    )
}