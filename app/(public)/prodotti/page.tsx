import type { Metadata } from 'next'
import DemoPage from '../demo/page'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export const metadata: Metadata = {
  title: 'Lab Projects - stAItuned',
  description:
    'Esperimenti di AI che diventano prodotti. Webapp nate da progetti pilota con PMI, riadattabili ai tuoi processi in poche settimane.',
  alternates: {
    canonical: `${SITE_URL}/prodotti`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    url: `${SITE_URL}/prodotti`,
    title: 'Lab Projects - stAItuned',
    description:
      "Prodotti e webapp di AI nati da casi d'uso reali. Progetti pilota che diventano soluzioni concrete.",
    type: 'website',
  },
}

export default DemoPage
