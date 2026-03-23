import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { dbDefault } from '@/lib/firebase/admin'
import { sanitizeSlug } from '@/lib/sanitizeSlug'
import { allPosts } from '@/lib/contentlayer'

type PageViewPayload = {
  slug?: unknown
}

const REQUEST_DEDUPE_WINDOW_MS = 30_000
const requestDedupeStore = new Map<string, number>()

const VALID_ARTICLE_SLUGS = new Set(
  allPosts
    .filter((post) => post.published !== false)
    .map((post) => sanitizeSlug(String(post.slug || '').toLowerCase())),
)

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
    const rawSlug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : ''
    const sanitizedSlug = sanitizeSlug(rawSlug)

    if (!sanitizedSlug) {
      return jsonNoStore({ error: 'Invalid slug' }, 400)
    }

    if (!VALID_ARTICLE_SLUGS.has(sanitizedSlug)) {
      return jsonNoStore({ ok: true, skipped: 'unknown_slug' }, 202)
    }

    const dedupeKey = `${getClientIp(request)}::${sanitizedSlug}`
    if (shouldSkipByDedupe(dedupeKey)) {
      return jsonNoStore({ ok: true, skipped: 'deduped' }, 202)
    }

    await dbDefault()
      .collection('articles')
      .doc(sanitizedSlug)
      .set(
        {
          originalSlug: rawSlug,
          pageViewsFirstParty: FieldValue.increment(1),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )

    return jsonNoStore({ ok: true })
  } catch (error) {
    console.error('First-party page-view tracking error:', error)
    return jsonNoStore({ error: 'Failed to track page view' }, 500)
  }
}
