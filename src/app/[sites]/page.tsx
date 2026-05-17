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
      title: "Sito non trovato",
      description: "La pagina richiesta non esiste",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: {
      default: config.seo.title,
      template: `%s | ${config.business.name}`,
    },
    description: config.seo.description,
    keywords: config.seo.keywords,

    robots: config.seo.robots,

    metadataBase: config.seo.metadataBase
      ? new URL(config.seo.metadataBase)
      : undefined,

    openGraph: config.seo.openGraph,

    twitter: config.seo.twitter,
  };
}

// === Pagina Cliente ===
export default async function SitePage({
  params,
}: {
  params: { sites: string };
}) {
  const { sites } = params;

  const config = await getSiteData(sites);

  if (!config) notFound();

  if (!isRegisteredTemplate(config.templateId)) {
    console.error(`Template non registrato: ${config.templateId}`);
    notFound();
  }

  const sections = config.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <Loader business={config.business} />

      {sections.map((section, index) =>
        renderSectionByTemplate(
          config.templateId,
          section,
          index,
          {
            id: section.id,
            title: section.title,
            subtitle: section.subtitle,
            theme: config.theme,
          }
        )
      )}
    </>
  );
}