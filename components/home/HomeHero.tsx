'use client'

import Link from 'next/link'
import Image from 'next/image'
import { HeroAnimatedBackground } from './HeroAnimatedBackground'

/**
 * HomeHero - Neutral hero serving both blog readers and B2B prospects
 * Dual CTA with equal weight: Learn and Build
 */
export function HomeHero() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden shadow-2xl">
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/90 to-slate-900/85" />

      {/* Animated Background Elements */}
      <HeroAnimatedBackground orbCount={3} showGrid={false} />

      {/* Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col justify-center min-h-[70vh]">
        <div className="space-y-8 text-center">

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-white/80">
              stAItuned
            </span>
          </div>

          {/* Main Headline - Neutral */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white animate-fade-in-up">
            Tutti fanno AI
            <br />
            {/* <br /> */}

            <span className="text-gradient-gold"> Noi la rendiamo efficace e misurabile.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            <strong>Contenuti pratici</strong> e <strong>pilot su dati reali</strong> per trasformare use case in KPI verificabili.
          </p>

          {/* Dual CTAs - Equal weight */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            {/* CTA 2 - Aziende */}
            <Link
              href="/aziende"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 font-bold text-base shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <span>🏢</span>
              <span>Per aziende: Avvia un Pilot</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            
            {/* CTA 1 - Blog */}
            <Link
              href="/learn"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-slate-900 font-bold text-base shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <span>📚</span>
              <span>Approfondisci l'AI</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

          </div>

        </div>
      </div>
    </section>
  )
}
