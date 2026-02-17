import type { Metadata } from 'next'
import PrivacyPageClient from './PrivacyPageClient'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export const metadata: Metadata = {
  title: 'Privacy Policy | stAItuned',
  description: 'Come raccogliamo e utilizziamo i dati di chi visita il blog, richiede una call o desidera ricevere aggiornamenti.',
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
}

export default function PrivacyPage() {
  return <PrivacyPageClient />
}
