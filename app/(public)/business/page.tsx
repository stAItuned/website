import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { JsonLd } from '@/components/seo/JsonLd'
import { BRAND } from '@/lib/brand'
import {
  BUSINESS_QUERY_PARAM,
  businessTranslations,
  normalizeBusinessLocale,
} from '@/lib/i18n/business-translations'
import { generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from '@/lib/seo/seo-schemas'
import { BusinessCurrentStateSection } from './components/BusinessCurrentStateSection'
import { BusinessEvidenceSection } from './components/BusinessEvidenceSection'
import { BusinessFaqSection, BusinessFinalCtaSection } from './components/BusinessFaqAndCtaSections'
import { BusinessHeroSection } from './components/BusinessHeroSection'
import { BusinessImpactSection } from './components/BusinessImpactSection'
import { BusinessPainPointsSection } from './components/BusinessPainPointsSection'
import { BusinessRequestSection } from './components/BusinessRequestSection'
import { BusinessUseCasesSection } from './components/BusinessUseCasesSection'
import { BusinessWorkflowSection } from './components/BusinessWorkflowSection'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = (await searchParams) ?? {}
  const langParam = Array.isArray(params[BUSINESS_QUERY_PARAM])
    ? params[BUSINESS_QUERY_PARAM][0]
    : params[BUSINESS_QUERY_PARAM]
  const locale = normalizeBusinessLocale(langParam)
  const t = businessTranslations[locale]

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    alternates: {
      canonical: `${SITE_URL}/business`,
      languages: {
        it: `${SITE_URL}/business?lang=it`,
        en: `${SITE_URL}/business?lang=en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: t.meta.openGraphLocale,
      url: `${SITE_URL}/business?lang=${locale}`,
      siteName: BRAND.name,
      title: t.meta.title,
      description: t.meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function BusinessPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) ?? {}
  const langParam = Array.isArray(params[BUSINESS_QUERY_PARAM])
    ? params[BUSINESS_QUERY_PARAM][0]
    : params[BUSINESS_QUERY_PARAM]
  const locale = normalizeBusinessLocale(langParam)
  const t = businessTranslations[locale]

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t.breadcrumb.home, url: '/' },
    { name: t.breadcrumb.business, url: `/business?lang=${locale}` },
  ])

  const faqSchema = generateFAQSchema(
    t.faq.items.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  )

  const serviceSchema = generateServiceSchema({
    name: t.meta.title,
    description: t.meta.description,
    url: `/business?lang=${locale}`,
    serviceType: 'Business process automation',
  })

  return (
    <PageTransition>
      <main className="min-h-screen bg-white text-slate-900 dark:bg-[#0F1117] dark:text-white">
        <JsonLd data={breadcrumbSchema} />
        <JsonLd data={faqSchema} />
        <JsonLd data={serviceSchema} />

        <BusinessHeroSection t={t} />
        <BusinessEvidenceSection t={t} />
        <BusinessPainPointsSection t={t} />
        <BusinessCurrentStateSection t={t} locale={locale} />
        <BusinessWorkflowSection t={t} locale={locale} />
        <BusinessUseCasesSection t={t} />
        <BusinessRequestSection t={t} locale={locale} />
        <BusinessImpactSection t={t} />
        <BusinessFaqSection t={t} />
        <BusinessFinalCtaSection t={t} />
      </main>
    </PageTransition>
  )
}
