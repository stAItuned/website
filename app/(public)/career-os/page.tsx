import { PageTransition } from '@/components/ui/PageTransition'
import type { Metadata } from 'next'

// Section components
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import AIExpertSection from './components/AIExpertSection'
import JourneySection from './components/JourneySection'
import SocialProofSection from './components/SocialProofSection'
import TargetAudienceSection from './components/TargetAudienceSection'
import TransparencySection from './components/TransparencySection'
import FinalCTASection from './components/FinalCTASection'
import ApplicationFormSection from './components/ApplicationFormSection'

// Existing components
import FAQ from './FAQ'
import PricingSection from './PricingSection'

export const metadata: Metadata = {
    title: 'Career OS — Il Percorso per Diventare GenAI Engineer | stAItuned',
    description: 'Smetti di mandare CV a vuoto. Career OS ti prepara per ruoli Applied GenAI in 4-8 settimane: Role-fit, CV ottimizzato, Proof pubblica, Interview prep. Da chi assume, non da career coach.',
}

/**
 * CareerOSPage - Main landing page for Career OS
 *
 * Structure (Optimized for conversion):
 * 1. HeroSection - Stats, pain/solution, CTA above fold
 * 2. ProblemSection - 3 pain cards (why you fail)
 * 3. AIExpertSection - Differentiator (who guides you)
 * 4. JourneySection - Unified 8-week timeline with checkpoints
 * 5. SocialProofSection - Beta stats & future testimonials
 * 6. TargetAudienceSection - Chi è per / Chi non è per
 * 7. PricingSection - ROI + tiers
 * 8. TransparencySection - Cosa NON è (reduced)
 * 9. FAQ - Expanded accordion
 * 10. ApplicationFormSection - Main conversion form
 * 11. FinalCTASection - Final CTA with urgency
 */
export default function CareerOSPage() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-[#0F1117]">
                <HeroSection />
                <ProblemSection />
                <AIExpertSection />
                <JourneySection />
                <SocialProofSection />
                <TargetAudienceSection />
                <PricingSection />
                <TransparencySection />
                <FAQ />
                <ApplicationFormSection />
                <FinalCTASection />
            </div>
        </PageTransition>
    )
}
