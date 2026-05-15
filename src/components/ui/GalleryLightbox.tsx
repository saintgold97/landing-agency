// src/components/sections/accommodation_facility_cinematic/GalleryLightbox.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { SectionContentMap } from "@/types/sections";

interface GalleryLightboxProps {
    images: SectionContentMap["gallery"]["images"];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    isImageLoaded: boolean;
}

export function GalleryLightbox({
    images,
    currentIndex,
    isOpen,
    onClose,
    onNext,
    onPrev,
    isImageLoaded,
}: GalleryLightboxProps) {
    const current = images[currentIndex];

    // ============================================================================
    // ♿ Focus trap per accessibilità
    // ============================================================================
    useEffect(() => {
        if (!isOpen) return;

        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = document.querySelector('[role="dialog"]');
        const elements = modal?.querySelectorAll<HTMLElement>(focusableElements);
        const first = elements?.[0];
        const last = elements?.[elements.length - 1];

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== "Tab" || !elements || elements.length === 0) return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        };

        document.addEventListener("keydown", handleTab);
        first?.focus();

        return () => document.removeEventListener("keydown", handleTab);
    }, [isOpen]);

    // ============================================================================
    // 🖱️ Prevent body scroll when modal is open
    // ============================================================================
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!current) return null;

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery image ${currentIndex + 1} of ${images.length}: ${current.alt}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-10 text-bone/80 hover:text-bone tracking-editorial text-[10px] uppercase border border-bone/20 px-3 py-1.5 md:px-4 md:py-2 rounded-sm hover:bg-bone hover:text-ink transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-champagne cursor-pointer"
                aria-label="Close gallery"
            >
                ✕
            </button>

            {/* Navigation arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrev();
                        }}
                        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 text-bone/60 hover:text-bone p-2 md:p-3 rounded-full hover:bg-bone/10 transition-colors focus:outline-none focus:ring-2 focus:ring-champagne cursor-pointer"
                        aria-label="Previous image"
                    >
                        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 text-bone/60 hover:text-bone p-2 md:p-3 rounded-full hover:bg-bone/10 transition-colors focus:outline-none focus:ring-2 focus:ring-champagne cursor-pointer"
                        aria-label="Next image"
                    >
                        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Image container */}
            <div className="relative max-h-[90vh] max-w-[95vw] md:max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
                {/* Loading state */}
                {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
                        <div className="w-8 h-8 border-2 border-champagne/30 border-t-champagne rounded-full animate-spin" aria-label="Loading image" />
                    </div>
                )}

                {/* Optimized Next.js Image */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.98, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
                        className="relative"
                    >
                        <Image
                            src={current.src}
                            alt={current.alt}
                            width={1920}
                            height={1280}
                            className="max-h-[85vh] max-w-[95vw] md:max-w-[90vw] object-contain"
                            priority
                            onLoad={() => { }}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Caption */}
                {current.alt && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-ink/90 via-ink/60 to-transparent">
                        <p className="text-bone/90 text-sm md:text-base tracking-editorial uppercase">
                            {current.alt}
                        </p>
                        {current.category && (
                            <span className="text-champagne text-xs tracking-wider ml-2">· {current.category}</span>
                        )}
                    </div>
                )}

                {/* Counter */}
                {images.length > 1 && (
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 text-bone/60 text-[10px] md:text-xs tracking-editorial uppercase">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Mobile swipe hint */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden text-bone/40 text-[9px] tracking-editorial uppercase animate-pulse">
                    Swipe ← →
                </div>
            )}
        </motion.div>
    );
}