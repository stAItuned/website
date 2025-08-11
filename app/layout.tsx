import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'stAItuned - AI & Data Science Community',
  description: 'Artificial intelligence within everyone\'s reach. The Italian community for AI enthusiasts, data scientists, and machine learning practitioners.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>
          <Header />
          <section className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
            <main className="h-full flex flex-col justify-center">
              {children}
            </main>
            <Footer />
          </section>
        </Providers>
      </body>
    </html>
  )
}
