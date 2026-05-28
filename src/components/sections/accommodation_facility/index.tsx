import type { ComponentType, JSX } from 'react';
import type { ThemeConfig } from '@/types/theme';
import { Section, SectionContentMap, SectionType } from '@/types/sections/index';
import dynamic from 'next/dynamic';

// ============================================================================
// 📦 Import dei Componenti in Lazy Loading (Dynamic Imports)
// ============================================================================

const Navigation = dynamic(() => import('./navigation').then(m => m.Navigation), { ssr: true });
const HeroCinematicScrollV1 = dynamic(() => import('./hero-cinematic-scroll').then(m => m.HeroCinematicScrollV1), { ssr: true });
const AboutSection = dynamic(() => import('./about-section').then(m => m.AboutSection), { ssr: true });
const RoomsSection = dynamic(() => import('./rooms-section').then(m => m.RoomsSection), { ssr: true });
const ServicesSection = dynamic(() => import('./services-section').then(m => m.ServicesSection), { ssr: true });
const ExperiencesSection = dynamic(() => import('./experiences-section').then(m => m.ExperiencesSection), { ssr: true });
const GallerySection = dynamic(() => import('./gallery-section').then(m => m.GallerySection), { ssr: true });
const TestimonialsSection = dynamic(() => import('./testimonials-section').then(m => m.TestimonialsSection), { ssr: true });
const LocationSection = dynamic(() => import('./location-section').then(m => m.LocationSection), { ssr: true });
const CtaSection = dynamic(() => import('./cta-section').then(m => m.CtaSection), { ssr: true });
const FooterSection = dynamic(() => import('./footer-section').then(m => m.FooterSection), { ssr: true });
const ContactSection = dynamic(() => import('./contact-section').then(m => m.ContactSection), { ssr: true });

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