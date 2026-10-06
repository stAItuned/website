import type { VenturesCopy } from './venturesContent'

interface VenturesHeroProps {
  copy: VenturesCopy['hero']
}

export function VenturesHero({ copy }: VenturesHeroProps) {
  return (
    <section id="top" className="relative min-h-[70vh] overflow-hidden bg-slate-900 text-white shadow-2xl">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl items-center px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="w-full space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
            {copy.eyebrow}
          </div>

          <div className="space-y-5">
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              <span className="block">{copy.headlineTop}</span>
              <span className="mt-2 block text-gradient-gold">{copy.headlineAccent}</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-200 md:text-xl">
              {copy.description}
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
            <a href="#portfolio" className="btn-brand-primary">
              <span>{copy.primaryCta}</span>
              <span aria-hidden>↓</span>
            </a>
            <a href="#founding-gtm" className="btn-brand-secondary">
              <span>{copy.secondaryCta}</span>
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-4 text-sm font-medium text-white/75 md:gap-x-10">
            {copy.proof.map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" aria-hidden />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
