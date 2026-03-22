import { ArrowRight } from 'lucide-react'
import type { BusinessTranslations } from '@/lib/i18n/business-translations'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'
import { OpenBusinessRequestButton } from './OpenBusinessRequestButton'

export function BusinessFaqSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="bg-slate-50/85 py-16 dark:bg-[#151925] lg:py-18">
      <div className="mx-auto max-w-5xl px-4 xs:px-6 lg:px-8">
        <div className="mb-8 space-y-3 text-center">
          <BusinessSectionEyebrow>{t.faq.eyebrow}</BusinessSectionEyebrow>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white xs:text-3xl">{t.faq.title}</h2>
        </div>
        <div className="grid gap-4">
          {t.faq.items.map((item) => (
            <article
              key={item.question}
              className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BusinessFinalCtaSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="bg-[linear-gradient(180deg,_#4a4f90_0%,_#3f457f_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-14 xs:px-6 lg:px-8 lg:py-16">
        <div className="rounded-[2rem] border border-white/15 bg-white/[0.04] px-6 py-10 text-center text-white backdrop-blur-sm sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Demo finale</p>
          <p className="mx-auto mt-3 max-w-3xl text-2xl font-black tracking-tight xs:text-3xl">{t.finalCta.title}</p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-primary-50">{t.finalCta.description}</p>

          <div className="mt-8 flex justify-center">
          <OpenBusinessRequestButton
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-black tracking-tight text-slate-900 shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-50"
          >
            {t.finalCta.primaryCta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </OpenBusinessRequestButton>
          </div>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-primary-100/90">
            Nessuna call generica: partiamo dal processo che vuoi rivedere e dal punto in cui oggi si spezza.
          </p>
        </div>
      </div>
    </section>
  )
}
