"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation"; // ✅ Hook valido in "use client"
import { registerCinemaAnimations } from "@/animations/gsapSetup";

export function SmoothScroll() {
  const isInitialized = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname(); // ✅ Letto fuori dall'effect

  // ============================================================================
  // 🚀 Inizializzazione UNICA di Lenis + GSAP (solo al primo mount)
  // ============================================================================
  useEffect(() => {
    if (isInitialized.current || typeof window === "undefined") return;
    isInitialized.current = true;

    // 1. Registra plugin GSAP
    registerCinemaAnimations();

    // 2. Inizializza Lenis (UNA SOLA VOLTA)
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true, // ✅ Migliore esperienza mobile
    });
    lenisRef.current = lenis;

    // 3. Collega Lenis a ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 4. Sync con GSAP ticker
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 5. Cleanup SOLO su unmount definitivo (non su route change)
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      // ❌ NON fare ScrollTrigger.kill() qui: rompe le animazioni tra le route
    };
  }, []); // ✅ Array vuoto = esegue solo una volta

  // ============================================================================
  // 🔄 Refresh ScrollTrigger ad ogni cambio di route (senza rimontare Lenis)
  // ============================================================================
  useEffect(() => {
    if (!isInitialized.current) return;

    // Delay per dare tempo a Next.js di completare il layout painting
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      if (process.env.NODE_ENV === "development") {
        console.log(`🔄 ScrollTrigger refreshed for: ${pathname}`);
      }
    }, 50); // 50ms è sufficiente, evita layout thrashing

    return () => clearTimeout(timer);
  }, [pathname]); // ✅ Si riesegue solo quando cambia la route

  useEffect(() => {
    console.log("📍 Pathname changed:", pathname);
  }, [pathname]);

  return null;
}