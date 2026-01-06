'use client'

import Image from 'next/image'
import { HeroAnimatedBackground } from './HeroAnimatedBackground'

/**
 * HomeHero - Authority Hub
 * Positioning: Expert in AI Engineering.
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

          {/* Main Headline - Market Urgency Hook */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white animate-fade-in-up">
            The AI market is moving fast.
            <br />
            <span className="text-gradient-gold">Don't get left behind.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Stop being a tourist. Cross the gap from <strong>'Enthusiast'</strong> to <strong>'Hired Pro'</strong> with deep technical insights and career strategy.
          </p>

          {/* Single CTA - Scroll Down (Curiosity First) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            {/* CTA - Scroll to Articles */}
            <a
              href="#articles"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 font-bold text-base shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <span>↓</span>
              <span>Explore Latest Articles</span>
              <span className="group-hover:translate-y-1 transition-transform">↓</span>
            </a>
          </div>

          {/* Authority Strip */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 pt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-2 text-white/70">
              <span className="text-xl">📚</span>
              <span className="text-sm font-medium">96+ Technical Articles</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/30" />
            <div className="flex items-center gap-2 text-white/70">
              <span className="text-xl">✍️</span>
              <span className="text-sm font-medium">24 AI Expert Contributors</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/30" />
            <div className="flex items-center gap-2 text-white/70">
              <span className="text-xl">🎯</span>
              <span className="text-sm font-medium">Career-Focused Content</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
