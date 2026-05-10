// src/components/sections/types.ts

export interface CTAButton {
    text: string
    link: string
    target?: '_self' | '_blank'
}

/**
 * ============================================================================
 * 📦 Section Content Map
 * ============================================================================
 *
 * Mappa ogni SectionType al tipo specifico del suo contenuto.
 * Questo è il cuore del sistema di type-safety.
 */

export interface SectionContentMap {
    navigation: {
        siteName: string;
        logo?: string;
        linkLogo?: string;
        links: Array<{ label: string; href: string }>;
        cta?: {
            text: string;
            href: string;
            variant?: 'primary' | 'secondary';
        };
    };

    heroCinematicScroll: {
        title: string
        subtitle?: string
        framesPath: string
        fallbackImage: string
        totalFrames?: number
        mobileFrames?: number
        ctaPrimary?: CTAButton
        ctaSecondary?: CTAButton
    };

    about: {
        title: string;
        subtitle: string;
        description: string;
        image: string;
        features: Array<{
            title: string;
            description: string;
            icon?: string;
        }>;
    };

    rooms: {
        title: string;
        subtitle: string;
        showPrices: boolean;
        showAmenities: boolean;
        layout: 'grid' | 'list';
        items: Array<{
            id: string;
            name: string;
            description: string;
            image: string;
            price: string;
            amenities: string[];
            capacity: string;
        }>;
    };

    spa: {
        title: string;
        subtitle: string;
        description: string;
        image: string;
        services: Array<{
            name: string;
            duration: string;
            price: string;
        }>;
    };

    experiences: {
        id: string;
        title: string;
        subtitle: string;
        showDescriptions: boolean;
        layout: 'grid' | 'carousel';
        items: Array<{
            id: string;
            title: string;
            description: string;
            image: string;
            link?: string;
        }>;
    };

    gallery: {
        images: Array<{
            id?: string;
            src: string;
            alt: string;
            category?: string;
        }>;
        layout?: 'grid' | 'carousel';
    };

    testimonials: {
        items: Array<{
            name: string;
            location?: string;
            review: string;
            rating: number;
            image?: string;
        }>;
    };

    location: {
        title: string;
        description: string;
        address: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
        mapEmbed?: string;
    };

    cta: {
        title: string;
        subtitle: string;
        primaryButton: {
            text: string;
            link: string;
            variant?: 'primary' | 'secondary' | 'outline';
        };
        secondaryButton?: {
            text: string;
            link: string;
            variant?: 'primary' | 'secondary' | 'outline';
        };
        backgroundImage?: string;
        overlay?: boolean;
    };

    contact: {
        description?: string;

        fields: Array<{
            id: string;
            label: string;
            type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date';
            required?: boolean;
            options?: Array<{
                label: string;
                value: string;
            }>;
            placeholder?: string;
        }>;

        submitText: string;
        successMessage?: string;

        contactInfo?: {
            email: string;
            phone: string;
            address: string;

            socialLinks?: Array<{
                platform: string;
                url: string;
            }>;
        };

        benefits?: string[];
    };

    footer: {
        description: string;

        quickLinks: Array<{
            label: string;
            href: string;
        }>;

        legalLinks: Array<{
            label: string;
            href: string;
        }>;

        socialLinks: Array<{
            platform: string;
            url: string;
        }>;

        copyright?: string;
        contact: {
            email: string
            phone: string
            address: string

        }
    };
}

/**
 * ============================================================================
 * 🏷️ Section Type
 * ============================================================================
 */

export type SectionType = keyof SectionContentMap;

/**
 * ============================================================================
 * 📦 Generic Section Type
 * ============================================================================
 *
 * Crea la correlazione reale:
 * type -> content corretto
 */

export type Section<K extends SectionType = SectionType> = {
    id: string;
    type: K;

    title?: string;
    subtitle?: string;

    visible: boolean;

    content: SectionContentMap[K];
};