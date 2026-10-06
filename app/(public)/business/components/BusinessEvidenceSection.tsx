import type { BusinessTranslations } from '@/lib/i18n/business-translations'
import { Button } from '@/components/ui/Button'
import { Link } from 'lucide-react'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

export function BusinessEvidenceSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-amber-50/70 to-slate-50 py-14 dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(255,242,114,0.06)_0%,rgba(21,25,37,1)_55%)]">
      <div className="mx-auto max-w-5xl px-4 xs:px-6">
        <div className="max-w-2xl space-y-3">
          <BusinessSectionEyebrow>{t.evidence.eyebrow}</BusinessSectionEyebrow>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t.evidence.title}
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{t.evidence.lead}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {t.evidence.items.map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
            >
              <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{item.value}</p>
              <h3 className="mt-3 text-base font-bold leading-6 text-slate-900 dark:text-white">{item.label}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.note}</p>
<Button as="a" href={item.sourceHref} target="_blank" rel="noreferrer"
  variant="secondary" className="mt-4 text-xs font-semibold uppercase tracking-[0.16em]">
  <Link className="h-3 w-3 mr-1" aria-hidden />{item.sourceLabel}
</Button>
            </article>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-base font-medium leading-7 text-slate-700 dark:text-slate-200">
          {t.evidence.closing}
        </p>
      </div>
    </section>
  )
}
