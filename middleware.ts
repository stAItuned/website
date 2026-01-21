/**
 * Next.js Middleware
 * 
 * SEO Fix: Redirects URLs with internal RSC parameters (?_rsc=...) to clean URLs
 * to prevent duplicate content indexing by search engines.
 * 
 * The _rsc parameter is used internally by Next.js for React Server Components
 * streaming, but should never be indexed by search engines.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Internal Next.js parameters that should trigger a redirect to clean URL
 * These are used for RSC streaming and prefetching, and should never be indexed
 * 
 * Note: In dev mode, Next.js may intercept _rsc requests before they reach
 * this middleware. The X-Robots-Tag header in next.config.js serves as fallback.
 * In production, this redirect will work correctly for search engine crawlers.
 */
const INTERNAL_PARAMS_TO_STRIP = [
    '_rsc',           // React Server Components streaming
    '_rsc_d',         // RSC data param
]

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()

    // Skip internal Next.js requests (prefetch, RSC internal calls)
    // These have special headers that indicate they're not direct page visits
    const isRSCRequest = request.headers.get('rsc') === '1'
    const isPrefetch = request.headers.get('next-router-prefetch') === '1'

    // Only redirect actual page visits from crawlers/users, not internal RSC calls
    if (isRSCRequest || isPrefetch) {
        return NextResponse.next()
    }

    // Check if any internal parameters are present in non-RSC requests
    let hasInternalParams = false
    for (const param of INTERNAL_PARAMS_TO_STRIP) {
        if (url.searchParams.has(param)) {
            url.searchParams.delete(param)
            hasInternalParams = true
        }
    }

    // If internal params were found, redirect to clean URL
    if (hasInternalParams) {
        // Use 308 Permanent Redirect (preserves HTTP method, signals permanence to crawlers)
        return NextResponse.redirect(url, 308)
    }

    return NextResponse.next()
}

/**
 * Matcher configuration:
 * - Run on all pages except static files and API routes
 * - This prevents unnecessary middleware execution on assets
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, icon.svg (browser icons)
         * - assets folder (static assets)
         * - content folder (MDX content)
         * - *.webp, *.png, *.jpg, *.jpeg, *.gif, *.svg (image files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|assets|content|.*\\.webp$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
    ],
}
