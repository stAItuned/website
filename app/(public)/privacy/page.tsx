import type { Metadata } from 'next'
import PrivacyPageClient from './PrivacyPageClient'

export const metadata: Metadata = {
  title: 'Privacy Policy | stAItuned',
  description: 'Come raccogliamo e utilizziamo i dati di chi visita il blog, richiede una call o desidera ricevere aggiornamenti.',
}

export default function PrivacyPage() {
  return <PrivacyPageClient />
}
