'use client'

import { useEffect } from 'react'
import { pageview } from '@/lib/gtag'
import { ClientOnly } from '@/components/SafeNavigation'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'

export function PageViewTracker() {
  const { hasConsentedToAnalytics } = useCookieConsent()

  useEffect(() => {
    if (!hasConsentedToAnalytics) {
      return
    }

    if (typeof window !== 'undefined') {
      const url = window.location.pathname + window.location.search
      pageview(url)
    }
  }, [hasConsentedToAnalytics])

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
