'use client'

import { useMemo, useState } from 'react'
import type { AiEuActLocale, AiEuActTranslations } from '@/lib/i18n/ai-eu-act-translations'

interface PracticalStepsInteractiveProps {
  title: string
  subtitle: string
  steps: AiEuActTranslations['practicalSteps']['items']
  locale: AiEuActLocale
}

export default function PracticalStepsInteractive({
  title,
  subtitle,
  steps,
  locale,
}: PracticalStepsInteractiveProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeStep = steps[activeIndex]
  const progress = useMemo(() => {
    if (steps.length === 0) return 0
    return Math.round(((activeIndex + 1) / steps.length) * 100)
  }, [activeIndex, steps.length])

  const labels =
    locale === 'en'
      ? {
        sectionAria: '90-day operational steps',
        stepAriaPrefix: 'Open step',
        progressLabel: 'Progress',
      }
      : {
        sectionAria: 'Passaggi operativi 90 giorni',
        stepAriaPrefix: 'Apri passaggio',
        progressLabel: 'Avanzamento',
      }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6" aria-label={labels.sectionAria}>
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-300">{subtitle}</p>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${labels.stepAriaPrefix} ${step.title}`}
                  aria-current={isActive ? 'step' : undefined}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${isActive
                    ? 'border-amber-400/70 bg-amber-500/10'
                    : 'border-white/10 bg-slate-800/70 hover:border-amber-400/40'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isActive ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-200'
                        }`}
                    >
                      {index + 1}
                    </span>
                    <span className={`text-sm font-semibold ${isActive ? 'text-amber-200' : 'text-white'}`}>{step.title}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
              <span>{labels.progressLabel}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-700">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4" key={activeStep?.title}>
              <h3 className="text-base font-semibold text-white">{activeStep?.title}</h3>
              <p className="mt-2 text-sm text-slate-200">{activeStep?.outcome}</p>
              <p className="mt-2 text-sm text-slate-300">{activeStep?.action}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
