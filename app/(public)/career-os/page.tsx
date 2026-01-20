import { PageTransition } from '@/components/ui/PageTransition'
import type { Metadata } from 'next'

// SEO Structured Data
import { JsonLd } from '@/components/seo/JsonLd'
import {
    generateCareerOSCourseSchema,
    generateCareerOSFAQSchema,
    generateCareerOSBreadcrumbSchema,
} from '@/lib/seo/career-os-seo'

// Section components
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import AIExpertSection from './components/AIExpertSection'
import JourneySection from './components/JourneySection'
import SocialProofSection from './components/SocialProofSection'

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

export const metadata: Metadata = {
    title: 'Career OS, Il Percorso per Diventare GenAI Engineer | stAItuned',
    description: 'Smetti di mandare CV a vuoto. Career OS ti prepara per ruoli Applied GenAI in 4-8 settimane: Role-fit, CV ottimizzato, Proof pubblica, Interview prep. Da chi assume, non da career coach.',
    keywords: [
        'GenAI Engineer',
        'Career mentoring AI',
        'corso AI Italia',
        'Applied GenAI',
        'RAG engineer',
        'AI career',
        'mentorship AI',
        'diventare AI engineer',
        'lavoro intelligenza artificiale',
    ],
    openGraph: {
        type: 'website',
        locale: 'it_IT',
        url: `${SITE_URL}/career-os`,
        siteName: 'stAItuned',
        title: 'Career OS, Diventa GenAI Engineer in 4-8 Settimane',
        description: 'Il percorso pratico per entrare nel mondo GenAI. Non un corso: un sistema operativo per la tua carriera AI. Costruisci CV, Proof GitHub e Interview Skills.',
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: 'Career OS - Sistema per Diventare GenAI Engineer',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Career OS, Diventa GenAI Engineer',
        description: 'Il percorso pratico per ruoli Applied GenAI in Italia. 4-8 settimane per trasformare la tua carriera.',
        images: [OG_IMAGE],
    },
    alternates: {
        canonical: `${SITE_URL}/career-os`,
    },
    robots: {
        index: true,
        follow: true,
    },
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
export default function CareerOSPage() {
    return (
        <>
            {/* SEO Structured Data (JSON-LD) */}
            <JsonLd data={generateCareerOSCourseSchema()} />
            <JsonLd data={generateCareerOSFAQSchema()} />
            <JsonLd data={generateCareerOSBreadcrumbSchema()} />

            <PageTransition>
                <CareerOSProvider>
                    <div className="min-h-screen bg-white dark:bg-[#0F1117]">
                        <HeroSection />
                        <ProblemSection />
                        <AIExpertSection />
                        <SocialProofSection />
                        <JourneySection />
                        <PricingSection />
                        <FAQ />
                    </div>
                    <ApplicationModal />
                    <AuditModal />
                </CareerOSProvider>
            </PageTransition>
        </>
    )
}
