import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SearchModal } from '@/components/SearchModal'
import { SearchProvider } from '@/components/SearchContext'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { SafePageViewTracker } from '@/components/PageViewTracker'
import { CacheProvider } from '@/components/CacheProvider'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'stAItuned - Your Sharing Spot',
  description: 'Artificial intelligence within everyone\'s reach. The Italian community for AI enthusiasts, data scientists, and machine learning practitioners.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://staituned.it'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/assets/general/home_bg.webp"
          as="image"
          type="image/webp"
        />
        <link
          rel="preload"
          href="/assets/general/logo-text.png"
          as="image"
          type="image/png"
        />
        {/* Preload critical fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={montserrat.className}>
        <GoogleAnalytics />
        <ServiceWorkerRegister />
        <Providers>
          <CacheProvider>
            <SearchProvider>
              <SafePageViewTracker />
              <Header />
              <section className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
                <main className="h-full flex flex-col justify-center">
                  {children}
                </main>
                <Footer />
              </section>
              <SearchModal />
            </SearchProvider>
          </CacheProvider>
        </Providers>
      </body>
    </html>
  )
}
