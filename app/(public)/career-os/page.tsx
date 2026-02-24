import { PageTransition } from '@/components/ui/PageTransition'
import type { Metadata } from 'next'

// SEO Structured Data
import { JsonLd } from '@/components/seo/JsonLd'
import {
    generateCareerOSCourseSchema,
    generateCareerOSFAQSchema,
    generateCareerOSBreadcrumbSchema,
} from '@/lib/seo/career-os-seo'
import {
    careerOSTranslations,
    CAREER_OS_DEFAULT_LOCALE,
    CAREER_OS_QUERY_PARAM,
    normalizeCareerOSLocale,
} from '@/lib/i18n/career-os-translations'

// Section components
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import AIExpertSection from './components/AIExpertSection'
import JourneySection from './components/JourneySection'
import SocialProofSection from './components/SocialProofSection'
import CareerOSLocaleBootstrap from './components/CareerOSLocaleBootstrap'

// Existing components
import FAQ from './FAQ'
import PricingSection from './PricingSection'

import { CareerOSProvider } from './context/CareerOSContext'
import ApplicationModal from './components/modals/ApplicationModal'
import AuditModal from './components/modals/AuditModal'

// ============================================================================
// SEO Metadata - Optimized for Search & Social
// ============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com'
const OG_IMAGE = '/assets/career-os/career_os_original.png'
export const dynamic = 'force-dynamic'

export async function generateMetadata({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
    const params = (await searchParams) ?? {}
    const langParam = Array.isArray(params[CAREER_OS_QUERY_PARAM])
        ? params[CAREER_OS_QUERY_PARAM][0]
        : params[CAREER_OS_QUERY_PARAM]

    const locale = normalizeCareerOSLocale(langParam)
    const t = careerOSTranslations[locale].meta

    return {
        title: t.title,
        description: t.description,
        keywords: t.keywords,
        openGraph: {
            type: 'website',
            locale: t.openGraphLocale,
            url: `${SITE_URL}/career-os?lang=${locale}`,
            siteName: 'stAI tuned',
            title: t.title,
            description: t.description,
            images: [
                {
                    url: OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: t.imageAlt,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t.title,
            description: t.description,
            images: [OG_IMAGE],
        },
        alternates: {
            canonical: `${SITE_URL}/career-os`,
            languages: {
                it: `${SITE_URL}/career-os?lang=it`,
                en: `${SITE_URL}/career-os?lang=en`,
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}


/**
 * CareerOSPage - Main landing page for Career OS
 *
 * Structure (Optimized - 7 sections):
 * 1. HeroSection - Market urgency, hook stats, CTA
 * 2. ProblemSection - 3 pain cards
 * 3. AIExpertSection - Differentiator (who guides you)
 * 4. SocialProofSection - Real proof items
 * 5. JourneySection - 8-week timeline with progressive disclosure
 * 6. PricingSection - ROI + tiers
 * 7. FAQ - Consolidated (includes target audience + transparency info)
 */
export default async function CareerOSPage({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
    const params = (await searchParams) ?? {}
    const langParam = Array.isArray(params[CAREER_OS_QUERY_PARAM])
        ? params[CAREER_OS_QUERY_PARAM][0]
        : params[CAREER_OS_QUERY_PARAM]
    const locale = normalizeCareerOSLocale(langParam ?? CAREER_OS_DEFAULT_LOCALE)

    return (
        <>
            {/* SEO Structured Data (JSON-LD) */}
            <JsonLd data={generateCareerOSCourseSchema(locale)} />
            <JsonLd data={generateCareerOSFAQSchema(locale)} />
            <JsonLd data={generateCareerOSBreadcrumbSchema(locale)} />

            <PageTransition>
                <CareerOSProvider>
                    <CareerOSLocaleBootstrap />
                    <div className="min-h-screen bg-white dark:bg-[#0F1117]">
                        <HeroSection locale={locale} />
                        <ProblemSection locale={locale} />
                        <AIExpertSection locale={locale} />
                        <SocialProofSection locale={locale} />
                        <JourneySection locale={locale} />
                        <PricingSection locale={locale} />
                        <FAQ locale={locale} />
                    </div>
                    <ApplicationModal locale={locale} />
                    <AuditModal locale={locale} />
                </CareerOSProvider>
            </PageTransition>
        </>
    )
}
