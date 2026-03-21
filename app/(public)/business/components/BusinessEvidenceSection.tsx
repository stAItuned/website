import type { BusinessTranslations } from '@/lib/i18n/business-translations'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

export function BusinessEvidenceSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-[#151925]">
      <div className="mx-auto max-w-5xl px-4 xs:px-6">
        <div className="max-w-3xl space-y-3">
          <BusinessSectionEyebrow>{t.evidence.eyebrow}</BusinessSectionEyebrow>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t.evidence.title}
          </h2>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{t.evidence.lead}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {t.evidence.items.map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
            >
              <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{item.value}</p>
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{item.label}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.note}</p>
              <a
                href={item.sourceHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-primary-500 hover:text-primary-600 dark:text-amber-300 dark:hover:text-amber-200"
              >
                {item.sourceLabel}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
