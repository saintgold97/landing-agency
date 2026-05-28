// src/app/[sites]/page.tsx
import { notFound } from 'next/navigation';
import { getSiteData } from '@/lib/data/loader';
import {
  renderSectionByTemplate,
  isRegisteredTemplate
} from '@/components/sections';
import { Loader } from '@/components/ui/Loader';
import siteIndex from '@/lib/data/site-index.json';

export async function generateStaticParams() {
  return Object.keys(siteIndex).map((slug) => ({
    sites: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sites: string }>
}) {
  const { sites } = await params;
  const config = getSiteData(sites);

  if (!config) {
    return {
      title: 'Not found',
      description: 'The requested site was not found.',
      robots: { index: false, follow: false },
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
  params: Promise<{ sites: string }>
}) {
  const { sites } = await params;

  const config = getSiteData(sites);

  if (!config || !isRegisteredTemplate(config.templateId)) {
    notFound();
  }

  const sections = config.sections
    .filter(s => s.visible !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <>
      <Loader business={config.business} />

      <div className="site-sections">
        {sections.map((section, index) => (
          <div
            key={`${section.type}-${section.id ?? index}`}
            data-section-type={section.type}
            data-index={index}
          >
            {renderSectionByTemplate(
              config.templateId,
              section,
              index,
              {
                id: section.id,
                title: section.title,
                subtitle: section.subtitle,
                theme: config.theme,
              }
            )}
          </div>
        ))}
      </div>
    </>
  );
}