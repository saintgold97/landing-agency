import { z } from "zod";

// ============================================================================
// 🧠 META (versioning + template engine)
// ============================================================================
const metaSchema = z.object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    sector: z.string().min(1).max(50).default("general"),
    templateId: z.string().min(1).max(100),

    locale: z.string().default("it-IT"),

    lastUpdated: z.string().optional().transform((val) => {
        if (!val) return new Date().toISOString();

        const parsed = Date.parse(val);
        if (isNaN(parsed)) return new Date().toISOString();

        return new Date(parsed).toISOString();
    }),
});

// ============================================================================
// 🆔 IDENTITY (routing interno SaaS)
// ============================================================================
const identitySchema = z.object({
    slug: z.string().min(1).max(80),
});

// ============================================================================
// 🏢 BUSINESS
// ============================================================================
const businessSchema = z.object({
    name: z.string().min(1).max(200),
    tagline: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    logo: z.string().optional(),
    favicon: z.string().optional(),
    locale: z.string().default("it-IT").transform(v => v.slice(0, 5)),
});

// ============================================================================
// 📞 CONTACT
// ============================================================================
const contactSchema = z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    whatsapp: z.string().optional(),
    hours: z.string().optional(),

    socialLinks: z.array(
        z.object({
            platform: z.string(),
            url: z.url(),
        })
    ).optional(),
}).optional();

// ============================================================================
// 🌐 ROUTING (SAAS INFRA)
// ============================================================================
const domainsSchema = z.array(z.string()).default([]);

// ============================================================================
// 📦 ASSETS
// ============================================================================
const assetsSchema = z.object({
    path: z.string().min(1),
    cdn: z.string().url().optional(),
}).optional();

// ============================================================================
// 🔍 SEO (Next.js Metadata aligned)
// ============================================================================

export const seoSchema = z.object({
    title: z.string().min(1).max(60),

    description: z.string().min(1).max(160),

    keywords: z.array(z.string()).default([]),

    robots: z
        .object({
            index: z.boolean().default(true),
            follow: z.boolean().default(true),
        })
        .optional(),

    openGraph: z
        .object({
            title: z.string().optional(),
            description: z.string().optional(),
            type: z.enum(["website", "article", "profile"]).default("website"),
            locale: z.string().default("it_IT"),
            siteName: z.string().optional(),
            images: z
                .array(
                    z.object({
                        url: z.string(),
                        width: z.number().optional(),
                        height: z.number().optional(),
                        alt: z.string().optional(),
                    })
                )
                .optional(),
        })
        .optional(),

    twitter: z
        .object({
            card: z.enum([
                "summary",
                "summary_large_image",
                "app",
                "player",
            ]).default("summary_large_image"),
            images: z.array(z.string()).optional(),
        })
        .optional(),

    metadataBase: z.string().url().optional(),
});

// ============================================================================
// 🎨 THEME
// ============================================================================
const themeSchema = z.object({
    colors: z.object({
        primary: z.string().optional(),
        background: z.string().optional(),
        foreground: z.string().optional(),
        accent: z.string().optional(),
    }).optional(),
    fonts: z.object({
        heading: z.string().optional(),
        body: z.string().optional(),
        mono: z.string().optional(),
    }).optional(),
    layout: z.object({
        containerWidth: z.enum(['sm', 'md', 'lg', 'xl', 'full']).optional(),
        borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'full']).optional(),
        sectionPadding: z.enum(['tight', 'normal', 'loose']).optional(),
    }).optional(),
}).optional();

// ============================================================================
// 🔌 INTEGRATIONS (SAAS EXTENSIBLE LAYER)
// ============================================================================
const integrationsSchema = z.object({
    analytics: z.object({
        ga4Id: z.string().optional(),
        gtmId: z.string().optional(),
    }).optional(),

    privacy: z.object({
        cookiebotId: z.string().optional(),
    }).optional(),

    email: z.object({
        resendContactEmail: z.email().optional(),
    }).optional(),

    security: z.object({
        cloudflare: z.object({
            turnstileSiteKey: z.string().optional(),
            analyticsToken: z.string().optional(),
        }).optional(),
    }).optional(),
}).optional();

// ============================================================================
// 🧩 SECTIONS
// ============================================================================
const sectionSchema = z.object({
    id: z.string(),
    type: z.string(),

    title: z.string().optional(),
    subtitle: z.string().optional(),

    content: z.record(z.string(), z.unknown()),

    visible: z.boolean().optional(),
    order: z.number().optional(),
});

// ============================================================================
// 🧱 MAIN CONFIG
// ============================================================================
export const siteConfigSchema = z.object({
    meta: metaSchema,
    identity: identitySchema,

    business: businessSchema,
    contact: contactSchema,

    domains: domainsSchema,

    sections: z.array(sectionSchema).default([]),
    assets: assetsSchema,
    seo: seoSchema,
    theme: themeSchema,
    integrations: integrationsSchema,

});

// ============================================================================
// TYPES
// ============================================================================
export type SiteConfig = z.infer<typeof siteConfigSchema>;