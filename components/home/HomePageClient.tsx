'use client'

import { HomeUrgencyBar } from './HomeUrgencyBar'
import { HomeHero } from './HomeHero'
import { HomeRoleSelector } from './HomeRoleSelector'
import { HomeWhyDifferent } from './HomeWhyDifferent'
import { HomeHowWeWork } from './HomeHowWeWork'
import { HomeAnimatedSections } from './HomeAnimatedSections'
import { type TickerArticle } from '@/components/ui/ArticleTicker'

interface HomePageClientProps {
    tickerArticles: TickerArticle[]
}

/**
 * Homepage client wrapper - Snella structure
 * urgency → hero + CTA → selector → perché noi → 3 fasi → ticker
 * Proof e articoli vanno su /aziende e /learn
 */
export function HomePageClient({ tickerArticles }: HomePageClientProps) {
    return (
        <>
            {/* Urgency Top Bar - scarsità reason-based */}
            <HomeUrgencyBar />

            {/* Hero Section - 10gg+4sett + CTA primaria */}
            <HomeHero />

            {/* Role Selector - redirect a /aziende o /learn */}
            <HomeRoleSelector />

            {/* Perché noi - 3 colonne (time-to-value, qualità, prodotto) */}
            <HomeWhyDifferent />

            {/* Percorso 3 fasi (assessment/pilot/scale) + CTA */}
            <HomeHowWeWork />

            {/* Ticker articoli in basso */}
            <HomeAnimatedSections
                shortlistColumns={[]}
                posts={[]}
                tickerArticles={tickerArticles}
            />
        </>
    )
}


