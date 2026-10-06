import type { VenturesCopy } from './venturesContent'

interface VenturesHeroProps {
  copy: VenturesCopy['hero']
}

export function VenturesHero({ copy }: VenturesHeroProps) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-8rem] top-20 h-80 w-80 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-[-4rem] h-96 w-96 rounded-full bg-secondary-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary-500/50 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-center px-5 pb-20 pt-36 sm:px-6 md:pb-24 md:pt-40 lg:px-8">
        <div className="max-w-5xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.28em] text-secondary-500 sm:text-sm">
            {copy.eyebrow}
          </p>

          <h1 className="max-w-5xl text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block">{copy.headlineTop}</span>
            <span className="mt-2 block text-secondary-500">{copy.headlineAccent}</span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            {copy.description}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#portfolio"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-secondary-500 px-6 py-3 text-sm font-bold text-primary-600 shadow-lg shadow-secondary-500/10 transition hover:-translate-y-0.5 hover:bg-secondary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {copy.primaryCta}
              <span aria-hidden>↓</span>
            </a>
            <a
              href="#founding-gtm"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {copy.secondaryCta}
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-6">
            {copy.proof.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
