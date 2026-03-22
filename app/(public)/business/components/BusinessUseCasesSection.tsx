import Link from 'next/link'
import { ArrowRight, Clock3, Layers3, ShieldCheck, Users } from 'lucide-react'
import type { BusinessTranslations } from '@/lib/i18n/business-translations'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'
import { OpenBusinessRequestButton } from './OpenBusinessRequestButton'

const useCaseIcons = [Clock3, ShieldCheck, Layers3, Users] as const

export function BusinessUseCasesSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="border-t border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-[#0F1117]">
      <div className="mx-auto max-w-5xl px-4 xs:px-6 lg:py-2">
        <div className="max-w-3xl space-y-3">
          <BusinessSectionEyebrow>{t.useCases.eyebrow}</BusinessSectionEyebrow>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t.useCases.title}
          </h2>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{t.useCases.lead}</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <article className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-amber-300">
              {t.useCases.patternsTitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {t.useCases.patterns.map((pattern) => (
                <span
                  key={pattern}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                >
                  {pattern}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{t.useCases.closing}</p>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
          {t.useCases.items.map((item, index) => {
            const Icon = useCaseIcons[index] ?? Layers3

            return (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </div>
                </div>
              </article>
            )
          })}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {t.useCases.ctas.map((cta) => (
            <article
              key={cta.title}
              className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <p className="max-w-md text-lg font-bold leading-8 text-slate-900 dark:text-white">{cta.title}</p>
              <div className="mt-auto pt-5">
                <OpenBusinessRequestButton
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  {cta.action}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </OpenBusinessRequestButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
