import { Metadata } from 'next'
import WizardClient from './WizardClient'

export const metadata: Metadata = {
    title: 'Contributor Wizard | stAItuned',
    description: 'Crea il tuo articolo con il supporto dell\'IA.',
}

export default function WizardPage() {
    return <WizardClient />
}
