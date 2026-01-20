'use client'

import { MarkdownContent } from '@/components/MarkdownContent'
import { useLearnLocale } from '@/lib/i18n'
import { BookOpen, Sparkles, AlertTriangle, HelpCircle, ChevronDown } from 'lucide-react'

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
            {/* 1. Definition Card - Premium Hero Style */}
            {sections.definition && (
                <div className="relative group">
                    {/* Gradient Border Background */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />

                    <section className="relative rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm overflow-hidden transition-colors">
                        {/* Subtle inner glow/texture */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-50 pointer-events-none" />

                        <div className="relative p-6 sm:p-7">
                            <div className="flex items-center gap-3 mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 ease-out">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Definition
                                </span>
                            </div>

                            <MarkdownContent
                                content={sections.definition}
                                className="prose prose-sm prose-slate dark:prose-invert max-w-none
                                         prose-h2:text-lg prose-h2:font-bold prose-h2:text-slate-900 dark:prose-h2:text-white prose-h2:mb-4 prose-h2:!mt-0
                                         prose-p:text-[0.9375rem] prose-p:leading-7 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:my-0
                                         prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
                                         prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                                         prose-li:text-slate-600 dark:prose-li:text-slate-300"
                            />
                        </div>
                    </section>
                </div>
            )}

            {/* 2. Strategic Grid (Use Cases & Pitfalls) */}
            {(sections.whenToFocus || sections.pitfalls) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* When to Focus / Strategies */}
                    {sections.whenToFocus && (
                        <section className="relative group rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-emerald-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden">
                            {/* Accent Top Border */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-transparent dark:from-emerald-900/10 dark:to-transparent pointer-events-none" />

                            <div className="relative p-5 sm:p-6">
                                <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-emerald-950 dark:text-white">
                                    <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform duration-300">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="text-emerald-700 dark:text-emerald-300">{t.topicHub.sections.strategies}</span>
                                </h3>
                                <MarkdownContent
                                    content={sections.whenToFocus}
                                    className="prose prose-sm max-w-none prose-ul:my-0 prose-ul:space-y-2 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-li:marker:text-emerald-500 prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:leading-6"
                                />
                            </div>
                        </section>
                    )}

                    {/* Pitfalls / Risks */}
                    {sections.pitfalls && (
                        <section className="relative group rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-amber-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden">
                            {/* Accent Top Border */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 to-transparent dark:from-amber-900/10 dark:to-transparent pointer-events-none" />

                            <div className="relative p-5 sm:p-6">
                                <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-amber-950 dark:text-white">
                                    <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <span className="text-amber-700 dark:text-amber-300">{t.topicHub.sections.pitfalls}</span>
                                </h3>
                                <MarkdownContent
                                    content={sections.pitfalls}
                                    className="prose prose-sm max-w-none prose-ul:my-0 prose-ul:space-y-2 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-li:marker:text-amber-500 prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:leading-6"
                                />
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* 3. FAQ - Modern Accordion */}
            {sections.faq && (
                <section className="rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 overflow-hidden relative transition-all">
                    {/* Background decoration */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100/50 dark:bg-slate-800/50 rounded-full blur-3xl pointer-events-none" />

                    <h3 className="relative text-sm font-semibold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:rotate-12 transition-transform duration-300">
                            <HelpCircle className="w-4 h-4" />
                        </div>
                        <span>{t.topicHub.sections.faq}</span>
                    </h3>

                    <div className="relative">
                        <MarkdownContent
                            content={sections.faq}
                            className="prose prose-sm max-w-none 
                                     /* Accordion Base Style */
                                     prose-details:group prose-details:bg-white dark:prose-details:bg-slate-800/30 prose-details:rounded-xl prose-details:border prose-details:border-slate-200 dark:prose-details:border-slate-700 prose-details:shadow-sm
                                     /* Accordion Summary - Custom Marker hidden, custom style flex */
                                     prose-summary:list-none prose-summary:flex prose-summary:items-center prose-summary:justify-between
                                     prose-summary:px-5 prose-summary:py-4 prose-summary:font-medium prose-summary:cursor-pointer 
                                     prose-summary:text-slate-800 dark:prose-summary:text-slate-200 hover:prose-summary:bg-slate-50 dark:hover:prose-summary:bg-slate-800/50
                                     prose-summary:transition-all prose-summary:duration-200 prose-summary:rounded-t-xl
                                     /* Add custom chevron via after pseudo-element or just trust Tiptap rendered content structure? 
                                        Actually prose-summary styles apply to the summary tag. Standard markdown details/summary doesn't easily allow injecting specific icons unless we handle the rendering ourselves.
                                        But we can use CSS grid text-indent hack or marker styling.
                                        For now, lets style the marker to be clean. */
                                     prose-summary:marker:content-[''] prose-summary:marker:hidden
                                     /* Content spacing */
                                     prose-p:px-5 prose-p:pb-5 prose-p:pt-1 prose-p:mt-0 prose-p:mb-0 prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-6
                                     [&>details]:mb-3 [&>details[open]>summary]:border-b [&>details[open]>summary]:border-slate-100 dark:[&>details[open]>summary]:border-slate-700"
                        />
                    </div>
                </section>
            )}
        </div>
    )
}
