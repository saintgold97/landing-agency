// src/lib/templates/accommodation_facility_v2.ts

import { TemplateConfig } from "@/types/template";

const accommodationFacilityV2: TemplateConfig = {
    id: "accommodation_facility_cinematic",
    name: "Accommodation Facility — Cinematic",
    description: "Template premium con animazioni GSAP, scroll cinematico e design immersivo. Per luxury resort e boutique hotel.",

    sectors: ["luxury-hotel", "resort", "boutique-hotel", "relais"],

    theme: {
        colors: {
            primary: "#0c3921",
            primaryForeground: "#FFFFFF",
            accent: "#C4A77D",
            accentForeground: "#1A1A1A",
            background: "#ede3d6",
            foreground: "#1A1A1A",
            muted: "#F0EDE8",
            mutedForeground: "#6B6B6B",
            border: "#E5E7EB",
        },
        fonts: {
            heading: "Playfair Display, serif",
            body: "Inter, sans-serif",
            mono: "JetBrains Mono, monospace",
        },
        layout: {
            containerWidth: "full",
            borderRadius: "sm",
            sectionPadding: "loose",
        },
    },

    // Sezioni con componenti V2 (cinematic)
    defaultSections: [
        { type: "navigation", order: 1 },
        { type: "heroCinematicScroll", order: 2 },
        { type: "about", order: 3 },
        { type: "rooms", order: 4 },
        { type: "experiences", order: 5 },
        { type: "services", order: 6 },
        { type: "gallery", order: 7 },
        { type: "testimonials", order: 8 },
        { type: "location", order: 8 },
        { type: "cta", order: 10 },
        { type: "footer", order: 11 },
    ],

    version: "1.0.0",
    previewImage: "/templates/accommodation/preview-cinematic.jpg",
    tags: ["cinematic", "gsap", "luxury", "immersive", "animations"],
};

export default accommodationFacilityV2;