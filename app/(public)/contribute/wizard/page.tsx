import { Metadata } from 'next'
import { Suspense } from 'react'
import WizardClient from './WizardClient'

export const metadata: Metadata = {
    title: 'Contributor Wizard | stAI tuned',
    description: 'Crea il tuo articolo con il supporto dell\'IA.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function WizardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-pulse" />}>
            <WizardClient />
        </Suspense>
    )
}
