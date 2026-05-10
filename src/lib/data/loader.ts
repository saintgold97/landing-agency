// src/lib/data/loader.ts
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { templates, type TemplateId } from '../templates';
import type {
    Section,
} from '@/components/sections';

import {
    isValidSectionType,
} from '@/components/sections';
import { TemplateConfig } from '@/types/template';

// ============================================================================
// 📋 Schema Zod per config cliente (validazione input)
// ============================================================================

export const siteConfigSchema = z.object({
    meta: z.object({
        version: z.string(),
        sector: z.string(),
        templateId: z.string(),  // Deve corrispondere a keyof typeof TemplateIds
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
            type: z.string(),  // Stringa generica: validazione runtime
            title: z.string().optional(),
            subtitle: z.string().optional(),
            content: z.record(z.string(), z.unknown()),  // Permissivo per flessibilità
            visible: z.boolean().default(true),
        }).loose() // Permette campi extra, ma non rimuove quelli definiti
    ),
    seo: z.object({
        metaTitle: z.string(),
        metaDescription: z.string(),
        keywords: z.array(z.string()),
        schemaType: z.string().default('LocalBusiness'),
    }),
    theme: z
        .object({
            // 🎨 Colors nidificati
            colors: z.object({
                primary: z.string().default("#2563EB"),
                primaryForeground: z.string().default("#FFFFFF"),
                accent: z.string().default("#F59E0B"),
                accentForeground: z.string().default("#1A1A1A"),
                background: z.string().default("#FFFFFF"),
                foreground: z.string().default("#111827"),
                muted: z.string().default("#F3F4F6"),
                mutedForeground: z.string().default("#6B7280"),
                border: z.string().default("#E5E7EB"),
            }),

            // 🔤 Fonts nidificati
            fonts: z.object({
                heading: z.string().default("Inter, sans-serif"),
                body: z.string().default("Inter, sans-serif"),
                mono: z.string().optional(),
            }),

            // 📐 Layout opzionale
            layout: z.object({
                containerWidth: z.enum(["sm", "md", "lg", "xl", "full"]).default("lg"),
                borderRadius: z.enum(["none", "sm", "md", "lg", "full"]).default("md"),
                sectionPadding: z.enum(["tight", "normal", "loose"]).default("normal"),
            }).optional(),
        })
        .default({  // ✅ Default per l'intero oggetto theme
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

export type SiteConfig =
    Omit<ParsedSiteConfig, 'sections'> & {
        sections: Section[];
    };

// ============================================================================
// 🔄 Tipo unificato per il merge (evita conflitti TemplateConfig vs SiteConfig)
// ============================================================================

export type MergedSiteData = SiteConfig & {
    // Campi aggiuntivi da TemplateConfig che vogliamo esporre
    templateVersion?: string;
    defaultSections?: Array<{ type: string; visible: boolean; order: number }>;
    integrations?: {
        domain?: string;
        analytics?: {
            googleAnalyticsId?: string;
            facebookPixelId?: string;
        };
    }
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
        console.error(`❌ Config not found: ${configPath}`)
        return null
    }


    try {
        // 1. Leggi e valida config cliente
        const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const config = siteConfigSchema.parse(raw)

        //DEBUG: Verifica che l'ID del template sia presente e corretto
        // console.log('🔍 Debug template loading:', {
        //     templateIdFromConfig: config.meta.templateId,
        //     availableTemplates: Object.keys(templates),
        //     loaderFunction: templates[config.meta.templateId as TemplateId],
        // });

        // const loader = templates[config.meta.templateId as TemplateId];

        // if (!loader) {
        //     console.error('❌ No loader found for:', config.meta.templateId);
        //     throw new Error(`Template "${config.meta.templateId}" not found. Available: ${Object.keys(templates).join(', ')}`);
        // }

        const typedSections: Section[] = config.sections.map((section) => {
            if (!isValidSectionType(section.type)) {
                throw new Error(
                    `Invalid section type "${section.type}" in site "${slug}"`
                );
            }

            return {
                ...section,
                type: section.type,
            } as Section;
        });

        // 2. Carica template: templates[...]() → Promise<{ default: TemplateConfig }>
        const templateModule = await templates[config.meta.templateId as TemplateId]?.();
        if (!templateModule) {
            throw new Error(`Template "${config.meta.templateId}" not found for site "${slug}"`);
        }

        // ✅ FIX 1: Estrai l'export default dal modulo
        const templateConfig: TemplateConfig = templateModule.default;

        // ✅ FIX 2: Merge esplicito e type-safe (no spread generico)
        const merged: MergedSiteData = {
            ...config,

            sections: typedSections,

            templateVersion: templateConfig.version,

            defaultSections: templateConfig.defaultSections,

            theme: {
                // 🎨 Merge colors: config cliente override template
                colors: {
                    primary: config.theme?.colors?.primary ?? templateConfig.theme?.colors?.primary ?? "#2563EB",
                    primaryForeground: config.theme?.colors?.primaryForeground ?? templateConfig.theme?.colors?.primaryForeground ?? "#FFFFFF",
                    accent: config.theme?.colors?.accent ?? templateConfig.theme?.colors?.accent ?? "#F59E0B",
                    accentForeground: config.theme?.colors?.accentForeground ?? templateConfig.theme?.colors?.accentForeground ?? "#1A1A1A",
                    background: config.theme?.colors?.background ?? templateConfig.theme?.colors?.background ?? "#FFFFFF",
                    foreground: config.theme?.colors?.foreground ?? templateConfig.theme?.colors?.foreground ?? "#111827",
                    muted: config.theme?.colors?.muted ?? templateConfig.theme?.colors?.muted ?? "#F3F4F6",
                    mutedForeground: config.theme?.colors?.mutedForeground ?? templateConfig.theme?.colors?.mutedForeground ?? "#6B7280",
                    border: config.theme?.colors?.border ?? templateConfig.theme?.colors?.border ?? "#E5E7EB",
                },

                // 🔤 Merge fonts: config cliente override template
                fonts: {
                    heading: config.theme?.fonts?.heading ?? templateConfig.theme?.fonts?.heading ?? "Inter, sans-serif",
                    body: config.theme?.fonts?.body ?? templateConfig.theme?.fonts?.body ?? "Inter, sans-serif",
                    mono: config.theme?.fonts?.mono ?? templateConfig.theme?.fonts?.mono,
                },

                // 📐 Layout (se presente)
                layout: {
                    containerWidth: config.theme?.layout?.containerWidth ?? templateConfig.theme?.layout?.containerWidth ?? "lg",
                    borderRadius: config.theme?.layout?.borderRadius ?? templateConfig.theme?.layout?.borderRadius ?? "md",
                    sectionPadding: config.theme?.layout?.sectionPadding ?? templateConfig.theme?.layout?.sectionPadding ?? "normal",
                },
            }
        };

        return merged;

    } catch (error) {
        console.error(`❌ Error loading site "${slug}":`, error);
        return null;
    }
}