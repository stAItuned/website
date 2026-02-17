import { Metadata } from 'next'
import ContributePageClient from './ContributePageClient'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export const metadata: Metadata = {
    title: 'Diventa Contributor | stAI tuned',
    description: 'Condividi la tua competenza AI. Noi gestiamo l\'ottimizzazione GEO, la distribuzione e il design. Tu mantieni la paternità.',
    alternates: {
        canonical: `${SITE_URL}/contribute`,
    },
}

export default function ContributePage() {
    return <ContributePageClient />
}
