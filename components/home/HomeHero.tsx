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
    <section className="relative min-h-[85vh] overflow-hidden shadow-2xl">
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/80 to-slate-900/70" />
      <div className="relative z-20 max-w-6xl mx-auto px-6 py-16 space-y-8 text-slate-100">
        <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-amber-300">
          AI strategica · per PMI · dal problema al prototipo
        </span>
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          AI pratica per PMI: dal foglio di idee al primo MVP in 2 settimane
        </h1>
        <div className="space-y-2 text-lg md:text-xl text-slate-200 max-w-3xl">
          <p>
            Ti affianco come AI Strategy & Product Lead: scegliamo 1–2 casi d’uso ad alto impatto, costruiamo una demo/MVP AI funzionante in 2 settimane (assistenti AI, automazioni, sistemi di raccomandazione 1-to-1) e la rendiamo integrabile nei sistemi che usi già (CRM, gestionale, tool interni).
          </p>
          <p>
            Combiniamo GenAI e AI “classica” per far emergere insight dai tuoi dati e trasformarli in strumenti operativi, non solo in una webapp isolata.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/aziende"
            className="px-6 py-3 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition"
          >
            Per la tua azienda
          </Link>
          <Link
            href="/learn"
            className="px-6 py-3 rounded-full border border-white/60 text-white font-semibold hover:border-white hover:text-amber-300 transition"
          >
            Per imparare e sperimentare
          </Link>
        </div>
        <p className="text-sm text-slate-200/80 max-w-2xl">
          Se hai una PMI o un’azienda in crescita, inizia da “Per la tua azienda”. Se vuoi imparare, sperimentare e restare aggiornato su AI e GenAI, inizia da “Per imparare e sperimentare”.
        </p>
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/10 border border-white/10 rounded-3xl p-4 text-center text-slate-100">
          {stats.map((stat) => {
            const value = typeof stat.value === 'number' ? stat.value.toLocaleString('it-IT') : stat.value
            const content = (
              <>
                <p className="text-3xl font-bold leading-relaxed">{value}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-200">{stat.label}</p>
              </>
            )

            return stat.href ? (
              <Link
                key={stat.label}
                href={stat.href}
                className="transition hover:text-amber-300"
              >
                {content}
              </Link>
            ) : (
              <div key={stat.label}>
                {content}
              </div>
            )
          })}
        </div> */}
      </div>
    </section>
  )
}
