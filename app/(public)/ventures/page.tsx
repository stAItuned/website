import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { VenturesPageClient } from '@/components/ventures/VenturesPageClient'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export const metadata: Metadata = {
  title: 'Ventures | AI Venture Building',
  description:
    'Costruiamo prodotti AI, li testiamo sul mercato e capiamo quali meritano di crescere.',
  alternates: {
    canonical: `${SITE_URL}/ventures`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    url: `${SITE_URL}/ventures`,
    title: 'stAI tuned Ventures | AI Venture Building',
    description:
      'We build AI products, test them with real users and learn which ones deserve to grow.',
    type: 'website',
  },
}

export default function VenturesPage() {
  return (
    <PageTransition>
      <VenturesPageClient />
    </PageTransition>
  )
}
