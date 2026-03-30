import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { dbDefault } from '@/lib/firebase/admin'
import {
  getTrackedArticlePageBySlug,
  getTrackedPublicPage,
  PUBLIC_PAGE_VIEWS_COLLECTION,
} from '@/lib/analytics/publicPageTracking'

type PageViewPayload = {
  path?: unknown
  slug?: unknown
}

const REQUEST_DEDUPE_WINDOW_MS = 30_000
const requestDedupeStore = new Map<string, number>()

function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false
  const ua = userAgent.toLowerCase()
  return (
    ua.includes('bot') ||
    ua.includes('spider') ||
    ua.includes('crawler') ||
    ua.includes('preview') ||
    ua.includes('headless')
  )
}

function isPrefetchRequest(request: NextRequest): boolean {
  const purpose = request.headers.get('purpose')
  const secPurpose = request.headers.get('sec-purpose')
  const nextPrefetch = request.headers.get('next-router-prefetch')
  return (
    purpose === 'prefetch' ||
    secPurpose === 'prefetch' ||
    nextPrefetch === '1'
  )
}

function jsonNoStore(payload: unknown, status = 200): NextResponse {
  return NextResponse.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for') || ''
  const firstIp = forwardedFor.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip') || ''
  return firstIp || realIp || 'unknown'
}

function stripPort(host: string): string {
  return host.split(':')[0]?.trim().toLowerCase() || ''
}

function getRequestHost(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  if (forwardedHost) return stripPort(forwardedHost.split(',')[0] || '')

  const hostHeader = request.headers.get('host')
  if (hostHeader) return stripPort(hostHeader)

  try {
    return stripPort(new URL(request.url).hostname)
  } catch {
    return ''
  }
}

function isProductionHost(request: NextRequest): boolean {
  if (process.env.NODE_ENV === 'test') return true

  const envHosts = (process.env.PAGE_VIEW_ALLOWED_HOSTS || '')
    .split(',')
    .map((value) => stripPort(value))
    .filter(Boolean)

  const configuredHost = (() => {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      if (!siteUrl) return null
      return stripPort(new URL(siteUrl).hostname)
    } catch {
      return null
    }
  })()

  const allowedHosts = new Set<string>([
    'staituned.com',
    'www.staituned.com',
  ])

  if (configuredHost) {
    allowedHosts.add(configuredHost)
  }
  envHosts.forEach((host) => allowedHosts.add(host))

  return allowedHosts.has(getRequestHost(request))
}

function shouldSkipByDedupe(dedupeKey: string): boolean {
  const now = Date.now()
  const lastSeen = requestDedupeStore.get(dedupeKey)
  if (typeof lastSeen === 'number' && now - lastSeen < REQUEST_DEDUPE_WINDOW_MS) {
    return true
  }

  requestDedupeStore.set(dedupeKey, now)

  if (requestDedupeStore.size > 5_000) {
    for (const [key, timestamp] of Array.from(requestDedupeStore.entries())) {
      if (now - timestamp > REQUEST_DEDUPE_WINDOW_MS) {
        requestDedupeStore.delete(key)
      }
    }
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    if (!isProductionHost(request)) {
      return jsonNoStore({ ok: true, skipped: 'non_production_origin' }, 202)
    }

    if (isPrefetchRequest(request) || isBotUserAgent(request.headers.get('user-agent'))) {
      return jsonNoStore({ ok: true, skipped: 'prefetch_or_bot' }, 202)
    }

    const body = (await request.json()) as PageViewPayload
    const descriptor =
      typeof body.path === 'string' && body.path.trim()
        ? getTrackedPublicPage(body.path)
        : typeof body.slug === 'string' && body.slug.trim()
          ? getTrackedArticlePageBySlug(body.slug)
          : null

    if (!descriptor) {
      return jsonNoStore({ ok: true, skipped: 'unknown_or_untracked_page' }, 202)
    }

    const dedupeKey = `${getClientIp(request)}::${descriptor.key}`
    if (shouldSkipByDedupe(dedupeKey)) {
      return jsonNoStore({ ok: true, skipped: 'deduped' }, 202)
    }

    if (descriptor.articleSlug) {
      await dbDefault()
        .collection('articles')
        .doc(descriptor.articleSlug)
        .set(
          {
            originalSlug: descriptor.articleSlug,
            pageViewsFirstParty: FieldValue.increment(1),
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        )
    } else {
      await dbDefault()
        .collection(PUBLIC_PAGE_VIEWS_COLLECTION)
        .doc(descriptor.docId)
        .set(
          {
            path: descriptor.path,
            title: descriptor.title,
            pageType: descriptor.pageType,
            author: descriptor.author,
            language: descriptor.language,
            target: descriptor.target,
            pageViewsFirstParty: FieldValue.increment(1),
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        )
    }

    return jsonNoStore({ ok: true })
  } catch (error) {
    console.error('First-party page-view tracking error:', error)
    return jsonNoStore({ error: 'Failed to track page view' }, 500)
  }
}
