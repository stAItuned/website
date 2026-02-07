'use client'

import { motion } from 'framer-motion'

interface HeroSectionProps {
    translations: {
        title: string
        subtitle: string
        cta: string
        painStat?: {
            text: string
            source: string
            url: string
        }
    }
    paths: any
    lang: string
    hasDrafts?: boolean
}

/**
 * Hero section for the contribute landing page.
 * Displays the main title, pain point statistic, quick path selector and CTA.
 */
export function HeroSection({ translations: t, paths, lang, hasDrafts }: HeroSectionProps) {
    return (
        <header className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none" />

            {/* Gradient Blobs */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative max-w-4xl mx-auto flex flex-col items-center gap-8"
            >
                {/* Badge */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    stAItuned Contribution
                </motion.div>

                {/* Main Title */}
                <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-300">
                        {t.title}
                    </span>
                </h1>

                {/* Pain Stat */}
                {t.painStat && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className="inline-flex flex-col md:flex-row items-center gap-4 px-6 py-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-amber-100 dark:border-amber-900/20 shadow-2xl shadow-amber-950/5 dark:shadow-none backdrop-blur-xl max-w-4xl mx-auto"
                    >
                        <div className="shrink-0 w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-lg animate-pulse">
                            ⚠️
                        </div>
                        <div className="flex flex-col md:flex-row md:items-baseline gap-x-3 gap-y-1 text-center md:text-left">
                            <p className="text-base md:text-lg text-slate-700 dark:text-slate-100 font-medium leading-snug">
                                {t.painStat.text.split(/(#[^#]+#|\*[^*]+\*)/g).map((part: string, i: number) => {
                                    if (part.startsWith('#') && part.endsWith('#')) {
                                        return <span key={i} className="font-extrabold text-red-600 dark:text-red-400">{part.slice(1, -1)}</span>
                                    }
                                    if (part.startsWith('*') && part.endsWith('*')) {
                                        return <span key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(1, -1)}</span>
                                    }
                                    return part
                                })}
                            </p>
                            <a
                                href={t.painStat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 hover:text-amber-600 transition-colors bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md"
                            >
                                {t.painStat.source}
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    {t.subtitle.split('*').map((part, i) =>
                        i % 2 === 1 ? <span key={i} className="text-slate-900 dark:text-white font-bold">{part}</span> : part
                    )}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => document.getElementById('paths-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative inline-flex items-center gap-3 px-10 py-4 stai-btn-gradient rounded-full text-lg shadow-2xl shadow-amber-500/30 transition-all"
                    >
                        {t.cta}
                        <span className="group-hover:translate-x-1 transition-transform">
                            →
                        </span>
                    </motion.button>

                    {hasDrafts && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => document.getElementById('resume-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-sm font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors flex items-center gap-2"
                        >
                            <span>↩️</span>
                            {t.title.includes('Contribute') || t.title.includes('Contribuire')
                                ? (t.title.includes('Contribuire') ? 'Riprendi dove hai lasciato' : 'Resume where you left off')
                                : 'Resume where you left off'
                            }
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </header >
    )
}
