'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { GA_MEASUREMENT_ID } from '@/lib/gtag'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'

export function GoogleAnalytics() {
  const { hasConsentedToAnalytics } = useCookieConsent()
  // TEMPORARY: Ensure analytics are always on, even if user declines.
  // Set to false to respect user consent.
  const FORCE_ANALYTICS_ENABLED = true

  const shouldTrack = hasConsentedToAnalytics || FORCE_ANALYTICS_ENABLED
  const [delayed, setDelayed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
      // If tracking is enabled (forced or consented), disable property should be false.
      ; (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = !shouldTrack
  }, [shouldTrack])

  useEffect(() => {
    const timer = setTimeout(() => setDelayed(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (!shouldTrack || !delayed) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
