import type { Metadata } from 'next'
import TermsPageClient from './TermsPageClient'

export const metadata: Metadata = {
    title: 'Termini e Condizioni | stAItuned',
    description: 'Contratto di licenza e termini d’uso per Career OS.',
}

export default function TermsPage() {
    return <TermsPageClient />
}
