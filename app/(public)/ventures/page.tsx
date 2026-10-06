import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { VenturesPageClient } from '@/components/ventures/VenturesPageClient'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export const metadata: Metadata = {
  title: 'Ventures | AI Venture Building',
  description:
    'Costruiamo e validiamo prodotti AI-native. Scopri il portfolio stAI tuned Ventures e l’opportunità Founding GTM / Venture Builder.',
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
      'AI-native products, working software and a zero-to-one venture engine. Explore the portfolio and the Founding GTM opportunity.',
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
