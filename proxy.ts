/**
 * Next.js Proxy
 *
 * SEO fix: redirects URLs with internal RSC parameters (?_rsc=...) to clean URLs
 * to prevent duplicate content indexing by search engines.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Internal Next.js parameters that should trigger a redirect to clean URL.
 * These are used for RSC streaming and prefetching, and should never be indexed.
 */
const INTERNAL_PARAMS_TO_STRIP = [
  '_rsc',
  '_rsc_d',
]

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Skip internal Next.js requests (prefetch, RSC internal calls).
  const isRSCRequest = request.headers.get('rsc') === '1'
  const isPrefetch = request.headers.get('next-router-prefetch') === '1'

  if (isRSCRequest || isPrefetch) {
    return NextResponse.next()
  }

  // Normalize accidental duplicated slashes in path (e.g. //preview/...)
  // to avoid browser interpreting them as protocol-relative URLs.
  const normalizedPathname = url.pathname.replace(/\/{2,}/g, '/')
  if (normalizedPathname !== url.pathname) {
    url.pathname = normalizedPathname
    return NextResponse.redirect(url, 308)
  }

  let hasInternalParams = false
  for (const param of INTERNAL_PARAMS_TO_STRIP) {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param)
      hasInternalParams = true
    }
  }

  if (hasInternalParams) {
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|assets|content|.*\\.webp$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
