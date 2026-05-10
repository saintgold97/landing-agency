// src/lib/templates/accommodation_facility.ts

import { TemplateConfig } from "@/types/template";

const accommodationFacilityTemplate: TemplateConfig = {
    // === IDENTIFICATIVO ===
    id: "accommodation",
    name: "Accommodation Facility",
    description: "Template specifico per strutture ricettive: B&B, hotel, agriturismi, resort. Include sezioni per camere, servizi, prenotazioni e esperienze.",

    // === SETTORI APPLICABILI ===
    sectors: [
        "bnb",
        "bed-and-breakfast",
        "hotel",
        "resort",
        "hostel",
        "agriturismo",
        "affitti-brevi",
        "guesthouse"
    ],

    // === TEMA DI DEFAULT ===
    theme: {
        colors: {
            primary: "#2D4739",              // Verde foresta (natura, relax)
            primaryForeground: "#FFFFFF",    // Testo su primary
            accent: "#C4A77D",               // Oro caldo (lusso, eleganza)
            accentForeground: "#1A1A1A",     // Testo su accent
            background: "#FAF8F5",           // Bianco sporco caldo
            foreground: "#1A1A1A",           // Testo principale
            muted: "#F0EDE8",                // Sfondo sezioni secondarie
            mutedForeground: "#6B6B6B",      // Testo secondario
            border: "#E5E7EB",               // Bordi
        },
        fonts: {
            heading: "Playfair Display, serif",  // Elegante per titoli
            body: "Inter, sans-serif",           // Leggibile per testi
            mono: "JetBrains Mono, monospace",   // Opzionale per codici/prezzi
        },
        layout: {
            containerWidth: "lg",
            borderRadius: "md",
            sectionPadding: "loose",
        },
        components: {
            button: {
                variant: "solid",
                borderRadius: "md",
            },
            card: {
                shadow: "md",
                border: false,
            },
        },
    },

    // === SEZIONI DI DEFAULT (ordine di rendering) ===
    defaultSections: [
        { type: "navigation", visible: true, order: 1 },
        { type: "heroCinematicScroll", visible: true, order: 2 },
        { type: "about", visible: true, order: 3 },
        { type: "rooms", visible: true, order: 4 },
        { type: "experiences", visible: true, order: 5 },
        { type: "spa", visible: false, order: 6 },
        { type: "gallery", visible: true, order: 7 },
        { type: "testimonials", visible: true, order: 8 },
        { type: "location", visible: true, order: 9 },
        { type: "contact", visible: true, order: 10 },
        { type: "footer", visible: true, order: 12 },
    ],

    // === VERSIONE (per gestione aggiornamenti) ===
    version: "1.0.0",

    // === METADATA OPZIONALI ===
    previewImage: "/templates/accommodation/preview.jpg",
    tags: [
        "luxury",
        "booking",
        "mobile-first",
        "seo-optimized",
        "gdpr-ready",
        "multi-language"
    ],
};

export default accommodationFacilityTemplate;