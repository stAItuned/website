'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ContributeLanguage } from '@/lib/i18n/contribute-translations'
import { QuickPathSelector } from './QuickPathSelector'

interface PathItem {
    key: string
    icon: string
    color: string
    title: string
    description: string
    bestFor?: string[]
    time: string
    cta: string
}

interface PathCardsSectionProps {
    paths: PathItem[]
    sectionTitle: string
    sectionSubtitle: string
    lang: ContributeLanguage
    quickSelectorTranslations?: any
    suggestedPath?: string | null
    onPathSelected?: (pathKey: string | null) => void
}

/**
 * Path cards section showing the three contribution paths.
 */
export function PathCardsSection({
    paths,
    sectionTitle,
    sectionSubtitle,
    lang,
    quickSelectorTranslations,
    suggestedPath,
    onPathSelected
}: PathCardsSectionProps) {
    const autonomyHref = `/contribute/wizard?path=autonomy&lang=${lang}`

    return (
        <section id="paths-section" className="py-24 px-6 relative">
            <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                    {sectionTitle}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    {sectionSubtitle}
                </p>
            </div>

            {quickSelectorTranslations && (
                <div className="mb-10">
                    <QuickPathSelector
                        translations={quickSelectorTranslations}
                        paths={paths.reduce((acc, p) => ({ ...acc, [p.key]: { title: p.title, cta: p.cta } }), {})}
                        lang={lang}
                        onPathSelected={onPathSelected}
                        autonomyHref={autonomyHref}
                    />
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6">
                    {paths.map((path, i) => (
                        <motion.div
                            key={path.key}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                            className={`group relative flex flex-col p-8 rounded-[2rem] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border overflow-hidden transition-all duration-300 
                                ${suggestedPath === path.key
                                    ? 'border-amber-400 dark:border-amber-500 shadow-2xl shadow-amber-500/20 ring-4 ring-amber-500/10 scale-105 z-10'
                                    : 'border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-amber-500/10 dark:hover:shadow-amber-500/5 hover:border-amber-200 dark:hover:border-amber-900/40'
                                }`}
                        >
                            {suggestedPath === path.key && (
                                <div className="absolute top-4 right-6 px-3 py-1 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-bounce">
                                    {lang === 'it' ? 'Consigliato' : 'Recommended'}
                                </div>
                            )}
                            {/* Gradient Top Line */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${path.key === 'autonomy' ? 'from-amber-400 to-amber-500' : path.key === 'guided' ? 'from-blue-400 to-indigo-500' : 'from-emerald-400 to-teal-500'} opacity-80`} />

                            <div className="mb-4 text-5xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">{path.icon}</div>

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                {path.title}
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-[48px] leading-relaxed">
                                {path.description.split('**').map((part: string, i: number) =>
                                    i % 2 === 1 ? <span key={i} className="text-slate-900 dark:text-white font-bold">{part}</span> : part
                                )}
                            </p>

                            {/* Best For Section */}
                            <div className="mb-6 flex-grow space-y-3">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                                    {lang === 'it' ? 'Ideale se:' : 'Best for:'}
                                </p>
                                <ul className="space-y-2.5">
                                    {path.bestFor?.map((item: string, idx: number) => (
                                        <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-3">
                                            <span className="text-amber-500 mt-1 flex-shrink-0">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                                <span className="flex items-center justify-center text-sm">
                                    ⏱️
                                </span>
                                {path.time}
                            </div>

                            <Link
                                href={path.key === 'autonomy' ? autonomyHref : `/contribute/wizard?path=${path.key}&lang=${lang}`}
                                className="w-full py-4 rounded-2xl stai-btn-gradient text-center shadow-lg hover:shadow-amber-500/30 active:scale-[0.97]"
                            >
                                {path.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
