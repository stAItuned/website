import type { BusinessLocale, BusinessTranslations } from '@/lib/i18n/business-translations'
import { AsIsInfographic } from '@/components/business/AsIsInfographic'
import { ToBeInfographic } from '@/components/business/ToBeInfographic'
import { BusinessBeforeAfterToggle } from './BusinessBeforeAfterToggle'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

function UseCaseIntroCard({ t }: { t: BusinessTranslations }) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(255,247,168,0.38)_100%)] p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-[linear-gradient(135deg,rgba(26,30,59,1)_0%,rgba(15,17,23,1)_100%)]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-amber-300 via-primary-400 to-primary-600" />
      <div className="relative pl-2">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-600 dark:text-amber-300">
          {t.currentState.exampleLabel}
        </p>
        <h3 className="mt-3 max-w-3xl text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {t.currentState.exampleTitle}
        </h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-[15px]">
          {t.currentState.exampleBody}
        </p>
      </div>
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
    <section className="bg-slate-50/80 py-14 dark:bg-[#151925] lg:py-16">
      <div className="mx-auto max-w-5xl px-4 xs:px-6">
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

        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-5">
          <BusinessBeforeAfterToggle
            eyebrow={t.comparison.eyebrow}
            title={t.comparison.title}
            description={
              locale === 'it'
                ? 'Un solo stato visibile alla volta, per leggere il cambiamento senza rumore.'
                : 'One state at a time, so the change is clear without visual noise.'
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
