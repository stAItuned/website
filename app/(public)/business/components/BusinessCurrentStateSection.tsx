import type { BusinessLocale, BusinessTranslations } from '@/lib/i18n/business-translations'
import { AsIsInfographic } from '@/components/business/AsIsInfographic'
import { ToBeInfographic } from '@/components/business/ToBeInfographic'
import { BusinessBeforeAfterToggle } from './BusinessBeforeAfterToggle'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

export function BusinessCurrentStateSection({
  t,
  locale,
}: {
  t: BusinessTranslations
  locale: BusinessLocale
}) {
  return (
    <section className="bg-slate-50/80 py-14 dark:bg-[#151925] lg:py-16">
      <div className="mx-auto max-w-5xl px-4 xs:px-6">
        <div className="max-w-3xl space-y-3">
          <BusinessSectionEyebrow>{t.currentState.eyebrow}</BusinessSectionEyebrow>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t.currentState.title}
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{t.currentState.lead}</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <article className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm dark:border-amber-500/20 dark:bg-amber-500/8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
              {t.currentState.chaoticLabel}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{t.currentState.chaoticBody}</p>
          </article>

          <article className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              {t.currentState.centralizedLabel}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{t.currentState.centralizedBody}</p>
          </article>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {t.currentState.centralizedPoints.slice(0, 3).map((point) => (
            <span
              key={point}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {point}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-5">
          <BusinessBeforeAfterToggle
            eyebrow={t.comparison.eyebrow}
            title={t.comparison.title}
            description={
              locale === 'it'
                ? 'Prima le rotture. Poi lo stesso flusso, già ricomposto.'
                : 'First the breakpoints. Then the same flow, already rebuilt.'
            }
            transitionCue={t.currentState.transitionCue}
            beforeLabel={t.currentState.chaoticLabel}
            afterLabel={t.currentState.centralizedLabel}
            beforePanel={<AsIsInfographic locale={locale} />}
            afterPanel={<ToBeInfographic locale={locale} />}
          />
        </div>
      </div>
    </section>
  )
}
