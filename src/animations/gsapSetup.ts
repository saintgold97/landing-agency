// src/animations/gsapSetup.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Flag per evitare registrazioni multiple
let isRegistered = false;

/**
 * Registra GSAP + ScrollTrigger una sola volta
 * Safe da chiamare in qualsiasi punto dell'app
 */
export function registerCinemaAnimations(): void {
  if (typeof window === "undefined" || isRegistered) return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Config globali opzionali per ScrollTrigger
  ScrollTrigger.config({
    limitCallbacks: true,        // Performance: limita callback non necessarie
    syncInterval: 30,            // Sync con requestAnimationFrame
  });
  
  // Default easing per coerenza visiva
  gsap.defaults({
    ease: "power2.out",
    duration: 0.8,
  });
  
  isRegistered = true;
  
  if (process.env.NODE_ENV === "development") {
    console.log("🎬 GSAP + ScrollTrigger registered");
  }
}

/**
 * Utility per creare timeline cinematiche con preset
 */
export const createCinematicTimeline = (vars?: gsap.TimelineVars) => {
  return gsap.timeline({
    defaults: { ease: "power2.out", duration: 0.8 },
    ...vars,
  });
};

/**
 * Attributo data per selezionare sezioni cinematiche
 */
export const cinemaSectionAttr = "data-cinema-section" as const;