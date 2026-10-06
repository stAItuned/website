import type { VenturesCopy } from './venturesContent'

interface VenturePrinciplesSectionProps {
  copy: VenturesCopy['principles']
}

export function VenturePrinciplesSection({ copy }: VenturePrinciplesSectionProps) {
  return (
    <section className="bg-slate-50 px-4 py-16 dark:bg-slate-900/50 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-300/20 bg-primary-300/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden />
              {copy.eyebrow}
            </span>
            <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
              {copy.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {copy.items.map((item) => (
              <article
                key={item.number}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 sm:grid-cols-[56px_1fr]"
              >
                <div className="text-2xl font-bold text-amber-500">{item.number}</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400 md:text-base">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-500/30 dark:bg-amber-500/10">
              <p className="text-lg font-bold text-slate-900 dark:text-white">{copy.killLine}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
                {copy.killDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
