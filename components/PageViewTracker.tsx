'use client'

import { useEffect } from 'react'
import { pageview } from '@/lib/gtag'
import { ClientOnly } from '@/components/SafeNavigation'

export function PageViewTracker() {
  useEffect(() => {
    // Only track on client-side with native pathname
    if (typeof window !== 'undefined') {
      const url = window.location.pathname + window.location.search
      pageview(url)
    }
  }, [])

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
