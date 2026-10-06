import type { VenturesCopy, VentureEngineStatus } from './venturesContent'

interface VentureEngineSectionProps {
  thesis: VenturesCopy['thesis']
  engine: VenturesCopy['engine']
}

const stepTone: Record<VentureEngineStatus, string> = {
  existing: 'border-primary-400/40 bg-primary-500/10 text-primary-600 dark:text-primary-300',
  focus: 'border-secondary-500/60 bg-secondary-500/10 text-accent-700 dark:text-secondary-500',
  next: 'border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
}

export function VentureEngineSection({ thesis, engine }: VentureEngineSectionProps) {
  return (
    <>
      <section className="border-b border-slate-200 bg-white px-5 py-20 dark:border-slate-800 dark:bg-slate-950 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-500 dark:text-secondary-500">
            {thesis.eyebrow}
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <h2 className="text-4xl font-bold leading-tight tracking-[-0.035em] text-slate-950 dark:text-white sm:text-5xl md:text-6xl">
              {thesis.title}
            </h2>
            <p className="text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              {thesis.body}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 dark:bg-slate-900/50 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-500 dark:text-secondary-500">
              {engine.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
              {engine.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              {engine.subtitle}
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-slate-300 dark:bg-slate-700 md:block" />
            <div className="relative grid gap-4 md:grid-cols-5 md:gap-3">
              {engine.steps.map((step, index) => (
                <article
                  key={step.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:bg-transparent md:shadow-none dark:md:bg-transparent"
                >
                  <div className={`relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 text-sm font-bold shadow-sm ${stepTone[step.status]}`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">{step.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-primary-400/30 bg-primary-500/10 px-5 py-4 text-sm font-bold text-primary-600 dark:text-primary-300">
              ← {engine.productSideLabel}
            </div>
            <div className="rounded-2xl border border-secondary-500/40 bg-secondary-500/10 px-5 py-4 text-right text-sm font-bold text-accent-700 dark:text-secondary-500">
              {engine.gtmSideLabel} →
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
