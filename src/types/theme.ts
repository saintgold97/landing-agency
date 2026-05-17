// ============================================================================
// 🎨 THEME CORE (SOURCE OF TRUTH)
// ============================================================================

export const THEME_LAYOUT_WIDTHS = [
    "sm",
    "md",
    "lg",
    "xl",
    "full",
] as const;

export const THEME_BORDER_RADIUS = [
    "none",
    "sm",
    "md",
    "lg",
    "full",
] as const;

export const THEME_SECTION_PADDING = [
    "tight",
    "normal",
    "loose",
] as const;

// ============================================================================
// 🎨 ThemeConfig (TEMPLATE - FULL STRICT)
// ============================================================================

export interface ThemeConfig {
    colors: {
        primary: string;
        primaryForeground: string;
        accent: string;
        accentForeground: string;
        background: string;
        foreground: string;
        muted: string;
        mutedForeground: string;
        border: string;
    };

    fonts: {
        heading: string;
        body: string;
        mono: string;
    };

    layout: {
        containerWidth: typeof THEME_LAYOUT_WIDTHS[number];
        borderRadius: typeof THEME_BORDER_RADIUS[number];
        sectionPadding: typeof THEME_SECTION_PADDING[number];
    };
}

// ============================================================================
// 🎨 ClientThemeConfig (PARTIAL SAFE OVERRIDE)
// ============================================================================

export type ClientThemeConfig = {
    colors?: Partial<ThemeConfig["colors"]>;
    fonts?: Partial<ThemeConfig["fonts"]>;
    layout?: Partial<ThemeConfig["layout"]>;
};

// ============================================================================
// 🎨 ResolvedThemeConfig (OUTPUT GUARANTEED)
// ============================================================================

export type ResolvedThemeConfig = ThemeConfig;

// ============================================================================
// 🔧 SAFE MERGE (NO DRIFT)
// ============================================================================

export function resolveThemeConfig(
    client: ClientThemeConfig | undefined,
    template: ThemeConfig
): ResolvedThemeConfig {
    return {
        colors: {
            primary: client?.colors?.primary ?? template.colors.primary,
            primaryForeground:
                client?.colors?.primaryForeground ??
                template.colors.primaryForeground,
            accent: client?.colors?.accent ?? template.colors.accent,
            accentForeground:
                client?.colors?.accentForeground ??
                template.colors.accentForeground,
            background: client?.colors?.background ?? template.colors.background,
            foreground: client?.colors?.foreground ?? template.colors.foreground,
            muted: client?.colors?.muted ?? template.colors.muted,
            mutedForeground:
                client?.colors?.mutedForeground ??
                template.colors.mutedForeground,
            border: client?.colors?.border ?? template.colors.border,
        },

        fonts: {
            heading: client?.fonts?.heading ?? template.fonts.heading,
            body: client?.fonts?.body ?? template.fonts.body,
            mono: client?.fonts?.mono ?? template.fonts.mono,
        },

        layout: {
            containerWidth:
                client?.layout?.containerWidth ??
                template.layout.containerWidth,

            borderRadius:
                client?.layout?.borderRadius ??
                template.layout.borderRadius,

            sectionPadding:
                client?.layout?.sectionPadding ??
                template.layout.sectionPadding,
        },
    };
}

// ============================================================================
// 🎯 SAFE HELPERS (OPTIONAL UI USE)
// ============================================================================

export function getThemeColors(theme: ThemeConfig) {
    return theme.colors;
}

export function getThemeFonts(theme: ThemeConfig) {
    return theme.fonts;
}

export function getThemeLayout(theme: ThemeConfig) {
    return theme.layout;
}