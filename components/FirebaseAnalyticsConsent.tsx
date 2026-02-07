'use client'

import { useEffect } from 'react'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'

export function FirebaseAnalyticsConsent() {
  const { hasConsentedToAnalytics } = useCookieConsent()

  useEffect(() => {
    const updateAnalytics = async () => {
      const { setFirebaseAnalyticsEnabled } = await import('@/lib/firebase/client')
      void setFirebaseAnalyticsEnabled(hasConsentedToAnalytics)
    }
    updateAnalytics()
  }, [hasConsentedToAnalytics])

  return null
}

