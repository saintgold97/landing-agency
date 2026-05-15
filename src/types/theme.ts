// src/types/theme.ts
// ============================================================================
// 🎨 ThemeConfig - PER I TEMPLATE (tutti i campi OBBLIGATORI)
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
        [key: string]: unknown;
    };
    fonts: {
        heading: string;
        body: string;
        mono: string;
        [key: string]: unknown;
    };
    layout: {
        containerWidth: "sm" | "md" | "lg" | "xl" | "full";
        borderRadius: "none" | "sm" | "md" | "lg" | "full";
        sectionPadding: "tight" | "normal" | "loose";
        [key: string]: unknown;
    };
}

// ============================================================================
// 🎨 ClientThemeConfig - PER IL CLIENT (tutti i campi OPZIONALI)
// ============================================================================
export type ClientThemeConfig = {
    colors?: Partial<ThemeConfig["colors"]>;
    fonts?: Partial<ThemeConfig["fonts"]>;
    layout?: Partial<ThemeConfig["layout"]>;
};

// ============================================================================
// 🎨 ResolvedThemeConfig - OUTPUT GARANTITO (alias di ThemeConfig)
// ============================================================================
export type ResolvedThemeConfig = ThemeConfig;

// ============================================================================
// 🔧 Merge function type-safe
// ============================================================================
export function resolveThemeConfig(
    clientTheme: ClientThemeConfig | undefined,
    templateTheme: ThemeConfig
): ResolvedThemeConfig {
    return {
        colors: {
            primary: clientTheme?.colors?.primary ?? templateTheme.colors.primary,
            primaryForeground: clientTheme?.colors?.primaryForeground ?? templateTheme.colors.primaryForeground,
            accent: clientTheme?.colors?.accent ?? templateTheme.colors.accent,
            accentForeground: clientTheme?.colors?.accentForeground ?? templateTheme.colors.accentForeground,
            background: clientTheme?.colors?.background ?? templateTheme.colors.background,
            foreground: clientTheme?.colors?.foreground ?? templateTheme.colors.foreground,
            muted: clientTheme?.colors?.muted ?? templateTheme.colors.muted,
            mutedForeground: clientTheme?.colors?.mutedForeground ?? templateTheme.colors.mutedForeground,
            border: clientTheme?.colors?.border ?? templateTheme.colors.border,
        },
        fonts: {
            heading: clientTheme?.fonts?.heading ?? templateTheme.fonts.heading,
            body: clientTheme?.fonts?.body ?? templateTheme.fonts.body,
            mono: clientTheme?.fonts?.mono ?? templateTheme.fonts.mono,
        },
        layout: {
            containerWidth: clientTheme?.layout?.containerWidth ?? templateTheme.layout?.containerWidth,
            borderRadius: clientTheme?.layout?.borderRadius ?? templateTheme.layout?.borderRadius,
            sectionPadding: clientTheme?.layout?.sectionPadding ?? templateTheme.layout?.sectionPadding,
        },
    };
}

// ============================================================================
// 🧰 Helpers per componenti (opzionali)
// ============================================================================
export function getThemeColors(theme?: Partial<ThemeConfig>) {
    return {
        primary: theme?.colors?.primary ?? "#2563EB",
        primaryForeground: theme?.colors?.primaryForeground ?? "#FFFFFF",
        accent: theme?.colors?.accent ?? "#F59E0B",
        accentForeground: theme?.colors?.accentForeground ?? "#1A1A1A",
        background: theme?.colors?.background ?? "#FFFFFF",
        foreground: theme?.colors?.foreground ?? "#111827",
        muted: theme?.colors?.muted ?? "#F3F4F6",
        mutedForeground: theme?.colors?.mutedForeground ?? "#6B7280",
        border: theme?.colors?.border ?? "#E5E7EB",
    };
}

export function getThemeFonts(theme?: Partial<ThemeConfig>) {
    return {
        heading: theme?.fonts?.heading ?? "Inter, sans-serif",
        body: theme?.fonts?.body ?? "Inter, sans-serif",
        mono: theme?.fonts?.mono,
    };
}