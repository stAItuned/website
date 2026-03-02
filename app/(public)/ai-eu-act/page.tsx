import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageTransition } from '@/components/ui/PageTransition'
import AiEuActLocaleToggle from './components/AiEuActLocaleToggle'
import AiEuActLeadForm from './components/AiEuActLeadForm'
import ToolkitPreviewTabs from './components/ToolkitPreviewTabs'
import PracticalStepsInteractive from './components/PracticalStepsInteractive'
import {
  aiEuActTranslations,
  AI_EU_ACT_DEFAULT_LOCALE,
  AI_EU_ACT_QUERY_PARAM,
  normalizeAiEuActLocale,
} from '@/lib/i18n/ai-eu-act-translations'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com'

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = (await searchParams) ?? {}
  const langParam = Array.isArray(params[AI_EU_ACT_QUERY_PARAM])
    ? params[AI_EU_ACT_QUERY_PARAM][0]
    : params[AI_EU_ACT_QUERY_PARAM]
  const locale = normalizeAiEuActLocale(langParam)
  const t = aiEuActTranslations[locale].meta

  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: {
      canonical: `${SITE_URL}/ai-eu-act`,
      languages: {
        it: `${SITE_URL}/ai-eu-act?lang=it`,
        en: `${SITE_URL}/ai-eu-act?lang=en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: t.openGraphLocale,
      url: `${SITE_URL}/ai-eu-act?lang=${locale}`,
      siteName: 'stAItuned',
      title: t.title,
      description: t.description,
      images: [
        {
          url: '/assets/general/logo-text-dark.png',
          width: 1200,
          height: 630,
          alt: t.imageAlt,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function AiEuActPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) ?? {}
  const langParam = Array.isArray(params[AI_EU_ACT_QUERY_PARAM])
    ? params[AI_EU_ACT_QUERY_PARAM][0]
    : params[AI_EU_ACT_QUERY_PARAM]
  const locale = normalizeAiEuActLocale(langParam ?? AI_EU_ACT_DEFAULT_LOCALE)
  const t = aiEuActTranslations[locale]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: t.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <PageTransition>
      <JsonLd data={faqSchema} />
      <main className="min-h-screen bg-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900 pt-24 pb-12 text-white md:pt-28 md:pb-16">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="absolute left-1/4 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 inline-flex rounded-full border border-amber-400/50 bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-400">
                {t.hero.badge}
              </p>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">{t.hero.title}</h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">{t.hero.subtitle}</p>
              <a
                href="#lead-form"
                className="mt-7 inline-flex rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-7 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-amber-500/30"
              >
                {t.hero.cta}
              </a>
              <p className="mx-auto mt-5 max-w-2xl text-xs text-slate-300">{t.hero.trustLine}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <div className="flex justify-center sm:justify-end">
            <AiEuActLocaleToggle locale={locale} t={t.localeToggle} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
            <h2 className="text-2xl font-bold text-white md:text-3xl">{t.whyNow.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{t.whyNow.subtitle}</p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300">{t.whyNow.metricsTitle}</h3>
                <div className="mt-3 space-y-3">
                  {t.whyNow.metrics.map((metric) => (
                    <article key={metric.value} className="rounded-lg border border-emerald-400/20 bg-slate-800/80 p-4">
                      <p className="text-2xl font-black text-emerald-300">{metric.value}</p>
                      <p className="mt-1 text-sm text-slate-200">{metric.label}</p>
                      <a
                        href={metric.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 transition hover:border-emerald-300 hover:text-emerald-200"
                      >
                        {t.whyNow.sourcePrefix}: {metric.sourceLabel} ↗
                      </a>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-300">{t.whyNow.painsTitle}</h3>
                <div className="mt-3 space-y-3">
                  {t.whyNow.pains.map((pain) => (
                    <article key={pain.title} className="rounded-lg border border-amber-400/20 bg-slate-800/80 p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <h4 className="text-sm font-semibold text-white">{pain.title}</h4>
                      </div>
                      <p className="mt-1 text-sm text-slate-200">{pain.description}</p>
                      <p className="mt-2 text-xs font-medium text-amber-300">{pain.risk}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <PracticalStepsInteractive
          title={t.practicalSteps.title}
          subtitle={t.practicalSteps.subtitle}
          steps={t.practicalSteps.items}
          locale={locale}
        />

        <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <aside className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <h2 className="text-xl font-bold text-white">{t.unlockOffer.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{t.unlockOffer.subtitle}</p>
              <ul className="mt-4 space-y-2">
                {t.unlockOffer.items.map((item) => (
                  <li key={item} className="rounded-lg border border-white/10 bg-slate-800/70 px-3 py-2 text-sm text-slate-200">
                    {item}
                  </li>
                ))}
              </ul>
            </aside>

            <div id="lead-form" className="scroll-mt-24">
              <AiEuActLeadForm t={t.form} locale={locale} />
            </div>
          </div>
        </section>

        <ToolkitPreviewTabs
          title={t.toolkitPreviewTabs.title}
          subtitle={t.toolkitPreviewTabs.subtitle}
          unlockMessage={t.toolkitPreviewTabs.unlockMessage}
          cta={t.toolkitPreviewTabs.cta}
          ui={t.toolkitPreviewTabs.ui}
          resources={t.toolkitPreviewTabs.tabs}
        />

        <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <h2 className="text-2xl font-bold text-white">{t.faqTitle}</h2>
          <div className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10 bg-slate-900/40">
            {t.faqItems.map((item) => (
              <details key={item.question} className="group px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-semibold text-white group-open:text-amber-300">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-14 text-center sm:px-6">
          <p className="text-sm text-slate-300">
            {t.finalCta.prefix}{' '}
            <Link href={`/ai-eu-act/risorse?lang=${locale}`} className="font-semibold text-amber-400 underline underline-offset-4">
              {t.finalCta.button}
            </Link>
          </p>
        </section>
      </main>
    </PageTransition>
  )
}
