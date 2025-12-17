'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { HeroAnimatedBackground } from './HeroAnimatedBackground'
import { ContactCtaWithModal } from '@/app/(public)/aziende/ContactCtaWithModal'
import { useHomeUserType } from './HomeUserTypeContext'
import { ReactNode } from 'react'

// Type definitions for hero content
interface HeroContentCta {
  label: string
  icon: string
  action?: 'modal'
  href?: string
}

interface HeroContentType {
  eyebrow: string
  headline: ReactNode
  subheadline: string
  description: string
  details: ReactNode
  primaryCta: HeroContentCta | null
  secondaryCta: { label: string; href: string } | null
  trustMicrocopy: ReactNode
}

// Content variations for each user type
const heroContent: Record<'azienda' | 'learner' | 'default', HeroContentType> = {
  azienda: {
    eyebrow: 'AI per PMI & Team Digitali',
    headline: <>Portiamo l&apos;AI nei tuoi processi{' '}<span className="text-gradient-gold">in 14 giorni</span>.</>,
    subheadline: 'Risultati misurabili su dati reali.',
    description: 'Sviluppiamo automazioni e DocAI su documenti e workflow aziendali.',
    details: <>Con <strong className="text-white">guardrail</strong>, <strong className="text-white">valutazioni</strong>, log e <strong className="text-white">human-in-the-loop</strong> per una qualità affidabile.</>,
    primaryCta: { label: 'Prenota una mini-call (15 min)', icon: '🚀', action: 'modal' },
    secondaryCta: { label: 'Vedi casi e demo', href: '/aziende' },
    trustMicrocopy: <>Risposta entro 48 ore. <strong className="text-slate-300">Se non siamo il partner giusto, te lo diciamo subito.</strong></>,
  },
  learner: {
    eyebrow: 'Learn & Build AI',
    headline: <>Impara AI{' '}<span className="text-gradient-gold">costruendo progetti reali</span>.</>,
    subheadline: 'Dal concetto alla webapp, passo dopo passo.',
    description: 'Articoli pratici, tutorial guidati e progetti nel Lab per imparare facendo.',
    details: <>Percorsi da <strong className="text-white">Newbie</strong> a <strong className="text-white">Expert</strong>, con mentorship e review sui tuoi progetti.</>,
    primaryCta: { label: 'Esplora gli articoli', icon: '📚', href: '/learn' },
    secondaryCta: { label: 'Unisciti al Lab', href: '/lab' },
    trustMicrocopy: <>Community attiva. <strong className="text-slate-300">Impara con chi sta costruendo AI oggi.</strong></>,
  },
  // Default/neutral content when no type selected (shows before selection)
  default: {
    eyebrow: 'stAItuned',
    headline: <>AI pratica{' '}<span className="text-gradient-gold">per chi vuole risultati</span>.</>,
    subheadline: 'Pilot per aziende. Percorsi per chi impara.',
    description: 'Scopri cosa possiamo fare insieme: pilot rapidi per PMI o percorsi formativi per AI enthusiast.',
    details: <>Scegli il tuo percorso qui sotto per vedere contenuti personalizzati.</>,
    primaryCta: null,
    secondaryCta: null,
    trustMicrocopy: null,
  }
}

/**
 * HomeHero - Conversion-first hero section
 * Static business-focused content optimized for B2B conversion.
 * Uses defensible claims and clear CTAs.
 */
export function HomeHero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="relative min-h-[85vh] overflow-hidden shadow-2xl">
        {/* Background Image */}
        <Image
          src="/assets/general/home_bg.webp"
          alt="AI background"
          fill
          className="object-cover scale-x-[-1]"
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-900/80" />

        {/* Animated Background Elements */}
        <HeroAnimatedBackground orbCount={4} showGrid={false} />

        {/* Content Container */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 py-16 md:py-20 flex flex-col justify-center min-h-[85vh]">
          <div className="space-y-8 max-w-4xl">

            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-sm animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-amber-300">
                AI per PMI & Team Digitali
              </span>
            </div>

            {/* Main Headline - Consistent with /aziende */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white animate-fade-in-up">
              In 10 giorni scegliamo il caso d&apos;uso.{' '}
              <span className="text-gradient-gold">In 4 settimane lo portiamo in Pilot.</span>
              <br className="hidden md:block" />
              <span className="text-slate-200 text-3xl md:text-4xl lg:text-5xl">
                Risultati misurabili su dati reali.
              </span>
            </h1>

            {/* Subheadline - Quality decoded */}
            <div className="space-y-4 text-base md:text-lg text-slate-200 leading-relaxed max-w-3xl animate-fade-in" style={{ animationDelay: '200ms' }}>
              <p className="text-lg md:text-xl text-white/95">
                DocAI e automazioni su documenti e workflow (amministrazione, operations, commesse).
              </p>
              <p className="text-slate-300">
                Con controlli, validazione e log.
                <span className="text-slate-400"> Così evitiamo risposte inventate e il team può verificare.</span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
              {/* Primary CTA */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 font-bold text-base shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <span>Mini-call 15 min (fit)</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Secondary CTA */}
              <Link
                href="/aziende"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white font-semibold text-base hover:bg-white/10 hover:border-white/50 transition-all"
              >
                <span>Vedi casi e processo</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Trust Microcopy */}
            <p className="text-sm text-slate-400 max-w-xl animate-fade-in" style={{ animationDelay: '600ms' }}>
              Senza impegno. <strong className="text-slate-300">Se c&apos;è potenziale, facciamo una call 30 min per lo scope.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Booking modal */}
      <ContactCtaWithModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  )
}
