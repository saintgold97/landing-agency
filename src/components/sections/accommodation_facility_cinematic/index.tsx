import type { ComponentType, JSX } from 'react';
import type { Section, SectionType, SectionContentMap } from '@/types/sections/index';
import type { ThemeConfig } from '@/types/theme';

// ============================================================================
// 📦 Import Componenti Specifici del Template
// ============================================================================

import { About } from './About';
import { CtaClosing } from './CtaClosing';
import { Experience } from './Experience';
import { Footer } from './Footer';
import { Gallery } from './Gallery';
import { HeroCinematicScrollV2 } from './HeroCinematicScroll';
import { Nav } from './Nav';
import { Rooms } from './Rooms';
import { Services } from './Services';
import { Testimonials } from './Testimonials';
import { Location } from './Location';

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
  navigation: Nav,
  heroCinematicScroll: HeroCinematicScrollV2,
  about: About,
  rooms: Rooms,
  services: Services,
  experiences: Experience,
  gallery: Gallery,
  testimonials: Testimonials,
  location: Location,
  cta: CtaClosing,
  footer: Footer,
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