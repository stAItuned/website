import type { Metadata } from 'next'
import CookiePolicyClient from './CookiePolicyClient'

export const metadata: Metadata = {
  title: 'Cookie Policy | stAItuned',
  description: 'Dettagli sui cookie tecnici e analitici usati da stAItuned e su come gestire il consenso.',
}

export default function CookiePolicyPage() {
  return <CookiePolicyClient />
}
