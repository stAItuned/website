'use client'

import { MarkdownContent } from '@/components/MarkdownContent'
import { useLearnLocale } from '@/lib/i18n'

interface TopicOverviewProps {
    rawContentEn: string
    rawContentIt?: string
    accentColor: string
}

/**
 * TopicOverview - Knowledge Dashboard layout for topic content
 * 
 * Features:
 * - Dark Definition Card with subtle gradient border
 * - Strategic Grid with hover glow effects  
 * - Minimalist FAQ accordion styling
 * - Consistent animation timing
 * - Bilingual support (IT/EN)
 */
export function TopicOverview({ rawContentEn, rawContentIt, accentColor }: TopicOverviewProps) {
    const { locale, t } = useLearnLocale()

    // Select content based on locale, fallback to English if Italian is missing
    const contentToUse = (locale === 'it' && rawContentIt) ? rawContentIt : rawContentEn

    if (!contentToUse || !contentToUse.trim()) return null

    // Simple runtime parser to split markdown into sections
    const sections = {
        definition: '',
        whenToFocus: '',
        pitfalls: '',
        faq: ''
    }

    // Split by H2
    const parts = contentToUse.split(/^## /m)

    parts.forEach(part => {
        // Robust detection for "Definition" section across languages
        // Matches: "What is...", "Cos'è...", "Che cosa...", or anything ending in "?"
        if (part.startsWith('What is') || part.startsWith("Cos'è") || part.startsWith("Che cos") || part.match(/^.+? \?/)) {
            sections.definition = '## ' + part
        }
        else if (part.startsWith('When to focus') || part.startsWith('Quando focalizzarsi')) {
            sections.whenToFocus = part.replace(/^(When to focus on this|Quando focalizzarsi su questo)/, '').trim()
        }
        else if (part.startsWith('Common Pitfalls') || part.startsWith('Errori Comuni')) {
            sections.pitfalls = part.replace(/^(Common Pitfalls|Errori Comuni)/, '').trim()
        }
        else if (part.startsWith('FAQ')) {
            sections.faq = part.replace('FAQ', '').trim()
        }
    })

    // Fallback
    if (!sections.definition && !sections.whenToFocus) {
        sections.definition = contentToUse
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {/* 1. Definition Card - Dark Premium with Gradient Border */}
            {sections.definition && (
                <section className="group relative">
                    {/* Animated gradient border */}
                    <div
                        className="absolute -inset-[1px] rounded-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}60)` }}
                    />

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        {/* Premium Background (Adaptive) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950" />

                        {/* Accent Gradient Overlay */}
                        <div
                            className="absolute inset-0 opacity-15"
                            style={{ background: `linear-gradient(135deg, ${accentColor} 0%, transparent 60%)` }}
                        />

                        {/* Subtle pattern - REMOVED for clean minimal look */}

                        <div className="relative p-8 sm:p-10 lg:p-12">
                            <MarkdownContent
                                content={sections.definition}
                                className="prose-lg dark:prose-invert
                                         prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:text-slate-900 dark:prose-h2:text-white prose-h2:mb-4 
                                         prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
                                         prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
                                         prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
                                         [&>h2:first-child]:mt-0"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* 2. Strategic Grid (Use Cases & Pitfalls) */}
            {(sections.whenToFocus || sections.pitfalls) && (
                <div className="grid grid-cols-1 gap-6">
                    {/* When to Focus / Strategies */}
                    {sections.whenToFocus && (
                        <section className="group relative h-full">
                            {/* Glow on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative h-full rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 sm:p-8 transition-all duration-500">
                                <h3 className="text-lg font-semibold flex items-center gap-3 mb-4 text-slate-900 dark:text-white">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                                        ✅
                                    </div>
                                    <span>{t.topicHub.sections.strategies}</span>
                                </h3>
                                <MarkdownContent
                                    content={sections.whenToFocus}
                                    className="text-base prose-ul:my-0 prose-ul:space-y-2 prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:marker:text-emerald-500 prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:leading-relaxed"
                                />
                            </div>
                        </section>
                    )}

                    {/* Pitfalls / Risks */}
                    {sections.pitfalls && (
                        <section className="group relative h-full">
                            {/* Glow on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-rose-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative h-full rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/20 p-6 sm:p-8 transition-all duration-500">
                                <h3 className="text-lg font-semibold flex items-center gap-3 mb-4 text-slate-900 dark:text-white">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 border border-rose-500/20 flex items-center justify-center text-xl">
                                        ⚠️
                                    </div>
                                    <span>{t.topicHub.sections.pitfalls}</span>
                                </h3>
                                <MarkdownContent
                                    content={sections.pitfalls}
                                    className="text-base prose-ul:my-0 prose-ul:space-y-2 prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:marker:text-rose-500 prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:leading-relaxed"
                                />
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* 3. FAQ (Minimalist Accordion) */}
            {sections.faq && (
                <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 p-7 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-xl">
                            💡
                        </div>
                        <span>{t.topicHub.sections.faq}</span>
                    </h3>
                    <MarkdownContent
                        content={sections.faq}
                        className="prose-details:bg-white dark:prose-details:bg-slate-800/50 prose-details:rounded-xl prose-details:border prose-details:border-slate-200 dark:prose-details:border-slate-700
                                 prose-summary:px-5 prose-summary:py-4 prose-summary:font-semibold prose-summary:cursor-pointer prose-summary:list-none prose-summary:text-slate-800 dark:prose-summary:text-slate-200 hover:prose-summary:text-primary-600 dark:hover:prose-summary:text-primary-400 prose-summary:transition-colors
                                 prose-p:px-5 prose-p:pb-5 prose-p:mt-0 prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                                 [&>details]:mb-3 [&>details]:shadow-sm [&>details]:transition-shadow hover:[&>details]:shadow-md"
                    />
                </section>
            )}
        </div>
    )
}
