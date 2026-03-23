'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { GA_MEASUREMENT_ID, isAnalyticsDisabledForCurrentOrigin } from '@/lib/gtag'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'

export function GoogleAnalytics() {
  const { hasConsentedToAnalytics } = useCookieConsent()

  const isDisabledForOrigin = isAnalyticsDisabledForCurrentOrigin()
  const shouldTrack = !isDisabledForOrigin && hasConsentedToAnalytics
  const [delayed, setDelayed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
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
