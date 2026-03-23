import type { Metadata } from 'next'

/**
 * Prevents private or auth-gated routes from being indexed while still allowing
 * crawlers to follow links to public content.
 */
export const PRIVATE_ROUTE_METADATA: Metadata = {
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}
