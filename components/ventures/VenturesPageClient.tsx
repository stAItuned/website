'use client'

import { useLearnLocale } from '@/lib/i18n'
import { FoundingGtmSection } from './FoundingGtmSection'
import { VentureEngineSection } from './VentureEngineSection'
import { VenturePortfolioSection } from './VenturePortfolioSection'
import { VenturePrinciplesSection } from './VenturePrinciplesSection'
import { VenturesHero } from './VenturesHero'
import { venturesContent } from './venturesContent'

/**
 * Localized composition for the public Ventures landing page.
 * Locale state is inherited from the site-wide LearnLocaleProvider.
 */
export function VenturesPageClient() {
  const { locale } = useLearnLocale()
  const copy = venturesContent[locale]

  return (
    <div className="overflow-hidden">
      <VenturesHero copy={copy.hero} />
      <VentureEngineSection thesis={copy.thesis} engine={copy.engine} />
      <VenturePortfolioSection copy={copy.portfolio} />
      <VenturePrinciplesSection copy={copy.principles} />
      <FoundingGtmSection bridge={copy.bridge} role={copy.role} />
    </div>
  )
}
