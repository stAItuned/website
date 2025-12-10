import Link from 'next/link'
import Image from 'next/image'
import { HeroAnimatedBackground } from './HeroAnimatedBackground'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

interface HomeHeroProps {
  totalArticles: number
  totalWriters: number
  activeUsers: number | string
  sessions: number | string
}

/**
 * Enhanced HomeHero component with:
 * - Animated floating background orbs
 * - Animated stat counters
 * - Improved visual hierarchy
 * - Better CTAs with micro-interactions
 */
export function HomeHero({
  totalArticles,
  totalWriters,
  activeUsers,
  sessions
}: HomeHeroProps) {
  // Stats configuration
  const stats = [
    {
      label: 'Articoli',
      value: totalArticles,
      icon: '📚',
      href: '/learn'
    },
    {
      label: 'Utenti',
      value: typeof activeUsers === 'number' ? activeUsers : 0,
      icon: '👥',
    },
    {
      label: 'Sessioni',
      value: typeof sessions === 'number' ? sessions : 0,
      icon: '📊',
    },
    {
      label: 'Contributor',
      value: totalWriters,
      icon: '✍️',
      href: '/meet'
    },
  ]

  return (
    <section className="relative min-h-[90vh] overflow-hidden shadow-2xl">
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-slate-900/85 to-slate-900/75" />

      {/* Animated Background Elements */}
      <HeroAnimatedBackground orbCount={4} showGrid={false} />

      {/* Content Container */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 py-20 md:py-24 flex flex-col justify-center min-h-[90vh]">
        <div className="space-y-10 max-w-4xl">

          {/* Eyebrow Badge with glow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-sm glow-amber-subtle animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-300">
              AI pratica per PMI e team digitali
            </span>
          </div>

          {/* Main Headline with gradient text */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white animate-fade-in-up">
            <span className="text-gradient-gold">Prototipi di AI</span> da testare sul campo,{' '}
            <br className="hidden md:block" />
            prima di <span className="text-gradient-gold">investire</span> in progetti lunghi e costosi.
          </h1>

          {/* Value Proposition */}
          <div className="space-y-4 text-base md:text-lg text-slate-200 leading-relaxed max-w-3xl animate-fade-in" style={{ animationDelay: '200ms' }}>
            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
              Ti aiutiamo a trasformare ipotesi su AI in esperimenti concreti: prototipi, demo e strumenti di prova che il tuo team può usare subito per capire se vale la pena fare il passo successivo.
            </p>

            {/* Feature List */}
            <ul className="space-y-3 text-slate-100">
              {[
                {
                  text: 'Scegliamo', highlight: '1–2 casi d\'uso ad alto impatto', suffix: 'per la tua PMI'
                },
                { text: 'Costruiamo', highlight: 'progetti pilota funzionanti', suffix: '' },
                { text: 'Ti aiutiamo a capire', highlight: 'se e come integrarli', suffix: 'nei sistemi già in uso' },
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 group animate-fade-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <span className="text-amber-400 font-bold mt-1 group-hover:scale-110 transition-transform">✓</span>
                  <span>
                    {item.text} <strong className="text-white">{item.highlight}</strong> {item.suffix}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-4 pt-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
            {stats.map((stat, index) => {
              const statContent = (
                <>
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </span>
                  <span className="text-2xl font-bold text-amber-400">
                    {typeof stat.value === 'number' ? (
                      <AnimatedCounter
                        value={stat.value}
                        duration={1500 + index * 200}
                        suffix=""
                      />
                    ) : stat.value}
                  </span>
                  <span className="text-xs text-slate-300 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </>
              )

              return stat.href ? (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="hero-stat-card group cursor-pointer"
                >
                  {statContent}
                </Link>
              ) : (
                <div
                  key={stat.label}
                  className="hero-stat-card group cursor-default"
                >
                  {statContent}
                </div>
              )
            })}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <Link
              href="/aziende"
              className="btn-brand-primary text-lg group"
            >
              <span>Per la tua azienda</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/learn"
              className="btn-brand-secondary text-lg group"
            >
              <span>Impara con stAI tuned Lab</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Helper Text */}
          <p className="text-sm text-slate-300/90 max-w-2xl pt-2 animate-fade-in" style={{ animationDelay: '700ms' }}>
            <strong className="text-white">PMI o azienda in crescita?</strong> Inizia da "Per la tua azienda".
            <br className="hidden sm:block" />
            <strong className="text-white">Vuoi imparare AI?</strong> Inizia da "Impara con stAI tuned Lab".
            <br className="hidden sm:block" />
            <strong className="text-white">E se vuoi imparare facendo,</strong> scopri anche{' '}
            <Link href="/lab" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">
              stAItuned Lab
            </Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
