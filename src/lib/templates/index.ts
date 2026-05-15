// /**
//  * 📦 Template Registry
//  * 
//  * Questo file mappa gli ID dei settori ai loro file di configurazione.
//  * Utilizza import dinamici (lazy loading) per non appesantire il bundle iniziale.
//  */

import type { TemplateConfig } from "@/types/template";
import accommodationFacility from "./accommodation_facility";
import accommodationFacilityCinematic from "./accommodation_facility_cinematic";
// Futuri template: import restaurant from "./restaurant";

/**
 * Registry centrale di tutti i template disponibili
 * Chiave: ID univoco del template (usato nel DB/config sito)
 */
export const templateRegistry: Record<string, TemplateConfig> = {
  "accommodation_facility": accommodationFacility,
  "accommodation_facility_cinematic": accommodationFacilityCinematic,
  // "restaurant": restaurant,
  // "esthetic_center": estheticCenter,
} as const;

export type TemplateId = keyof typeof templateRegistry;

/**
 * Helper per ottenere un template in modo type-safe
 */
export function getTemplate(id: string): TemplateConfig | undefined {
  return templateRegistry[id as TemplateId];
}

/**
 * Helper per validare se un template esiste
 */
export function isValidTemplate(id: string): id is TemplateId {
  return id in templateRegistry;
}

/**
 * Helper per ottenere tutti i template di un settore
 */
export function getTemplatesBySector(sector: string): TemplateConfig[] {
  return Object.values(templateRegistry).filter((t) =>
    t.sectors.includes(sector)
  );
}