// src/types/template.ts

import { ThemeConfig } from "./theme";

// ============================================================================
// 📦 Template Configuration - Definizione completa
// ============================================================================

export type TemplateConfig = {
    // Identificativo univoco del template
    id: string;                    // Es: "accommodation", "restaurant", "artisan"

    // Metadati descrittivi
    name: string;                  // Nome leggibile: "B&B / Hospitality"
    description: string;           // Descrizione breve del template

    // Settori a cui si applica (per matching automatico)
    sectors: string[];             // Es: ["bnb", "agriturismo", "hospitality"]

    // Configurazione tema di default (sovrascrivibile dal cliente)
    theme: ThemeConfig;

    // Sezioni disponibili di default per questo template
    defaultSections: Array<{
        type: string;                // Tipo sezione: "hero", "about", "rooms", etc.
        visible?: boolean;            // Visibile di default?
        order: number;               // Ordine di rendering
    }>;

    // Versione del template (per gestione aggiornamenti/migrazioni)
    version: string;               // Es: "1.0.0"

    // Metadata opzionali per il builder
    previewImage?: string;         // URL immagine anteprima template
    tags?: string[];               // Tag per filtraggio: ["luxury", "minimal", "booking"]
};