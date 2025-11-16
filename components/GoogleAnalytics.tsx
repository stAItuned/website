'use client'

import Script from 'next/script'
import { GA_MEASUREMENT_ID } from '@/lib/gtag'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'

export function GoogleAnalytics() {
  const { hasConsentedToAnalytics } = useCookieConsent()

  if (!hasConsentedToAnalytics) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
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
