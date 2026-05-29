// src/components/ui/SmoothScroll.tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { registerCinemaAnimations } from "@/animations/gsapSetup";

export function SmoothScroll() {
  const isInitialized = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized.current || typeof window === "undefined") return;
    isInitialized.current = true;

    registerCinemaAnimations();

    // 📱 Rileva se il dispositivo è mobile/touch prima di configurare Lenis
    const isMobile = window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window;

    const lenis = new Lenis({
      duration: 1.1, // Leggermente ridotto per massima reattività
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // 🛑 CAMBIAMENTO CRUCIALE: Rimosso syncTouch. 
      // Se è mobile disattiviamo lo smooth interamente lasciando lo scroll nativo fluido a 120Hz di iOS/Android.
      autoRaf: false,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 🚀 Normalizza il comportamento di ScrollTrigger sui browser mobile (evita salti della barra indirizzi)
    if (isMobile) {
      console.log("sono qui in mobile")
      ScrollTrigger.config({ ignoreMobileResize: true });
      ScrollTrigger.normalizeScroll(true); // Forza la sincronizzazione corretta senza lag software
    }

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 100); // Portato a 100ms per dare tempo alle immagini lazy di calcolare le altezze su mobile

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}