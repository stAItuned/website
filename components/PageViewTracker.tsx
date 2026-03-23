'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/lib/gtag'
import { ClientOnly } from '@/components/SafeNavigation'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'

function extractLearnArticleSlug(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length < 3) return null
  if (parts[0] !== 'learn') return null
  return parts[2] || null
}

function isProductionHost(hostname: string): boolean {
  const normalizedHost = hostname.trim().toLowerCase()
  if (!normalizedHost) return false

  const envHosts = (process.env.PAGE_VIEW_ALLOWED_HOSTS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  const configuredHost = (() => {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      if (!siteUrl) return null
      return new URL(siteUrl).hostname.toLowerCase()
    } catch {
      return null
    }
  })()

  const allowedHosts = new Set<string>([
    'staituned.com',
    'www.staituned.com',
  ])

  if (configuredHost) allowedHosts.add(configuredHost)
  envHosts.forEach((host) => allowedHosts.add(host))
  return allowedHosts.has(normalizedHost)
}

function sendFirstPartyPageView(payload: { slug: string }) {
  const body = JSON.stringify(payload)
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' })
    const sent = navigator.sendBeacon('/api/analytics/page-view', blob)
    if (sent) return
  }

  void fetch('/api/analytics/page-view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
    cache: 'no-store',
  }).catch(() => {
    // Silent failure: tracking should never break navigation.
  })
}

export function PageViewTracker() {
  const { hasConsentedToAnalytics } = useCookieConsent()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const gaLastUrlRef = useRef<string | null>(null)
  const firstPartyLastPathRef = useRef<string | null>(null)
  const searchParamsString = searchParams?.toString() ?? ''

  useEffect(() => {
    if (!pathname) return

    const slug = extractLearnArticleSlug(pathname)
    if (!slug) return
    if (typeof window === 'undefined') return
    if (!isProductionHost(window.location.hostname)) return
    if (firstPartyLastPathRef.current === pathname) return

    firstPartyLastPathRef.current = pathname
    sendFirstPartyPageView({
      slug,
    })
  }, [pathname])

  useEffect(() => {
    if (!hasConsentedToAnalytics) {
      return
    }

    if (!pathname) return

    const url = searchParamsString ? `${pathname}?${searchParamsString}` : pathname
    if (gaLastUrlRef.current === url) return

    gaLastUrlRef.current = url
    pageview(url)
  }, [hasConsentedToAnalytics, pathname, searchParamsString])

  return null
}

// Wrap in ClientOnly to prevent SSG issues
export function SafePageViewTracker() {
  return (
    <ClientOnly>
      <PageViewTracker />
    </ClientOnly>
  )
}
