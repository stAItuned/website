import type { VenturesCopy } from './venturesContent'

interface VenturePrinciplesSectionProps {
  copy: VenturesCopy['principles']
}

export function VenturePrinciplesSection({ copy }: VenturePrinciplesSectionProps) {
  return (
    <section className="bg-white px-5 py-20 dark:bg-slate-950 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-500 dark:text-secondary-500">
              {copy.eyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-5xl">
              {copy.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              {copy.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {copy.items.map((item) => (
              <article
                key={item.number}
                className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-[72px_1fr] sm:p-7"
              >
                <div className="text-3xl font-bold text-secondary-500">{item.number}</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}

            <div className="rounded-3xl border border-secondary-500/40 bg-secondary-500/10 p-6 sm:p-7">
              <p className="text-xl font-bold text-slate-950 dark:text-white">{copy.killLine}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300 sm:text-base">
                {copy.killDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
