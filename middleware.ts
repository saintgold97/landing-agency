// src/proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import siteIndex from '@/lib/data/site-index.json';

export type SiteIndexEntry = {
    domains: string[];
    template: string;
    version: string;
    assetsPath: string;
    locale: string;
};

const normalize = (host: string) =>
    host.replace(/^www\./, '').split(':')[0].toLowerCase();

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const pathname = request.nextUrl.pathname;

    const cleanHost = normalize(hostname);

    const siteSlug = Object.keys(siteIndex).find((slug) => {
        const entry = siteIndex[slug as keyof typeof siteIndex] as SiteIndexEntry;
        return entry.domains.some((domain) => normalize(domain) === cleanHost);
    });

    const url = request.nextUrl.clone();

    // 1. CUSTOM DOMAIN
    if (siteSlug) {
        // 🛑 GUARDIA FONDAMENTALE: Se il path è già stato riscritto internamente, 
        // non applicare nuovamente la riscrittura per evitare loop (/slug/slug)
        if (pathname === `/${siteSlug}` || pathname.startsWith(`/${siteSlug}/`)) {
            return NextResponse.next();
        }

        url.pathname = pathname === '/'
            ? `/${siteSlug}`
            : `/${siteSlug}${pathname}`;

        return NextResponse.rewrite(url);
    }

    // 2. VERCEL PREVIEW / SLUG MODE (Es: localhost:3000/hotel-luxury o vercel.app/hotel-luxury)
    const slug = pathname.split('/')[1];

    if (slug && siteIndex[slug as keyof typeof siteIndex]) {
        return NextResponse.next();
    }

    // Permette l'accesso alla root "/" su Vercel dove mostrerai l'indice dei siti
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|favicon.ico).*)'],
};