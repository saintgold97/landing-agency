// src/proxy.ts (nella root di src/, NON dentro app/)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// ✅ Import statico JSON (funziona con Edge Runtime se resolveJsonModule è attivo)
import siteIndex from '@/lib/data/site-index.json';

type SiteIndexEntry = {
    domains: string[];
    template: string;
    version: string;
    assetsPath: string;
};

export function proxy(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const pathname = request.nextUrl.pathname;

    // === DEVELOPMENT: Permetti accesso diretto via /[slug] per testing ===
    if (process.env.NODE_ENV === 'development') {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length === 1 && siteIndex[parts[0] as keyof typeof siteIndex]) {
            return NextResponse.next();
        }
    }

    // === PRODUCTION: Match dominio → slug ===
    const siteSlug = Object.keys(siteIndex).find((slug) => {
        const entry = siteIndex[slug as keyof typeof siteIndex] as SiteIndexEntry | undefined;
        const domains = entry?.domains || [];
        return domains.includes(hostname) || hostname.startsWith(`${slug}.`);
    });

    // Se nessun dominio corrisponde → homepage agenzia
    if (!siteSlug) {
        if (pathname === '/' || pathname === '') return NextResponse.next();
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // === Rewriting interno ===
    const url = request.nextUrl.clone();

    // Evita rewrite se già nel path corretto (previene loop)
    const expectedPath = `/${siteSlug}${pathname === '/' ? '' : pathname}`;
    if (url.pathname === expectedPath) {
        return NextResponse.next();
    }

    url.pathname = expectedPath;

    const response = NextResponse.rewrite(url);
    response.headers.set('x-site-slug', siteSlug);
    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)'],
};