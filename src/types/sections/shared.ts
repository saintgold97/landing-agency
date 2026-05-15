export interface CTAButton {
    text: string;
    href: string;
    target?: '_self' | '_blank';
    variant?: 'primary' | 'secondary' | 'outline';
}

export interface ImageInterface {
    id?: string;
    src: string;
    alt: string;
    width?: number;
    height?: number;
    category?: string;
}

export interface SharedSectionContentMap {
    navigation: {
        siteName: string;
        logo?: string;
        linkLogo?: string;
        links: Array<{ label: string; href: string }>;
        cta?: CTAButton;
    };

    footer: {
        siteName: string
        description: string;
        quickLinks: Array<{ label: string; href: string }>;
        legalLinks: Array<{ label: string; href: string }>;
        socialLinks: Array<{ platform: string; url: string }>;
        copyright?: string;
        contact: { email: string; phone: string; address: string };
    };

    gallery: {
        title: string,
        subtitle: string,
        images: Array<ImageInterface>;
        layout?: 'grid' | 'carousel';
    };

    testimonials: {
        title: string,
        subtitle: string,
        showRating?: boolean,
        showLocation?: boolean,
        items: Array<{
            name: string;
            location?: string;
            review: string;
            rating?: number;
            image?: ImageInterface;
        }>;
    };

    heroCinematicScroll: {
        title: string;
        subtitle?: string;
        description?: string;
        framesPath?: string;
        fallbackImage: ImageInterface;
        scrollImage: ImageInterface;
        ctaPrimary?: CTAButton;
        ctaSecondary?: CTAButton;
        insideCopy?: {
            title: string;
            description?: string;
        };
        scrollCopy?: string;
        totalFrames?: number;
    };
}

export type SharedSectionType = keyof SharedSectionContentMap;