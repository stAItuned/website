import type { VenturesCopy, VentureEngineStatus } from './venturesContent'

interface VentureEngineSectionProps {
  engine: VenturesCopy['engine']
}

const stepTone: Record<VentureEngineStatus, string> = {
  existing:
    'border-primary-300/40 bg-primary-300/10 text-primary-600 dark:border-primary-400/40 dark:bg-primary-400/10 dark:text-primary-300',
  focus:
    'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300',
  next:
    'border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
}

export function VentureEngineSection({ engine }: VentureEngineSectionProps) {
  return (
    <section className="border-y border-slate-200 bg-slate-50 px-4 py-14 dark:border-slate-800 dark:bg-slate-900/50 md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-300/20 bg-primary-300/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden />
            {engine.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            {engine.title}
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            {engine.subtitle}
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {engine.steps.map((step, index) => (
            <article
              key={step.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold ${stepTone[step.status]}`}
              >
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{step.label}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider">
          <span className="text-primary-600 dark:text-primary-300">{engine.productSideLabel}</span>
          <span className="text-slate-300 dark:text-slate-600" aria-hidden>→</span>
          <span className="text-amber-700 dark:text-amber-300">{engine.gtmSideLabel}</span>
        </div>
      </div>
    </section>
  )
}
