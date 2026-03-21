import { ClipboardCheck, FileSpreadsheet, MessageSquareMore, Workflow } from 'lucide-react'
import type { BusinessTranslations } from '@/lib/i18n/business-translations'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

const painIcons = [MessageSquareMore, FileSpreadsheet, Workflow, ClipboardCheck] as const

export function BusinessPainPointsSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="bg-slate-50 py-14 dark:bg-[#151925]">
      <div className="mx-auto max-w-5xl px-4 xs:px-6">
        <div className="mb-8 max-w-2xl space-y-3">
          <BusinessSectionEyebrow>{t.painPoints.eyebrow}</BusinessSectionEyebrow>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t.painPoints.title}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.painPoints.items.map((item, index) => {
            const Icon = painIcons[index]
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1A1E3B]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-300">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
