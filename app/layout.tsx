// ...existing code...
import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CRITICAL_CSS } from '@/lib/performance/criticalStyles'

import FeedbackLoader from '@/components/feedback/FeedbackLoader.client'

// Temporarily disabled to prevent image optimizer overload
// import { getArticleCoversForPreload } from '@/lib/preload-covers'

// Critical components loaded immediately
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { SafePageViewTracker } from '@/components/PageViewTracker'
import { SearchProvider } from '@/components/SearchContext'
import { SearchModal } from '@/components/SearchModal'
import PerformanceProvider from '@/components/PerformanceProvider'
import { FirebaseAuthProvider } from '@/components/auth/FirebaseAuthProvider'
import { CookieConsentProvider } from '@/components/cookies/CookieConsentProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { TopLoadingBar } from '@/components/ui/PageProgress'


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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://staituned.com"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Temporarily disabled to prevent image optimizer overload
  // const articleCovers = getArticleCoversForPreload()

  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="googleefba438834d7fae6" />
        {/* Critical CSS for immediate render */}
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
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
        {/* Preload learn page target images */}
        <link
          rel="preload"
          href="/assets/learn/newbie-card.jpg"
          as="image"
          type="image/jpeg"
        />
        <link
          rel="preload"
          href="/assets/learn/midway-card.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/assets/learn/expert-card.png"
          as="image"
          type="image/png"
        />
        {/* Temporarily disabled article cover preloading to prevent image optimizer overload
        {articleCovers.map((cover, index) => {
          const isPng = cover.includes('.png')
          const isWebp = cover.includes('.webp')
          
          let type = 'image/jpeg' // default for jpg/jpeg
          if (isPng) type = 'image/png'
          if (isWebp) type = 'image/webp'
          
          return (
            <link
              key={`cover-${index}`}
              rel="preload"
              href={cover}
              as="image"
              type={type}
            />
          )
        })}
        */}
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
        {/* Preload Google Fonts CSS to improve font fetch priority */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className={`${montserrat.className} antialiased stai-body`}>
        <ThemeProvider>
          <ToastProvider>
            <FirebaseAuthProvider>
              <CookieConsentProvider>
                <PerformanceProvider 
                  enableMonitoring={process.env.NODE_ENV === 'production'}
                  sampleRate={0.1}
                >
                <TopLoadingBar />
                <GoogleAnalytics />
                <ServiceWorkerRegister />
              {/* Solo i componenti essenziali sono server-side */}
              <SearchProvider>
                <SafePageViewTracker />
                <Header />
                <section className="relative min-h-screen flex flex-col justify-between">
                  <main className="flex flex-col">
                    {children}
                  </main>
                  <Footer />
                </section>
                <SearchModal />
              </SearchProvider>
              <Suspense fallback={null}>
                <FeedbackLoader />
              </Suspense>
              </PerformanceProvider>
            </CookieConsentProvider>
          </FirebaseAuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
