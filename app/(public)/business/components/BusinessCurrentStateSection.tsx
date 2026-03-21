import type { BusinessLocale, BusinessTranslations } from '@/lib/i18n/business-translations'
import { AsIsInfographic } from '@/components/business/AsIsInfographic'
import { ToBeInfographic } from '@/components/business/ToBeInfographic'
import { BusinessBeforeAfterToggle } from './BusinessBeforeAfterToggle'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

function UseCaseIntroCard({ t }: { t: BusinessTranslations }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1A1E3B]">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-500 dark:text-amber-300">
        {t.currentState.exampleLabel}
      </p>
      <h3 className="mt-3 text-xl font-black tracking-tight text-slate-900 dark:text-white">{t.currentState.exampleTitle}</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{t.currentState.exampleBody}</p>
    </article>
  )
}

export function BusinessCurrentStateSection({
  t,
  locale,
}: {
  t: BusinessTranslations
  locale: BusinessLocale
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 xs:px-6 lg:py-16">
      <div className="max-w-3xl space-y-3">
        <BusinessSectionEyebrow>{t.currentState.eyebrow}</BusinessSectionEyebrow>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {t.currentState.title}
        </h2>
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{t.currentState.lead}</p>
      </div>

      <div className="mt-8">
        <UseCaseIntroCard t={t} />
      </div>

      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mb-5 max-w-2xl space-y-2">
          <BusinessSectionEyebrow>{t.comparison.eyebrow}</BusinessSectionEyebrow>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{t.comparison.title}</h3>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            {locale === 'it'
              ? 'Un solo stato visibile alla volta, per leggere il cambiamento senza rumore.'
              : 'One state at a time, so the change is clear without visual noise.'}
          </p>
        </div>

        <BusinessBeforeAfterToggle
          beforeLabel={t.currentState.chaoticLabel}
          afterLabel={t.currentState.centralizedLabel}
          beforePanel={<AsIsInfographic locale={locale} />}
          afterPanel={<ToBeInfographic locale={locale} />}
        />
      </div>
    </section>
  )
}
