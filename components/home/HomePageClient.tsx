'use client'

import { HomeHero } from './HomeHero'
import { HomeRoleSelector } from './HomeRoleSelector'
import { HomeProofStrip } from './HomeProofStrip'
import { HomeForBusiness } from './HomeForBusiness'
import { HomeAnimatedSections } from './HomeAnimatedSections'
import { type TickerArticle } from '@/components/ui/ArticleTicker'

interface HomePageClientProps {
    tickerArticles: TickerArticle[]
}

/**
 * Homepage client wrapper - Neutral Router structure
 * hero (neutral) → entry points → proof strip → business (bajo) → ticker
 * Serves both blog readers and B2B prospects
 */
export function HomePageClient({ tickerArticles }: HomePageClientProps) {
    return (
        <>
            {/* Hero Section - Neutral dual CTA */}
            <HomeHero />

            {/* Role Selector - Entry points (Learn / Build) */}
            <HomeRoleSelector />

            {/* Proof Strip - Transversal (works for both) */}
            <HomeProofStrip />

            {/* For Business - Lower positioned, not aggressive */}
            <HomeForBusiness />

            {/* Ticker articoli in basso */}
            <HomeAnimatedSections
                shortlistColumns={[]}
                posts={[]}
                tickerArticles={tickerArticles}
            />
        </>
    )
}
