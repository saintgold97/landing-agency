/**
 * ============================================================================
 * 🧩 Central Section Registry - Multi-Template System
 * ============================================================================
 * 
 * Questo file aggrega tutti i renderer dei template e fornisce
 * un'interfaccia unificata per il rendering dinamico.
 * 
 * Per aggiungere un nuovo template:
 * 1. Crea la cartella src/components/sections/[template_name]/
 * 2. Crea il suo index.ts con registry e renderSection
 * 3. Importa e registra qui sotto
 * ============================================================================
 */

import type { ComponentType, JSX } from 'react';
import type { ThemeConfig } from '@/types/theme';

// ============================================================================
// 📦 Import Registri dai Template Esistenti
// ============================================================================

// Template: accommodation_facility (Classic)
import {
  sectionComponents as accommodationClassicComponents,
  renderSection as renderAccommodationClassic,
  isValidSectionType as isValidAccommodationClassic,
} from './accommodation_facility';

// Template: accommodation_facility_cinematic (Cinematic)
import {
  sectionComponents as accommodationCinematicComponents,
  renderSection as renderAccommodationCinematic,
  isValidSectionType as isValidAccommodationCinematic,
} from './accommodation_facility_cinematic';

import { Section, SectionContentMap, SectionType } from '@/types/sections/index';

// ============================================================================
// 🎨 Base Props Condivise (unificate)
// ============================================================================

export interface BaseSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  theme?: Partial<ThemeConfig>;
}

// ============================================================================
// 🧩 Tipi Generici per il Rendering
// ============================================================================

export type SectionComponent<K extends SectionType> =
  ComponentType<BaseSectionProps & { content: SectionContentMap[K] }>;

  export type SectionRenderer = (
    section: Section<SectionType>,
    id: number,
    props?: Omit<BaseSectionProps, 'content'>
  ) => JSX.Element | null;

export type TemplateRendererConfig = {
  render: SectionRenderer;
  isValid: (type: string) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: Record<string, ComponentType<any>>;
};

// ============================================================================
// 🗄️ Registry Centrale dei Template
// ============================================================================

export const templateRenderers: Record<string, TemplateRendererConfig> = {
  /**
   * Template: Accommodation Facility — Classic
   * Stile: Tradizionale, focus su prenotazione e informazioni
   */
  "accommodation_facility": {
    render: renderAccommodationClassic,
    isValid: isValidAccommodationClassic,
    components: accommodationClassicComponents,
  },

  /**
   * Template: Accommodation Facility — Cinematic
   * Stile: Premium, animazioni GSAP, design immersivo
   */
  "accommodation_facility_cinematic": {
    render: renderAccommodationCinematic,
    isValid: isValidAccommodationCinematic,
    components: accommodationCinematicComponents,
  },

  /**
   * 🔄 TEMPLATE FUTURI (esempi):
   * Scommenta e configura quando aggiungi nuovi template
   */
  // "restaurant_classic": {
  //   render: renderRestaurant,
  //   isValid: isValidRestaurant,
  //   components: restaurantComponents,
  // },
  // "esthetic_center": {
  //   render: renderEsthetic,
  //   isValid: isValidEsthetic,
  //   components: estheticComponents,
  // },
};

// Tipo per gli ID dei template registrati
export type RegisteredTemplateId = keyof typeof templateRenderers;

// ============================================================================
// 🛠️ Helper Pubblici
// ============================================================================

export function getSectionRenderer(templateId: string): TemplateRendererConfig | undefined {
  return templateRenderers[templateId];
}

export function isRegisteredTemplate(templateId: string): templateId is RegisteredTemplateId {
  return templateId in templateRenderers;
}

export function getAvailableTemplates(): RegisteredTemplateId[] {
  return Object.keys(templateRenderers) as RegisteredTemplateId[];
}

export function renderSectionByTemplate<K extends SectionType>(
  templateId: string,
  section: Section<K>,
  id: number,
  props?: Omit<BaseSectionProps, 'content'>
): JSX.Element | null {
  const renderer = getSectionRenderer(templateId);
  
  if (!renderer) {
    console.error(`❌ Template "${templateId}" non registrato nel sistema.`);
    return null;
  }
  
  if (!renderer.isValid(section.type)) {
    console.warn(`⚠️ Sezione "${section.type}" non supportata dal template "${templateId}"`);
    return null;
  }
  
  return renderer.render(section, id, props);
}

// ============================================================================
// 📦 Re-export Tipi Centralizzati
// ============================================================================

export type { Section, SectionContentMap, SectionType, ThemeConfig };

// ============================================================================
// 🧪 Utility per Debug/Development
// ============================================================================

if (process.env.NODE_ENV === 'development') {
  console.log(`🎨 Section Registry loaded: ${getAvailableTemplates().length} template(s) available`);
}