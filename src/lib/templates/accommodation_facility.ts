// src/lib/templates/accommodation_facility_v1.ts

import { TemplateConfig } from "@/types/template";

const accommodationFacilityV1: TemplateConfig = {
    id: "accommodation_facility",
    name: "Accommodation Facility — Classic",
    description: "Template elegante e tradizionale per B&B, hotel e agriturismi. Layout pulito, focus su prenotazioni e informazioni.",

    sectors: ["bnb", "hotel", "agriturismo", "guesthouse", "resort"],

    theme: {
        colors: {
            primary: "#2D4739",
            primaryForeground: "#FFFFFF",
            accent: "#C4A77D",
            accentForeground: "#1A1A1A",
            background: "#FAF8F5",
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
            containerWidth: "lg",
            borderRadius: "md",
            sectionPadding: "loose",
        },
    },

    // Sezioni con componenti V1 (classic)
    defaultSections: [
        { type: "navigation", order: 1 },
        { type: "heroCinematicScroll", order: 2 },
        { type: "about", order: 3 },
        { type: "rooms", order: 4 },
        { type: "experiences", order: 5 },
        { type: "services", order: 6 },
        { type: "gallery", order: 7 },
        { type: "testimonials", order: 8 },
        { type: "location", order: 9 },
        { type: "contact", order: 10 },
        { type: "footer", order: 12 },
    ],

    version: "1.0.0",
    previewImage: "/templates/accommodation/preview-classic.jpg",
    tags: ["classic", "booking", "seo-optimized", "mobile-first"],
};

export default accommodationFacilityV1;