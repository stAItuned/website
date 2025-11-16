import Link from 'next/link'
import Image from 'next/image'

interface HomeHeroProps {
  totalArticles: number
  totalWriters: number
  activeUsers: number | string
  sessions: number | string
}

export function HomeHero({
  totalArticles,
  totalWriters,
  activeUsers,
  sessions
}: HomeHeroProps) {
  const stats = [
    { label: 'articles', value: totalArticles, href: '/learn' },
    { label: 'users', value: activeUsers },
    { label: 'sessions', value: sessions },
    { label: 'contributors', value: totalWriters, href: '/meet' },
  ]

  return (
    <section className="relative min-h-[90vh] overflow-hidden shadow-2xl">
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-slate-900/85 to-slate-900/75" />
      
      <div className="relative z-20 max-w-6xl mx-auto px-6 py-20 md:py-24 flex flex-col justify-center min-h-[90vh]">
        <div className="space-y-10 max-w-4xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-sm">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-300">
              AI strategica per PMI
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white">
            Dal foglio di idee al primo{' '}
            <span className="text-amber-400">MVP AI</span>
            <br />
            in 2 settimane
          </h1>

          {/* Value proposition */}
          <div className="space-y-4 text-base md:text-lg text-slate-200 leading-relaxed max-w-3xl">
            <p className="text-xl md:text-2xl font-medium text-white">
              Ti affianchiamo come AI Strategy & Product Lead
            </p>
            <ul className="space-y-3 text-slate-100">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">✓</span>
                <span>Scegliamo <strong className="text-white">1–2 casi d'uso ad alto impatto</strong> per la tua PMI</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">✓</span>
                <span>Costruiamo <strong className="text-white">demo/MVP funzionanti</strong> (assistenti AI, automazioni, sistemi di raccomandazione 1-to-1)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">✓</span>
                <span>Integrazione con i <strong className="text-white">sistemi che usi già</strong> (CRM, gestionale, tool interni)</span>
              </li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/aziende"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-amber-400 text-slate-900 font-bold text-lg hover:bg-amber-300 hover:scale-105 transition-all shadow-lg shadow-amber-500/25"
            >
              <span>Per la tua azienda</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/learn"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/60 text-white font-semibold text-lg hover:border-white hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              <span>Impara e sperimenta</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Helper text */}
          <p className="text-sm text-slate-300/90 max-w-2xl pt-2">
            <strong className="text-white">PMI o azienda in crescita?</strong> Inizia da "Per la tua azienda". 
            <br className="hidden sm:block" />
            <strong className="text-white">Vuoi imparare AI?</strong> Inizia da "Impara e sperimenta".
          </p>
        </div>
      </div>
    </section>
  )
}
