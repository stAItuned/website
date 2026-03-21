import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { BusinessTranslations } from '@/lib/i18n/business-translations'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

export function BusinessFaqSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 xs:px-6 lg:px-8 lg:py-18">
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
    </section>
  )
}

export function BusinessFinalCtaSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="bg-primary-500">
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-white xs:px-6 lg:px-8 lg:py-18">
        <p className="mx-auto max-w-3xl text-2xl font-bold tracking-tight xs:text-3xl">{t.finalCta.title}</p>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-primary-50">{t.finalCta.description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/meet"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-bold text-primary-600 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-100"
          >
            {t.finalCta.primaryCta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-white/10"
          >
            {t.finalCta.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
