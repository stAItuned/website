import type { Metadata } from 'next'
import CookiePolicyClient from './CookiePolicyClient'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export const metadata: Metadata = {
  title: 'Cookie Policy | stAI tuned',
  description: 'Dettagli sui cookie tecnici e analitici usati da stAI tuned e su come gestire il consenso.',
  alternates: {
    canonical: `${SITE_URL}/cookie-policy`,
  },
}

export default function CookiePolicyPage() {
  return <CookiePolicyClient />
}
