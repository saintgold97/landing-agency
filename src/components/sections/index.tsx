// src/components/sections/index.ts

import type { ComponentType, JSX } from 'react';

/**
 * ============================================================================
 * 📦 Components Imports
 * ============================================================================
 */

import { AboutSection } from './about-section';
import { ContactSection } from './contact-section';
import { CtaSection } from './cta-section';
import { ExperiencesSection } from './experiences-section';
import { FooterSection } from './footer-section';
import { GallerySection } from './gallery-section';
import { HeroCinematicScroll } from './hero-cinematic-scroll';
import { LocationSection } from './location-section';
import { Navigation } from './navigation';
import { RoomsSection } from './rooms-section';
import { SpaSection } from './spa-section';
import { TestimonialsSection } from './testimonials-section';
import { SectionType, SectionContentMap, Section } from '@/types/sections';
import { ThemeConfig } from '@/types/theme';

/**
 * ============================================================================
 * 📦 Barrel Exports
 * ============================================================================
 */

export { Navigation } from './navigation';
export { HeroCinematicScroll } from './hero-cinematic-scroll';
export { AboutSection } from './about-section';
export { RoomsSection } from './rooms-section';
export { SpaSection } from './spa-section';
export { ExperiencesSection } from './experiences-section';
export { GallerySection } from './gallery-section';
export { TestimonialsSection } from './testimonials-section';
export { LocationSection } from './location-section';
export { CtaSection } from './cta-section';
export { ContactSection } from './contact-section';
export { FooterSection } from './footer-section';

/**
 * ============================================================================
 * 📦 Types Exports
 * ============================================================================
 */

export type {
  Section,
  SectionContentMap,
  SectionType,
} from '@/types/sections';

/**
 * ============================================================================
 * 🎨 Base Props
 * ============================================================================
 */
export interface BaseSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  theme?: Partial<ThemeConfig>;
}

/**
 * ============================================================================
 * 🧩 Generic Section Component
 * ============================================================================
 */

export type SectionComponent<K extends SectionType> =
  ComponentType<
    BaseSectionProps & {
      content: SectionContentMap[K];
    }
  >;

/**
 * ============================================================================
 * 🗂️ Section Registry
 * ============================================================================
 */

export type SectionRegistry = {
  [K in SectionType]: SectionComponent<K>;
};

/**
 * ============================================================================
 * 🗄️ Central Registry
 * ============================================================================
 */

export const sectionComponents: SectionRegistry = {
  navigation: Navigation,

  heroCinematicScroll: HeroCinematicScroll,

  about: AboutSection,

  rooms: RoomsSection,

  spa: SpaSection,

  experiences: ExperiencesSection,

  gallery: GallerySection,

  testimonials: TestimonialsSection,

  location: LocationSection,

  cta: CtaSection,

  contact: ContactSection,

  footer: FooterSection,
};

/**
 * ============================================================================
 * 🛠️ Helpers
 * ============================================================================
 */

export function isValidSectionType(
  value: string
): value is SectionType {
  return value in sectionComponents;
}

/**
 * Renderizza una sezione con type-safety completa
 */
export function renderSection<K extends SectionType>(
  section: Section<K>,
  id: number,
  props?: Omit<BaseSectionProps, 'content'> & { theme?: Partial<ThemeConfig> } 
): JSX.Element | null {
  if (!isValidSectionType(section.type)) {
    console.warn(`⚠️ Sezione non registrata: ${section.type}`);
    return null;
  }

  const Component = sectionComponents[section.type as keyof typeof sectionComponents] as SectionComponent<K>;

  return (
    <Component
      key={id}
      {...props}
      content={section.content}
    />
  );
}