import { PageTransition } from '@/components/ui/PageTransition'
import type { Metadata } from 'next'

// Section components
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import AIExpertSection from './components/AIExpertSection'
import JourneySection from './components/JourneySection'
import SocialProofSection from './components/SocialProofSection'
import ApplicationFormSection from './components/ApplicationFormSection'

// Existing components
import FAQ from './FAQ'
import PricingSection from './PricingSection'

import { CareerOSProvider } from './context/CareerOSContext'
import ApplicationModal from './components/modals/ApplicationModal'
import AuditModal from './components/modals/AuditModal'

export const metadata: Metadata = {
    title: 'Career OS — Il Percorso per Diventare GenAI Engineer | stAItuned',
    description: 'Smetti di mandare CV a vuoto. Career OS ti prepara per ruoli Applied GenAI in 4-8 settimane: Role-fit, CV ottimizzato, Proof pubblica, Interview prep. Da chi assume, non da career coach.',
}

/**
 * CareerOSPage - Main landing page for Career OS
 *
 * Structure (Optimized - 8 sections):
 * 1. HeroSection - Market urgency, hook stats, CTA
 * 2. ProblemSection - 3 pain cards
 * 3. AIExpertSection - Differentiator (who guides you)
 * 4. JourneySection - 8-week timeline with progressive disclosure
 * 5. SocialProofSection - Real proof items
 * 6. PricingSection - ROI + tiers
 * 7. FAQ - Consolidated (includes target audience + transparency info)
 * 8. ApplicationFormSection - Main conversion form
 */
export default function CareerOSPage() {
    return (
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
                    <ApplicationFormSection />
                </div>
                <ApplicationModal />
                <AuditModal />
            </CareerOSProvider>
        </PageTransition>
    )
}
