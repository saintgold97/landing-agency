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

    const isMobile = window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window;

    // Configurazione ScrollTrigger per Mobile
    if (isMobile) {
      ScrollTrigger.config({ ignoreMobileResize: true });
      ScrollTrigger.normalizeScroll(true);
    }

    // Inizializzazione Lenis
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isMobile, // Disattiva lo smooth wheel se sei su mobile
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // Collega Lenis a ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Ticker di GSAP
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update); // 🧼 Pulizia evento
      gsap.ticker.remove(raf);
      lenis.destroy();
      isInitialized.current = false;
    };
  }, []);

  // Gestione del cambio pagina (Reset Scroll + Refresh)
  useEffect(() => {
    if (!lenisRef.current) return;

    // 1. Resetta istantaneamente lo scroll in cima alla nuova pagina
    lenisRef.current.scrollTo(0, { immediate: true });

    // 2. Attendi il rendering dei componenti/immagini prima del refresh
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 150); // Un pelino più alto per sicurezza sui dispositivi lenti

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}