import type { ComponentType, JSX } from 'react';
import type { Section, SectionType, SectionContentMap } from '@/types/sections/index';
import type { ThemeConfig } from '@/types/theme';
import dynamic from 'next/dynamic';

// ============================================================================
// 📦 Import dei Componenti in Lazy Loading (Dynamic Imports)
// ============================================================================

const Nav = dynamic(() => import('./Nav').then(m => m.Nav), { ssr: true });
const HeroCinematicScrollV2 = dynamic(() => import('./HeroCinematicScroll').then(m => m.HeroCinematicScrollV2), { ssr: true });
const About = dynamic(() => import('./About').then(m => m.About), { ssr: true });
const Rooms = dynamic(() => import('./Rooms').then(m => m.Rooms), { ssr: true });
const Services = dynamic(() => import('./Services').then(m => m.Services), { ssr: true });
const Experience = dynamic(() => import('./Experience').then(m => m.Experience), { ssr: true });
const Gallery = dynamic(() => import('./Gallery').then(m => m.Gallery), { ssr: true });
const Testimonials = dynamic(() => import('./Testimonials').then(m => m.Testimonials), { ssr: true });
const Location = dynamic(() => import('./Location').then(m => m.Location), { ssr: true });
const CtaClosing = dynamic(() => import('./CtaClosing').then(m => m.CtaClosing), { ssr: true });
const Footer = dynamic(() => import('./Footer').then(m => m.Footer), { ssr: true });

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
};

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