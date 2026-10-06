import { VentureVisualPlaceholder } from './VentureVisualPlaceholder'
import type { VenturesCopy } from './venturesContent'

interface VenturePortfolioSectionProps {
  copy: VenturesCopy['portfolio']
}

export function VenturePortfolioSection({ copy }: VenturePortfolioSectionProps) {
  return (
    <section id="portfolio" className="bg-slate-950 px-5 py-20 text-white sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-500">{copy.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] sm:text-5xl md:text-6xl">{copy.title}</h2>
          <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">{copy.subtitle}</p>
        </div>

        <div className="mt-16 space-y-10 md:space-y-16">
          {copy.ventures.map((venture, index) => {
            const visualFirst = index % 2 === 0

            return (
              <article
                key={venture.id}
                className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/10 sm:p-7 lg:grid-cols-2 lg:items-center lg:p-8"
              >
                <div className={visualFirst ? 'lg:order-1' : 'lg:order-2'}>
                  <VentureVisualPlaceholder
                    title={venture.title}
                    label={venture.visualLabel}
                    index={index}
                    placeholderLabel={venture.placeholderLabel}
                  />
                </div>

                <div className={`px-1 py-2 sm:px-3 lg:px-6 ${visualFirst ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-secondary-500/30 bg-secondary-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-secondary-500">
                      {venture.stage}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{venture.title}</h3>
                  <p className="mt-2 text-lg font-semibold text-secondary-500 sm:text-xl">{venture.proposition}</p>
                  <p className="mt-5 text-base leading-7 text-slate-300">{venture.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {venture.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300"
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

        <div className="mt-12 rounded-3xl border border-dashed border-white/20 bg-white/[0.02] p-7 sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary-500">{copy.pipelineLabel}</p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">{copy.pipelineText}</p>
        </div>
      </div>
    </section>
  )
}
