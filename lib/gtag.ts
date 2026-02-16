// Google Analytics utilities
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-LBSYL8WF8M'

/**
 * Disable analytics on local development origin.
 */
export const isAnalyticsDisabledForCurrentOrigin = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' && window.location.port === '3000'
}

// Track page views
export const pageview = (url: string) => {
  if (isAnalyticsDisabledForCurrentOrigin()) return
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// Track events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (isAnalyticsDisabledForCurrentOrigin()) return
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    })
  }
}

// Extend window type for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
