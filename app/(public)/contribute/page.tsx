import { Metadata } from 'next'
import ContributePageClient from './ContributePageClient'

export const metadata: Metadata = {
    title: 'Diventa Contributor | stAItuned',
    description: 'Condividi la tua competenza AI. Noi gestiamo l\'ottimizzazione GEO, la distribuzione e il design. Tu mantieni la paternità.',
}

export default function ContributePage() {
    return <ContributePageClient />
}
