import { Metadata } from 'next'
import { Suspense } from 'react'
import WizardClient from './WizardClient'

export const metadata: Metadata = {
    title: 'Contributor Wizard | stAItuned',
    description: 'Crea il tuo articolo con il supporto dell\'IA.',
}

export default function WizardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-pulse" />}>
            <WizardClient />
        </Suspense>
    )
}
