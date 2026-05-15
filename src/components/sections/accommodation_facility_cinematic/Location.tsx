"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SectionContentMap } from "@/types/sections"
import { MapPin } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface LocationProps {
    content: SectionContentMap['location']
}

export function Location({ content: {
    title,
    subtitle,
    description,
    address,
    mapEmbed,
    directionsLink,
    nearbyAttractions
} }: LocationProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const descriptionRef = useRef<HTMLParagraphElement>(null)
    const mapRef = useRef<HTMLDivElement>(null)
    const attractionsRef = useRef<HTMLUListElement>(null)
    const addressRef = useRef<HTMLDivElement>(null)
    const directionsRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ========================================================================
            // 🎬 Timeline principale: entrance animations
            // ========================================================================
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%", // Inizia quando la sezione è all'80% del viewport
                    toggleActions: "play none none reverse", // Play on enter, reverse on leave
                }
            })

            // 🗺️ Map reveal: scale + fade
            if (mapRef.current) {
                tl.from(mapRef.current, {
                    scale: 1.08,
                    opacity: 0,
                    ease: "power2.out",
                    duration: 1.2
                }, 0.2)
            }

            // 📋 Attractions list: staggered items
            if (attractionsRef.current) {
                gsap.from(".attraction-item", {
                    scrollTrigger: {
                        trigger: attractionsRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    y: 20,
                    opacity: 0,
                    stagger: 0.08,
                    ease: "power2.out",
                    duration: 0.5
                })
            }

            // 📍 Address + directions: subtle slide-in
            if (addressRef.current) {
                tl.from(addressRef.current, {
                    x: -15,
                    opacity: 0.7,
                    ease: "power2.out"
                }, 0.4)
            }
            if (directionsRef.current) {
                tl.from(directionsRef.current, {
                    x: 15,
                    opacity: 0.7,
                    ease: "power2.out"
                }, 0.45)
            }

            // ========================================================================
            // ✨ Interactive hover effects (GSAP-powered)
            // ========================================================================

            // Attractions items: hover highlight
            gsap.utils.toArray<HTMLElement>(".attraction-item").forEach((item) => {
                const nameEl = item.querySelector<HTMLElement>(".attraction-name");
                const distanceEl = item.querySelector<HTMLElement>(".attraction-distance");

                if (!nameEl && !distanceEl) return; // Skip se non ci sono elementi

                const handleEnter = () => {
                    if (nameEl) {
                        gsap.to(nameEl, { x: 4, duration: 0.3, ease: "power2.out" });
                    }
                    if (distanceEl) {
                        gsap.to(distanceEl, { x: 4, duration: 0.3, ease: "power2.out" });
                    }
                };

                const handleLeave = () => {
                    if (nameEl) {
                        gsap.to(nameEl, { x: 0, duration: 0.3, ease: "power2.out" });
                    }
                    if (distanceEl) {
                        gsap.to(distanceEl, { x: 0, duration: 0.3, ease: "power2.out" });
                    }
                };

                item.addEventListener("mouseenter", handleEnter);
                item.addEventListener("mouseleave", handleLeave);
            });

            // Directions button: hover scale + glow
            if (directionsRef.current) {
                directionsRef.current.addEventListener("mouseenter", () => {
                    gsap.to(directionsRef.current, {
                        scale: 1.03,
                        duration: 0.3,
                        ease: "power2.out"
                    })
                })
                directionsRef.current.addEventListener("mouseleave", () => {
                    gsap.to(directionsRef.current, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    })
                })
            }

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="location"
            className="relative bg-ink text-bone py-32 md:py-48 overflow-hidden"
        >
            <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

                    {/* 📝 Left column: content */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div className="attraction-item">
                            {/* Subtitle */}
                            <span className="attraction-name tracking-luxury text-[11px] uppercase text-gold mb-8">
                                — {subtitle}
                            </span>

                            {/* Title */}
                            <h2
                                ref={titleRef}
                                className="attraction-name col-span-12 md:col-span-8 font-serif text-[clamp(2.5rem,6.5vw,6.5rem)] leading-[0.95] text-balance"
                            >
                                {title}
                            </h2>

                            {/* Description */}
                            <p
                                ref={descriptionRef}
                                className="attraction-name col-span-12 md:col-span-4 text-pretty text-[15px] leading-relaxed text-bone/75 my-10"
                            >
                                {description}
                            </p>
                        </div>

                        {/* 📍 Address + Directions */}
                        {(address || directionsLink) && (
                            <div className="attraction-item flex flex-wrap items-center gap-4 pt-4 border-t border-charcoal/10">
                                {address && (
                                    <div ref={addressRef} className="flex items-start gap-2.5">
                                        <a
                                            href={directionsLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex bg-primary text-primary-foreground hover:bg-primary/90 transition-colors items-center gap-3 px-7 py-3.5 text-ink tracking-editorial text-[10px] uppercase transition-all duration-500"
                                        >
                                            <MapPin className="w-4 h-4 text-bronze mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-charcoal/80 leading-relaxed">
                                                {address}
                                            </span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 🗺️ Nearby attractions */}
                        {nearbyAttractions && nearbyAttractions.length > 0 && (
                            <ul
                                ref={attractionsRef}
                                className="space-y-3 pt-8 mt-4 border-t border-charcoal/10"
                            >
                                {nearbyAttractions.map((n) => (
                                    <li
                                        key={n.name}
                                        className="attraction-item flex items-baseline justify-between border-b border-charcoal/10 pb-3 group cursor-default"
                                    >
                                        <span className="attraction-name font-serif text-bronze/70 text-lg text-charcoal transition-colors group-hover:text-bronze">
                                            {n.name}
                                        </span>
                                        <span className="attraction-distance text-xs uppercase tracking-[0.25em] text-bronze/70 group-hover:text-bronze transition-colors">
                                            {n.distance}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 🗺️ Right column: map */}
                    <div
                        ref={mapRef}
                        className="lg:col-span-7 relative h-[500px] lg:h-auto min-h-[500px] overflow-hidden rounded-sm"
                    >
                        {/* Map iframe */}
                        {mapEmbed ? (
                            <iframe
                                title={mapEmbed || "Location"}
                                className="absolute inset-0 w-full h-full grayscale-[0.3] contrast-[0.92] sepia-[0.12] transition-all duration-700"
                                src={mapEmbed}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        ) : (
                            // Fallback map (OpenStreetMap)
                            <iframe
                                title="Location"
                                className="absolute inset-0 w-full h-full grayscale-[0.3] contrast-[0.92] sepia-[0.12]"
                                src="https://www.openstreetmap.org/export/embed.html?bbox=11.4%2C42.95%2C11.7%2C43.15&layer=mapnik"
                                loading="lazy"
                            />
                        )}

                        {/* Overlay tint for brand consistency */}
                        <div className="absolute inset-0 bg-sand/15 pointer-events-none mix-blend-multiply" />

                        {/* Gradient fade at bottom for depth */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sand/80 to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    )
}