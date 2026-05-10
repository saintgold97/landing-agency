// src/app/[site]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { renderSection } from '@/components/sections';
import { getSiteData } from '@/lib/data/loader';


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
        alternates: {
            canonical: config.integrations?.domain,
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

    return (
        <main className="min-h-screen bg-background text-foreground">
            {config.sections?.map((section, index) => {
                return renderSection(section, index, {
                    id: section.id,
                    title: section.title,
                    subtitle: section.subtitle,
                    theme: config.theme,
                });
            })}
        </main>
    );
}