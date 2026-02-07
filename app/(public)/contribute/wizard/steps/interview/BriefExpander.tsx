'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ContributorBrief } from '@/lib/types/contributor'

interface BriefExpanderProps {
    brief: ContributorBrief
    isOpen: boolean
    onToggle: () => void
    translations: {
        title?: string
        topic?: string
        target?: string
        format?: string
        thesis?: string
        context?: string
    }
}

/**
 * Collapsible panel for displaying the contribution brief during the interview.
 * Helps users reference their original pitch while answering questions.
 */
export function BriefExpander({ brief, isOpen, onToggle, translations }: BriefExpanderProps) {
    return (
        <div className="stai-glass-card rounded-3xl border border-white/20 dark:border-slate-800 overflow-hidden shadow-xl transition-all">
            <button
                onClick={onToggle}
                className="w-full px-8 py-5 flex items-center justify-between hover:bg-white/50 dark:hover:bg-slate-700/30 transition-all group"
            >
                <div className="flex items-center gap-4">
                    <span className="text-2xl group-hover:scale-110 transition-transform">📝</span>
                    <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        {translations?.title || 'Il tuo Brief'}
                    </span>
                </div>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-slate-400"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8 pt-4 border-t border-slate-100 dark:border-slate-800"
                    >
                        <div className="grid gap-6 text-sm">
                            {/* Topic */}
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                    {translations?.topic || 'Argomento'}
                                </span>
                                <p className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">{brief.topic}</p>
                            </div>

                            {/* Target & Format */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                        {translations?.target || 'Target'}
                                    </span>
                                    <p className="font-black text-[10px] uppercase tracking-widest bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-800/50 inline-block shadow-sm">
                                        {brief.target}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                        {translations?.format || 'Formato'}
                                    </span>
                                    <p className="font-bold text-slate-700 dark:text-slate-300">{brief.format}</p>
                                </div>
                            </div>

                            {/* Thesis */}
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                    {translations?.thesis || 'Tesi'}
                                </span>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic border-l-4 border-amber-500 pl-4 py-1 bg-amber-500/5 rounded-r-xl">
                                    "{brief.thesis}"
                                </p>
                            </div>

                            {/* Context (optional) */}
                            {brief.context && (
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                        {translations?.context || 'Contesto'}
                                    </span>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{brief.context}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
