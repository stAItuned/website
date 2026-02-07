// ...existing code...
import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TickerSpacer } from '@/components/layout/TickerSpacer'
import { CRITICAL_CSS } from '@/lib/performance/criticalStyles'

import { ContributeFeedbackWidget } from '@/components/feedback/ContributeFeedbackWidget'

// Temporarily disabled to prevent image optimizer overload
// import { getArticleCoversForPreload } from '@/lib/preload-covers'


// Critical components loaded immediately
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { SafePageViewTracker } from '@/components/PageViewTracker'
import { SearchProvider } from '@/components/SearchContext'
import { SearchModal } from '@/components/SearchModal'
import PerformanceProvider from '@/components/PerformanceProvider'
import { FirebaseAuthProvider } from '@/components/auth/FirebaseAuthProvider'
import { CookieConsentProvider } from '@/components/cookies/CookieConsentProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { TopLoadingBar } from '@/components/ui/PageProgress'
import { PWALearnNavigator, PWAAnalyticsTracker } from '@/components/pwa'
import { FirebaseAnalyticsConsent } from '@/components/FirebaseAnalyticsConsent'

// SEO Structured Data
import { JsonLd } from '@/components/seo/JsonLd'
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo/seo-schemas'
import { LearnLocaleProvider } from '@/lib/i18n'


const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://staituned.com"),
  title: {
    default: 'stAItuned | AI e GenAI concreta per tutti',
    template: '%s | stAItuned',
  },
  description: 'Articoli pratici su AI e GenAI, strumenti e playbook per crescere e ottenere risultati. Inizia dal Role Fit Audit e dal Career OS.',
  keywords: ['AI', 'intelligenza artificiale', 'GenAI', 'AI generativa', 'guide AI', 'tutorial AI', 'cultura AI', 'carriera AI', 'machine learning', 'Italia'],
  authors: [{ name: 'stAItuned' }],
  creator: 'stAItuned',
  publisher: 'stAItuned',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  // PWA manifest removed - only /learn section is installable as PWA
  // See: app/(public)/learn/layout.tsx for learn-specific PWA manifest
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com',
    siteName: 'stAItuned',
    title: 'stAItuned | AI e GenAI concreta per tutti',
    description: 'Articoli pratici su AI e GenAI, strumenti e playbook per crescere e ottenere risultati. Inizia dal Role Fit Audit e dal Career OS.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'stAItuned | AI e GenAI concreta per tutti',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Temporarily disabled to prevent image optimizer overload
  // const articleCovers = getArticleCoversForPreload()

  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* SEO Structured Data (JSON-LD) */}
        <JsonLd data={generateOrganizationSchema()} />
        <JsonLd data={generateWebsiteSchema()} />

        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="googleefba438834d7fae6" />
        {/* Theme initialization script - runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  const root = document.documentElement;
                  if (theme === 'dark') {
                    root.classList.add('dark');
                    root.dataset.theme = 'dark';
                    root.style.colorScheme = 'dark';
                  } else {
                    root.classList.remove('dark');
                    root.dataset.theme = 'light';
                    root.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Critical CSS for immediate render */}
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        {/* RSS Feed autodiscovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="stAItuned RSS Feed"
          href="/rss.xml"
        />
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
        {/* Preconnect to Firebase for auth iframe */}
        <link rel="preconnect" href="https://staituned-production-163f4.firebaseapp.com" />
        <link rel="dns-prefetch" href="https://staituned-production-163f4.firebaseapp.com" />
        <link rel="preconnect" href="https://apis.google.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />

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
              <LearnLocaleProvider defaultLocale="it">
                <CookieConsentProvider>
                  <PerformanceProvider
                    enableMonitoring={process.env.NODE_ENV === 'production'}
                    sampleRate={0.1}
                  >
                    <TopLoadingBar />
                    <FirebaseAnalyticsConsent />
                    <GoogleAnalytics />
                    {/* Main site SW removed - Learn section has its own PWA SW */}
                    {/* Solo i componenti essenziali sono server-side */}
                    <SearchProvider>
                      <SafePageViewTracker />
                      <Header />
                      <section className="relative min-h-screen flex flex-col justify-between">
                        <main className="flex flex-col">
                          {children}
                        </main>
                        <Footer />
                        <TickerSpacer />
                      </section>
                      <SearchModal />
                      {/* PWA navigation helper - shows "Torna a Learn" on non-learn pages */}
                      <PWALearnNavigator />
                      {/* PWA Analytics - tracks standalone mode sessions */}
                      <PWAAnalyticsTracker />
                    </SearchProvider>
                    <Suspense fallback={null}>
                      <ContributeFeedbackWidget />
                    </Suspense>
                  </PerformanceProvider>
                </CookieConsentProvider>
              </LearnLocaleProvider>
            </FirebaseAuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
