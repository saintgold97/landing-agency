// src/app/[sites]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSiteData } from '@/lib/data/loader';
import {
  renderSectionByTemplate,
  isRegisteredTemplate
} from '@/components/sections';
import { Loader } from '@/components/ui/Loader';

// === SEO Dinamica (Server Component) ===
export async function generateMetadata({
  params,
}: {
  params: Promise<{ sites: string }>;
}): Promise<Metadata> {
  const { sites } = await params;
  const config = await getSiteData(sites);

  if (!config) {
    return {
      title: 'Sito non trovato',
      description: 'La pagina richiesta non esiste.',
    };
  }

  return {
    title: config.seo.metaTitle,
    description: config.seo.metaDescription,
    keywords: config.seo.keywords,
    openGraph: {
      title: config.seo.metaTitle,
      description: config.seo.metaDescription,
      type: 'website',
      locale: config.meta.locale,
      siteName: config.business.name,
    },
  };
}

// === Pagina Cliente ===
export default async function SitePage({
  params,
}: {
  params: Promise<{ sites: string }>;
}) {
  const { sites } = await params;
  const config = await getSiteData(sites);

  if (!config) return notFound();

  // ✅ Verifica che il template sia registrato
  if (!isRegisteredTemplate(config.templateId)) {
    console.error(`❌ Template "${config.templateId}" non configurato`);
    return notFound();
  }

  const sortedSections = config.sections
    .filter((s) => s.visible)  // 1. Filtra le visibili
    .sort((a, b) => a.order - b.order); // 2. Ordina per order numerico

  return (
    <>
      <Loader business={config.business}/>
      {sortedSections.map((section, index) => {
        return renderSectionByTemplate(
          config.templateId,
          section,
          index,
          {
            id: section.id,
            title: section.title,
            subtitle: section.subtitle,
            theme: config.theme,
          }
        );
      })}
    </>
  );
}