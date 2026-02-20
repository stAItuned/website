import type { Metadata } from 'next'
import TermsPageClient from './TermsPageClient'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export const metadata: Metadata = {
    title: 'Termini e Condizioni',
    description: 'Contratto di licenza e termini d’uso per Career OS.',
    alternates: {
        canonical: `${SITE_URL}/terms`,
    },
}

export default function TermsPage() {
    return <TermsPageClient />
}
