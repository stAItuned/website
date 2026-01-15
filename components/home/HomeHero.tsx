'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HeroAnimatedBackground } from './HeroAnimatedBackground'
import { useLearnLocale, homeTranslations } from '@/lib/i18n'

/**
 * HomeHero - Authority Hub
 * Positioning: Expert in AI Engineering.
 * 
 * Features:
 * - Bilingual IT/EN support with auto-detection
 * - Dual CTA: Explore Articles + Discover Career OS
 * - Authority Strip with statistics
 */
interface HomeHeroProps {
  articleCount?: number
  contributorCount?: number
}

export function HomeHero({ articleCount, contributorCount }: HomeHeroProps) {
  const { locale } = useLearnLocale()
  const t = homeTranslations[locale]

  // Fallback only if undefined (should be passed from page)
  const displayArticles = articleCount || 0
  const displayContributors = contributorCount || 0

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
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/90 to-slate-900/85" />

      {/* Animated Background Elements */}
      <HeroAnimatedBackground orbCount={3} showGrid={false} />

      {/* Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-24 flex flex-col justify-center min-h-[70vh]">
        <div className="space-y-8 text-center">


          {/* Main Headline - Pain-first + Mission */}
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white">
              {t.hero.headline}
              <br />
              <span className="text-gradient-gold">{t.hero.mission}</span>
            </h1>

            {/* Pain Statement */}
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
              {t.hero.pain.split(/(\*\*.*?\*\*)/).map((part: string, index: number) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <span key={index} className="text-white font-bold">{part.slice(2, -2)}</span>
                  : part
              )}
            </p>
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            {/* Primary CTA - Explore Articles */}
            <a
              href="#articles"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 font-bold text-base shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <span>↓</span>
              <span>{t.hero.ctaArticles}</span>
              <span className="group-hover:translate-y-1 transition-transform">↓</span>
            </a>

            {/* Secondary CTA - Career OS */}
            <Link
              href="/career-os"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border-2 border-white/30 text-white font-bold text-base hover:bg-white/10 hover:-translate-y-1 hover:border-white/50 transition-all"
            >
              <span>{t.hero.ctaCareerOS}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Authority Strip - Mobile optimized with pill backgrounds */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-10 pt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-2 text-white/80 px-3 py-1.5 sm:px-0 sm:py-0 rounded-full bg-white/10 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <span className="text-lg sm:text-xl">📚</span>
              <span className="text-xs sm:text-sm font-medium">{displayArticles} {t.hero.stats.articles}</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/30" />
            <div className="flex items-center gap-2 text-white/80 px-3 py-1.5 sm:px-0 sm:py-0 rounded-full bg-white/10 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <span className="text-lg sm:text-xl">✍️</span>
              <span className="text-xs sm:text-sm font-medium">{displayContributors} {t.hero.stats.contributors}</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/30" />
            <div className="flex items-center gap-2 text-white/80 px-3 py-1.5 sm:px-0 sm:py-0 rounded-full bg-white/10 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <span className="text-lg sm:text-xl">🎯</span>
              <span className="text-xs sm:text-sm font-medium">{t.hero.stats.careerFocused}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

