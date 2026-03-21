import { Clock3, Layers3, ShieldCheck, Users } from 'lucide-react'
import type { BusinessTranslations } from '@/lib/i18n/business-translations'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

const useCaseIcons = [Clock3, ShieldCheck, Layers3, Users] as const

export function BusinessUseCasesSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="border-t border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-[#0F1117]">
      <div className="mx-auto max-w-5xl px-4 xs:px-6 lg:py-2">
        <div className="max-w-2xl space-y-3">
          <BusinessSectionEyebrow>{t.useCases.eyebrow}</BusinessSectionEyebrow>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t.useCases.title}
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
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
    </section>
  )
}
