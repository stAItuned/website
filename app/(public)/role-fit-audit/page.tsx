import type { Metadata } from 'next'
import { Suspense } from 'react'
import PromoCodeGate from './components/PromoCodeGate'
import { CareerOSProvider } from '../career-os/context/CareerOSContext'
import AuditModal from '../career-os/components/modals/AuditModal'
import AuditLoading from './components/AuditLoading'
import { RoleFitHowItWorks } from './_components/RoleFitHowItWorks'
import { RoleFitMiniFAQ } from './_components/RoleFitMiniFAQ'
import { MarketEvidence } from './_components/MarketEvidence'
import RoleFitLocaleToggle from './components/RoleFitLocaleToggle'
import {
  normalizeRoleFitLocale,
  ROLE_FIT_DEFAULT_LOCALE,
  roleFitAuditTranslations,
  ROLE_FIT_QUERY_PARAM,
} from '@/lib/i18n/role-fit-audit-translations'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com'

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = (await searchParams) ?? {}
  const langParam = Array.isArray(params[ROLE_FIT_QUERY_PARAM])
    ? params[ROLE_FIT_QUERY_PARAM][0]
    : params[ROLE_FIT_QUERY_PARAM]

  const locale = normalizeRoleFitLocale(langParam)
  const t = roleFitAuditTranslations[locale].meta

  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    openGraph: {
      type: 'website',
      locale: t.openGraphLocale,
      url: `${SITE_URL}/role-fit-audit?lang=${locale}`,
      siteName: 'stAItuned',
      title: t.title,
      description: t.description,
      images: [
        {
          url: '/assets/role-fit-audit/role-fit-audit-logo.png',
          width: 1200,
          height: 630,
          alt: t.imageAlt,
        },
      ],
    },
    alternates: {
      canonical: `${SITE_URL}/role-fit-audit`,
      languages: {
        it: `${SITE_URL}/role-fit-audit?lang=it`,
        en: `${SITE_URL}/role-fit-audit?lang=en`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RoleFitAuditPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) ?? {}
  const langParam = Array.isArray(params[ROLE_FIT_QUERY_PARAM])
    ? params[ROLE_FIT_QUERY_PARAM][0]
    : params[ROLE_FIT_QUERY_PARAM]
  const locale = normalizeRoleFitLocale(langParam ?? ROLE_FIT_DEFAULT_LOCALE)
  const t = roleFitAuditTranslations[locale]

  return (
    <CareerOSProvider>
      <main className="min-h-screen bg-slate-50 dark:bg-[#0F1117]">
        <section className="relative text-white pt-24 md:pt-28 pb-16 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

          <div className="absolute top-1/3 left-1/6 w-72 h-72 bg-red-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-[#FFF272]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/6 w-40 h-40 bg-[#F59E0B]/15 rounded-full blur-2xl" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="flex justify-center mb-6">
              <RoleFitLocaleToggle locale={locale} />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-sm font-semibold text-red-300">{t.hero.badge}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {t.hero.titlePrefix}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">{t.hero.titleAccent}</span>{' '}
              {t.hero.titleSuffix}
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mx-auto mb-8" style={{ maxWidth: '45rem' }}>
              {t.hero.subtitle}
            </p>

            <MarketEvidence locale={locale} />

            <div className="flex justify-center mb-10">
              <a
                href="#start-audit"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-red-400 hover:to-rose-500 active:scale-95 ring-4 ring-red-500/20"
              >
                {t.hero.cta}
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 border-t border-slate-700/50 pt-6 max-w-2xl mx-auto">
              {t.hero.trustSignals.map((item) => (
                <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <RoleFitHowItWorks locale={locale} />

        <section id="start-audit" className="py-12 md:py-16 px-4">
          <Suspense fallback={<AuditLoading locale={locale} />}>
            <PromoCodeGate locale={locale} />
          </Suspense>
          <RoleFitMiniFAQ locale={locale} />
        </section>
      </main>
      <AuditModal locale={locale} />
    </CareerOSProvider>
  )
}
