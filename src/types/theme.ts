// src/types/theme.ts

/**
 * 🎨 Theme Configuration - Sistema di styling dinamico
 * Definizione CENTRALE usata da template, loader e componenti
 */
export interface ThemeConfig {
    // 🎨 Colors (obbligatori per coerenza brand)
    colors: {
        primary: string;                    // Colore principale (es. "#2563EB")
        primaryForeground?: string;         // Testo su primary (default: "#FFFFFF")
        accent?: string;                    // Colore secondario per highlight
        accentForeground?: string;          // Testo su accent
        background: string;                 // Sfondo pagina (default: "#FFFFFF")
        foreground: string;                 // Testo principale (default: "#111827")
        muted?: string;                     // Sfondo sezioni secondarie
        mutedForeground?: string;           // Testo secondario
        border?: string;                    // Colore bordi (default: "#E5E7EB")
        [key: string]: unknown;             // Permette estensioni
    };

    // 🔤 Fonts
    fonts: {
        heading: string;                    // Font titoli (es. "Playfair Display, serif")
        body: string;                       // Font corpo testo (es. "Inter, sans-serif")
        mono?: string;                      // Font monospaziato opzionale
        [key: string]: unknown;
    };

    // 📐 Layout (opzionale)
    layout?: {
        containerWidth?: "sm" | "md" | "lg" | "xl" | "full";
        borderRadius?: "none" | "sm" | "md" | "lg" | "full";
        sectionPadding?: "tight" | "normal" | "loose";
        [key: string]: unknown;
    };

    // 🧩 Componenti (opzionale)
    components?: {
        button?: {
            variant?: "solid" | "outline" | "ghost";
            borderRadius?: "none" | "sm" | "md" | "lg" | "full";
        };
        card?: {
            shadow?: "none" | "sm" | "md" | "lg";
            border?: boolean;
        };
        [key: string]: unknown;
    };
}

/**
 * Helper per estrarre colori con fallback sicuri
 */
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

/**
 * Helper per estrarre fonts con fallback sicuri
 */
export function getThemeFonts(theme?: Partial<ThemeConfig>) {
    return {
        heading: theme?.fonts?.heading ?? "Inter, sans-serif",
        body: theme?.fonts?.body ?? "Inter, sans-serif",
        mono: theme?.fonts?.mono,
    };
}