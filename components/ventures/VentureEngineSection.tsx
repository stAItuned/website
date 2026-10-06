import type { VenturesCopy, VentureEngineStatus } from './venturesContent'

interface VentureEngineSectionProps {
  thesis: VenturesCopy['thesis']
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

function SectionBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary-300/20 bg-primary-300/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden />
      {children}
    </span>
  )
}

export function VentureEngineSection({ thesis, engine }: VentureEngineSectionProps) {
  return (
    <>
      <section className="border-b border-slate-200 bg-white px-4 py-16 dark:border-slate-800 dark:bg-slate-950 md:px-6 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <SectionBadge>{thesis.eyebrow}</SectionBadge>
          <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl">
            {thesis.title}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
            {thesis.body}
          </p>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 dark:bg-slate-900/50 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge>{engine.eyebrow}</SectionBadge>
            <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              {engine.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
              {engine.subtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {engine.steps.map((step, index) => (
              <article
                key={step.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold ${stepTone[step.status]}`}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-primary-300/30 bg-primary-300/10 px-5 py-4 text-sm font-bold text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
              ← {engine.productSideLabel}
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 md:text-right">
              {engine.gtmSideLabel} →
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
