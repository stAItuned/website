'use client'

import { useState, useEffect, useCallback } from 'react'
import { contributeTranslations, ContributeLanguage } from '@/lib/i18n/contribute-translations'
import { useLearnLocale } from '@/lib/i18n'
import { useAuth } from '@/components/auth/AuthContext'
import { Contribution } from '@/lib/types/contributor'

// Section components
import {
    HeroSection,
    EvidenceSection,
    ValuePropsSection,
    PillarsSection,
    PathCardsSection,
    ResumeSection
} from './sections'

/**
 * ContributePageClient - Landing page for the contribution program.
 * 
 * Refactored to use modular section components:
 * - HeroSection: Main hero with title, pain stat, and CTA
 * - EvidenceSection: Statistics with sources
 * - ValuePropsSection: Contributor benefits
 * - PillarsSection: Core principles
 * - PathCardsSection: Contribution path options
 * - ResumeSection: Draft contribution cards
 */
export default function ContributePageClient() {
    const { locale } = useLearnLocale()
    const { user } = useAuth()
    const [drafts, setDrafts] = useState<Contribution[]>([])

    const fetchTokenAndLoad = useCallback(async () => {
        if (!user) return
        try {
            const token = await user.getIdToken()
            const res = await fetch('/api/contributor/get-progress', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json = await res.json()
            if (json.success && json.contributions) {
                setDrafts(json.contributions.filter((c: Contribution) => c.status !== 'published' && c.status !== 'scheduled').slice(0, 3))
            }
        } catch (e) { console.error(e) }
    }, [user])

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void fetchTokenAndLoad()
        }, 0)
        return () => window.clearTimeout(timer)
    }, [fetchTokenAndLoad])

    const lang = locale as ContributeLanguage
    const t = contributeTranslations[lang].landing

    // Build path configuration
    const paths = [
        {
            key: 'autonomy',
            icon: '⚡️',
            color: 'from-amber-400 to-orange-500',
            ...t.paths.autonomy
        },
        {
            key: 'guided',
            icon: '🧭',
            color: 'from-blue-400 to-indigo-500',
            ...t.paths.guided
        },
        {
            key: 'interview',
            icon: '🎙️',
            color: 'from-emerald-400 to-teal-500',
            ...t.paths.interview
        }
    ]

    const [suggestedPath, setSuggestedPath] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            <HeroSection
                translations={t.hero as any}
                paths={t.paths}
                lang={lang}
                hasDrafts={drafts.length > 0}
            />

            <ResumeSection drafts={drafts} lang={lang} />

            <EvidenceSection translations={t.evidence} />

            <ValuePropsSection
                sectionTitle={(t as any).valueSectionTitle}
                translations={t.value}
            />

            <PillarsSection translations={t.pillars} />

            <PathCardsSection
                paths={paths as any}
                sectionTitle={t.pathSection.title}
                sectionSubtitle={t.pathSection.subtitle}
                lang={lang}
                quickSelectorTranslations={(t as any).quickSelector}
                suggestedPath={suggestedPath}
                onPathSelected={setSuggestedPath}
            />


            {/* Footer CTA */}
            <section className="py-20 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-600">
                    Hai domande? Scrivi a <a href="mailto:info@staituned.com" className="underline hover:text-amber-500">info@staituned.com</a>
                </p>
            </section>
        </div>
    )
}
