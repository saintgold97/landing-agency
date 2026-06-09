// src/components/sections/Location.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionContentMap } from "@/types/sections";
import { MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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
    const sectionRef = useRef<HTMLElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const attractionsRef = useRef<HTMLUListElement>(null);
    const addressWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 🎬 Timeline principale: entrance animations
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                }
            });

            tl.from(".location-header-reveal", {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out"
            });

            if (mapRef.current) {
                tl.from(mapRef.current, {
                    scale: 1.04,
                    opacity: 0,
                    ease: "power2.out",
                    duration: 1.2
                }, 0.3);
            }

            if (addressWrapperRef.current) {
                tl.from(addressWrapperRef.current, {
                    y: 15,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }, 0.5);
            }

            // 📋 Ora che la classe ".list-item-reveal" esiste, l'animazione funzionerà a colpo sicuro!
            if (attractionsRef.current) {
                gsap.from(".list-item-reveal", {
                    scrollTrigger: {
                        trigger: attractionsRef.current,
                        start: "top 90%",
                        toggleActions: "play none none none",
                        once: true
                    },
                    y: 15,
                    opacity: 0,
                    stagger: 0.06,
                    ease: "power2.out",
                    duration: 0.6
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="location"
            className="relative bg-ink text-bone py-24 md:py-36 overflow-hidden w-full"
        >
            <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* 📝 Left column: content */}
                    <div className="lg:col-span-5 flex flex-col justify-center h-full">
                        <div className="flex flex-col mb-8">
                            {/* Subtitle */}
                            {subtitle && (
                                <span className="location-header-reveal tracking-luxury text-[10px] md:text-[11px] uppercase text-gold mb-4 select-none">
                                    — {subtitle} —
                                </span>
                            )}

                            {/* Title */}
                            {title && (
                                <h2 className="location-header-reveal font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] text-balance tracking-tight">
                                    {title}
                                </h2>
                            )}

                            {/* Description */}
                            {description && (
                                <p className="location-header-reveal text-pretty text-[14px] md:text-[15px] leading-relaxed text-bone/70 mt-6 mb-2">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* 📍 Address + Directions */}
                        {address && (
                            <div ref={addressWrapperRef} className="pt-6 border-t border-bone/10 w-full">
                                <a
                                    href={directionsLink ?? "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-3 bg-bone text-ink px-6 py-3.5 tracking-editorial text-[10px] uppercase transition-all duration-300 hover:bg-accent hover:text-ink w-full sm:w-auto justify-center rounded-sm transform-gpu active:scale-98"
                                >
                                    <MapPin className="w-4 h-4 text-ink flex-shrink-0 transition-transform group-hover:scale-110" />
                                    <span className="text-xs font-medium tracking-wider">
                                        {address}
                                    </span>
                                </a>
                            </div>
                        )}

                        {/* 🗺️ Nearby attractions */}
                        {nearbyAttractions && nearbyAttractions.length > 0 && (
                            <ul
                                ref={attractionsRef}
                                className="space-y-3 pt-8 mt-4 border-t border-bone/10"
                            >
                                {nearbyAttractions.map((n) => (
                                    <li
                                        key={n.name}
                                        className="list-item-reveal flex items-baseline justify-between border-b border-bone/10 pb-3 group cursor-default"
                                    >
                                        <span className="font-serif text-bone/80 text-lg transition-all duration-300 transform group-hover:translate-x-1.5 group-hover:text-[var(--color-accent)]">
                                            {n.name}
                                        </span>
                                        <span className="text-xs uppercase tracking-[0.25em] text-bone/50 transition-all duration-300 transform group-hover:-translate-x-1 group-hover:text-[var(--color-accent)]">
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
                        // 🧱 Aggiunto pointer-events-none su mobile per evitare che blocchi lo scroll, si attiva il click/drag solo al tocco mirato
                        className="lg:col-span-7 relative h-[400px] sm:h-[450px] lg:h-[550px] w-full overflow-hidden rounded-sm border border-bone/10 transform-gpu bg-card/5"
                    >
                        {/* Overlay invisibile protettivo che intercetta i tocchi accidentali per non bloccare lo scroll mobile */}
                        <div className="absolute inset-0 z-10 bg-transparent lg:hidden pointer-events-auto" onClick={(e) => e.currentTarget.style.display = 'none'} />

                        {mapEmbed ? (
                            <iframe
                                title="Location Map Embed"
                                className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[0.95] sepia-[0.08] transition-all duration-700"
                                src={mapEmbed}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        ) : (
                            <iframe
                                title="Fallback Location Map"
                                className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[0.95] sepia-[0.08]"
                                src="https://www.openstreetmap.org/export/embed.html?bbox=11.4%2C42.95%2C11.7%2C43.15&layer=mapnik"
                                loading="lazy"
                            />
                        )}

                        {/* Cinematic Ambient Atmosphere (Sostituiti i vecchi gradienti con i colori del brand) */}
                        <div className="absolute inset-0 bg-ink/5 pointer-events-none mix-blend-multiply" />
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-ink/40 to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}