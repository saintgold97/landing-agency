import { SectionType } from "./index";

/**
 * Definizione dei template e delle loro sezioni supportate
 */
export const templateSectionRegistry = {
  accommodation_facility: [
    'navigation', 'heroCinematicScroll', 'about', 'rooms', 'services',
    'experiences', 'gallery', 'testimonials', 'location', 'contact', 'cta', 'footer'
  ] as const,

  accommodation_facility_cinematic: [
    'navigation', 'heroCinematicScroll', 'about', 'rooms', 'services',
    'experiences', 'gallery', 'testimonials', 'location', 'cta', 'footer'
  ] as const,

  // Aggiungi nuovi template qui
} as const;

export type TemplateId = keyof typeof templateSectionRegistry;
export type TemplateSections<T extends TemplateId> = typeof templateSectionRegistry[T][number];

/**
 * Type guard per verificare se una sezione è valida per un template
 */
export function isValidSectionForTemplate<K extends SectionType, T extends TemplateId>(
  sectionType: K,
  templateId: T
): sectionType is TemplateSections<T> & K {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return templateSectionRegistry[templateId].includes(sectionType as any);
}

/**
 * Ottieni le sezioni disponibili per un template (type-safe)
 */
export function getSectionsForTemplate<T extends TemplateId>(templateId: T): TemplateSections<T>[] {
  return [...templateSectionRegistry[templateId]] as TemplateSections<T>[];
}