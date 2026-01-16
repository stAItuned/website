'use client'

import { useEffect } from 'react'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'
import { setFirebaseAnalyticsEnabled } from '@/lib/firebase/client'

export function FirebaseAnalyticsConsent() {
  const { hasConsentedToAnalytics } = useCookieConsent()

  useEffect(() => {
    void setFirebaseAnalyticsEnabled(hasConsentedToAnalytics)
  }, [hasConsentedToAnalytics])

  return null
}

