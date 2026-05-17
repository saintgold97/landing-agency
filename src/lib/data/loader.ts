// src/lib/data/loader.ts
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import type { Section, SectionType } from '@/types/sections/index';
import { TemplateConfig } from '@/types/template';
import { ResolvedThemeConfig, resolveThemeConfig } from '@/types/theme';
import { isValidTemplate, getTemplate } from '../templates';
import { siteConfigSchema } from '@/types/site-config';


type ParsedSiteConfig = z.infer<typeof siteConfigSchema>;

export type SiteConfig = Omit<ParsedSiteConfig, 'sections'> & {
    sections: Section[];
};

export type MergedSiteData = SiteConfig & {
    template: TemplateConfig;
    templateId: string;
    theme: ResolvedThemeConfig;
};

// ============================================================================
// 📦 Funzione principale: carica e mergea config + template
// ============================================================================

export async function getSiteData(slug: string): Promise<MergedSiteData | null> {
    if (!slug || typeof slug !== 'string') {
        console.error('❌ getSiteData: slug is invalid', { slug, type: typeof slug });
        return null;
    }

    const configPath = path.join(process.cwd(), 'src/content/sites', slug, 'config.json');

    if (!fs.existsSync(configPath)) {
        console.error(`❌ Config not found: ${configPath}`);
        return null;
    }

    try {
        // 1. Leggi e valida config cliente
        const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const config = siteConfigSchema.parse(raw);

        // 2. Verifica che il template esista nel registry
        if (!isValidTemplate(config.meta.templateId)) {
            console.error(`❌ Template "${config.meta.templateId}" non registrato`);
            return null;
        }

        // 3. Carica il template config (sincrono, non async!)
        const templateConfig = getTemplate(config.meta.templateId);
        if (!templateConfig) {
            console.error(`❌ Impossibile caricare template "${config.meta.templateId}"`);
            return null;
        }

        // 4. Merge theme: config cliente override template default
        const resolvedTheme = resolveThemeConfig(
            config.theme,
            templateConfig.theme
        );

        // 5. Tipizza le sezioni (warning invece di throw per flessibilità)
        const typedSections = config.sections.map((clientSection) => {
            // Trova il default dal template
            const defaultSection = templateConfig.defaultSections.find(
                (ds) => ds.type === clientSection.type
            );

            return {
                id: clientSection.id,
                type: clientSection.type as SectionType,
                title: clientSection.title,
                subtitle: clientSection.subtitle,
                content: clientSection.content as Record<string, unknown>,
                visible: clientSection.visible ?? defaultSection?.visible ?? true,
                order: clientSection.order ?? defaultSection?.order ?? 999,
            } as Section;
        });

        // 6. Costruisci il config merged finale
        const merged: MergedSiteData = {
            ...config,
            sections: typedSections,
            template: templateConfig,
            templateId: config.meta.templateId,
            theme: resolvedTheme,
        };

        return merged;

    } catch (error) {
        console.error(`❌ Error loading site "${slug}":`, error);
        return null;
    }
}