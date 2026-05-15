// src/lib/data/loader.ts
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import type { Section, SectionType } from '@/types/sections/index';
import { TemplateConfig } from '@/types/template';
import { ClientThemeConfig, ResolvedThemeConfig, resolveThemeConfig } from '@/types/theme';
import { isValidTemplate, getTemplate } from '../templates';

// ============================================================================
// 📋 Schema Zod per config cliente (validazione input)
// ============================================================================

export const siteConfigSchema = z.object({
    meta: z.object({
        version: z.string(),
        sector: z.string(),
        templateId: z.string(),
        locale: z.string().default('it-IT'),
    }),
    business: z.object({
        name: z.string(),
        tagline: z.string(),
        description: z.string(),
        logo: z.string().optional(),
    }),
    contact: z.object({
        email: z.email(),
        phone: z.string(),
        address: z.string().optional(),
        whatsapp: z.string().optional(),
        hours: z.string().optional(),
        socialLinks: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
    }),
    sections: z.array(
        z.object({
            id: z.string(),
            type: z.string(),
            title: z.string().optional(),
            subtitle: z.string().optional(),
            content: z.record(z.string(), z.unknown()),
            visible: z.boolean().optional(),
            order: z.number().optional(),
        }).loose()
    ),
    seo: z.object({
        metaTitle: z.string(),
        metaDescription: z.string(),
        keywords: z.array(z.string()),
        schemaType: z.string().default('LocalBusiness'),
    }),
    theme: z
        .object({
            colors: z.object({
                primary: z.string().optional(),
                primaryForeground: z.string().optional(),
                accent: z.string().optional(),
                accentForeground: z.string().optional(),
                background: z.string().optional(),
                foreground: z.string().optional(),
                muted: z.string().optional(),
                mutedForeground: z.string().optional(),
                border: z.string().optional(),
            }),
            fonts: z.object({
                heading: z.string().optional(),
                body: z.string().optional(),
                mono: z.string().optional(),
            }),
            layout: z.object({
                containerWidth: z.enum(["sm", "md", "lg", "xl", "full"]).default("lg"),
                borderRadius: z.enum(["none", "sm", "md", "lg", "full"]).default("md"),
                sectionPadding: z.enum(["tight", "normal", "loose"]).default("normal"),
            }).optional(),
        })
        .default({
            colors: {
                primary: "#2563EB",
                primaryForeground: "#FFFFFF",
                accent: "#F59E0B",
                accentForeground: "#1A1A1A",
                background: "#FFFFFF",
                foreground: "#111827",
                muted: "#F3F4F6",
                mutedForeground: "#6B7280",
                border: "#E5E7EB",
            },
            fonts: {
                heading: "Inter, sans-serif",
                body: "Inter, sans-serif",
            },
        })
        .optional(),
});

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
            config.theme as ClientThemeConfig | undefined,  // ← assertion per allineare i tipi
            templateConfig.theme                             // ← ThemeConfig con tutti i campi richiesti
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