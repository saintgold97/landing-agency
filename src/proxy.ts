import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import siteIndex from '@/lib/data/site-index.json';

type SiteIndexEntry = {
    domains: string[];
    template: string;
    version: string;
    assetsPath: string;
};

const normalize = (h: string) =>
    h.replace(/^www\./, '').toLowerCase().split(':')[0];

export function proxy(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const pathname = request.nextUrl.pathname;

    const cleanHost = normalize(hostname);

    // DEV bypass
    if (process.env.NODE_ENV === 'development') {
        const first = pathname.split('/')[1];

        if (first && siteIndex[first as keyof typeof siteIndex]) {
            return NextResponse.next();
        }
    }

    // match site
    const siteSlug = Object.keys(siteIndex).find((slug) => {
        const entry = siteIndex[slug as keyof typeof siteIndex] as SiteIndexEntry;

        return (
            entry.domains.some(d => normalize(d) === cleanHost) ||
            cleanHost.startsWith(`${slug}.`)
        );
    });

    if (!siteSlug) {
        return pathname === '/'
            ? NextResponse.next()
            : process.env.NODE_ENV === 'production'
                ? NextResponse.redirect(new URL('/', request.url))
                : NextResponse.next();
    }

    const expectedPath =
        pathname === '/' ? `/${siteSlug}` : `/${siteSlug}${pathname}`;

    const url = request.nextUrl.clone();

    if (url.pathname === expectedPath) {
        return NextResponse.next();
    }

    url.pathname = expectedPath;

    const res = NextResponse.rewrite(url);
    res.headers.set('x-site-slug', siteSlug);

    return res;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)'],
};