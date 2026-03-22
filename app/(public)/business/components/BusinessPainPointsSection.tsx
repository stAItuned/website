import { ClipboardCheck, FileSpreadsheet, MessageSquareMore, Workflow } from 'lucide-react'
import type { BusinessTranslations } from '@/lib/i18n/business-translations'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

const painIcons = [MessageSquareMore, FileSpreadsheet, Workflow, ClipboardCheck] as const

export function BusinessPainPointsSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,_#172033_0%,_#111827_100%)] py-14 text-white dark:bg-[linear-gradient(180deg,_#111827_0%,_#0F1117_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      <div className="mx-auto max-w-5xl px-4 xs:px-6">
        <div className="relative mb-8 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">{t.painPoints.eyebrow}</p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t.painPoints.title}
          </h2>
        </div>

        <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.painPoints.items.map((item, index) => {
            const Icon = painIcons[index]
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-300">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
