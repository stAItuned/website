import { VentureVisualMedia } from './VentureVisualMedia'
import type { VenturesCopy } from './venturesContent'

interface VenturePortfolioSectionProps {
  copy: VenturesCopy['portfolio']
}

export function VenturePortfolioSection({ copy }: VenturePortfolioSectionProps) {
  return (
    <section id="portfolio" className="bg-white px-4 py-16 dark:bg-slate-950 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
            {copy.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">{copy.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">{copy.subtitle}</p>
        </div>

        <div className="mt-12 space-y-8">
          {copy.ventures.map((venture, index) => {
            const visualFirst = index % 2 === 0

            return (
              <article
                key={venture.id}
                className="grid gap-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/60 sm:p-6 lg:grid-cols-2 lg:items-center"
              >
                <div className={visualFirst ? 'lg:order-1' : 'lg:order-2'}>
                  <VentureVisualMedia
                    title={venture.title}
                    label={venture.visualLabel}
                    index={index}
                    placeholderLabel={venture.placeholderLabel}
                    imageSrc={venture.imageSrc}
                    zoomLabel={copy.zoomLabel}
                    closeLabel={copy.closeLabel}
                  />
                </div>

                <div className={`px-1 py-2 sm:px-3 lg:px-5 ${visualFirst ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                      {venture.stage}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">{venture.title}</h3>
                  <p className="mt-2 text-lg font-semibold text-amber-600 dark:text-amber-400">{venture.proposition}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
                    {venture.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {venture.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-200/70 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 p-6 dark:border-amber-500/30 dark:bg-amber-500/5">
          <p className="text-sm font-bold text-amber-700 dark:text-amber-300">{copy.pipelineLabel}</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400 md:text-base">
            {copy.pipelineText}
          </p>
        </div>
      </div>
    </section>
  )
}
