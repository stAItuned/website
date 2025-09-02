// ...existing code...
import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import dynamic from 'next/dynamic'
import FeedbackLauncher from "@/components/feedback/FeedbackLauncher";

// Temporarily disabled to prevent image optimizer overload
// import { getArticleCoversForPreload } from '@/lib/preload-covers'

// Critical components loaded immediately
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'

// Non-critical components lazy loaded
const SafePageViewTracker = dynamic(
  () => import('@/components/PageViewTracker').then(mod => ({ default: mod.SafePageViewTracker })),
  { ssr: false }
)

const SearchProvider = dynamic(
  () => import('@/components/SearchContext').then(mod => ({ default: mod.SearchProvider })),
  { ssr: false }
)

const SearchModal = dynamic(
  () => import('@/components/SearchModal').then(mod => ({ default: mod.SearchModal })),
  { ssr: false }
)


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
      </head>
      <body className={montserrat.className}>
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
        <FeedbackLauncher />
      </body>
    </html>
  )
}
