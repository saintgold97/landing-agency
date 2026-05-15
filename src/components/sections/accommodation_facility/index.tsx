import type { ComponentType, JSX } from 'react';
import type { ThemeConfig } from '@/types/theme';

// ============================================================================
// 📦 Import Componenti Specifici del Template
// ============================================================================

import { AboutSection } from './about-section';
import { ContactSection } from './contact-section';
import { CtaSection } from './cta-section';
import { ExperiencesSection } from './experiences-section';
import { FooterSection } from './footer-section';
import { GallerySection } from './gallery-section';
import { HeroCinematicScrollV1 } from './hero-cinematic-scroll';
import { LocationSection } from './location-section';
import { Navigation } from './navigation';
import { RoomsSection } from './rooms-section';
import { ServicesSection } from './services-section';
import { TestimonialsSection } from './testimonials-section';
import { Section, SectionContentMap, SectionType } from '@/types/sections/index';

// ============================================================================
// 🎨 Base Props (condivise con altri template)
// ============================================================================

export interface BaseSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  theme?: Partial<ThemeConfig>;
}

// ============================================================================
// 🧩 Tipi Generici
// ============================================================================

export type SectionComponent<K extends SectionType> =
  ComponentType<BaseSectionProps & { content: SectionContentMap[K] }>;

// ============================================================================
// 🗂️ Registry Specifico del Template
// ============================================================================

export const sectionComponents = {
  navigation: Navigation,
  heroCinematicScroll: HeroCinematicScrollV1,
  about: AboutSection,
  rooms: RoomsSection,
  services: ServicesSection,
  experiences: ExperiencesSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
  location: LocationSection,
  cta: CtaSection,
  contact: ContactSection,
  footer: FooterSection,
} as const;

export type SectionRegistry = typeof sectionComponents;

// ============================================================================
// 🛠️ Helper per Validazione e Rendering
// ============================================================================

export function isValidSectionType(value: string): value is keyof SectionRegistry {
  return value in sectionComponents;
}

type LocalSectionComponent<K extends keyof SectionRegistry> =
  ComponentType<BaseSectionProps & { content: SectionContentMap[K] }>;

// Export con signature più permissiva
export function renderSection(
  section: Section<SectionType>,  // ← Più permissivo
  id: number,
  props?: Omit<BaseSectionProps, 'content'>
): JSX.Element | null {
  // La validazione runtime protegge dall'accesso a sezioni non supportate
  if (!isValidSectionType(section.type)) {
    console.warn(`⚠️ Sezione non supportata: ${section.type}`);
    return null;
  }

  // TypeScript ora sa che section.type è keyof SectionRegistry grazie al type guard
  const Component = sectionComponents[section.type as keyof SectionRegistry] as
    LocalSectionComponent<typeof section.type>;

  return (
    <Component
      key={`${section.type}-${id}`}
      {...props}
      content={section.content as SectionContentMap[typeof section.type]}
    />
  );
}