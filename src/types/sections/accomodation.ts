import { CTAButton, ImageInterface } from "./shared";

export interface AccommodationSectionContentMap {
    about: {
        title: string;
        subtitle: string;
        description: string;
        image: ImageInterface;
        features: Array<{
            title: string;
            description?: string;
            icon?: string;
            image?: ImageInterface;
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
            image: ImageInterface;
            price: string;
            amenities: string[];
            capacity: string;
        }>;
    };

    services: {
        title: string;
        subtitle: string;
        description: string;
        image?: ImageInterface;
        services: Array<{ name: string; duration: string; price: string, iconName: string }>;
    };

    experiences: {
        id: string;
        title: string;
        subtitle: string;
        showDescriptions: boolean;
        layout: 'grid' | 'carousel';
        backgroundImage?: ImageInterface;
        cit?: {
            text: string;
            author: string;
        }
        items: Array<{
            id: string;
            title: string;
            description: string;
            image: ImageInterface;
            link?: string;
        }>;
    };

    location: {
        title: string;
        subtitle: string;
        description: string;
        address: string;
        coordinates?: { lat: number; lng: number };
        mapEmbed?: string;
        directionsLink?:  string;
        nearbyAttractions?: {
            name: string;
            distance: string;
        }[]
    };

    contact: {
        description?: string;
        fields: Array<{
            id: string;
            label: string;
            type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date';
            required?: boolean;
            options?: Array<{ label: string; value: string }>;
            placeholder?: string;
        }>;
        submitText: string;
        successMessage?: string;
        contactInfo?: {
            email: string;
            phone: string;
            address: string;
            socialLinks?: Array<{ platform: string; url: string }>;
        };
        benefits?: string[];
    };

    cta: {
        title: string;
        subtitle: string;
        description?: string;
        primaryButton: CTAButton;
        secondaryButton?: CTAButton;
        backgroundImage?: ImageInterface;
        overlay?: boolean;
    };
}

export type AccommodationSectionType = keyof AccommodationSectionContentMap;