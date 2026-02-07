'use client'

import Link from 'next/link'
import { Contribution } from '@/lib/types/contributor'
import { ContributeLanguage } from '@/lib/i18n/contribute-translations'

interface ResumeSectionProps {
    drafts: Contribution[]
    lang: ContributeLanguage
}

/**
 * Resume section showing user's existing draft contributions.
 */
export function ResumeSection({ drafts, lang }: ResumeSectionProps) {
    if (drafts.length === 0) return null

    return (
        <section id="resume-section" className="relative z-20 -mt-8 mb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="stai-glass-card rounded-[2.5rem] shadow-2xl shadow-amber-500/10 border border-white/20 dark:border-slate-700/50 p-6 md:p-10 relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div className="flex items-start gap-5">
                                <span className="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 text-3xl shadow-sm border border-amber-200/50 dark:border-amber-700/30">
                                    👋
                                </span>
                                <div>
                                    <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                        {lang === 'it' ? 'Bentornato! Continua da dove eri rimasto' : 'Welcome back! Resume your progress'}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                        {lang === 'it'
                                            ? `Hai ${drafts.length} ${drafts.length === 1 ? 'contributo' : 'contributi'} in sospeso.`
                                            : `You have ${drafts.length} pending ${drafts.length === 1 ? 'contribution' : 'contributions'}.`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {drafts.map(draft => (
                                <Link
                                    key={draft.id}
                                    href={`/contribute/wizard?id=${draft.id}`}
                                    className="group block relative bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                {draft.path}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                {new Date(draft.updatedAt).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>

                                        <p className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-5 flex-grow leading-snug">
                                            {draft.brief?.topic || draft.brief?.thesis || (lang === 'it' ? 'Bozza senza titolo' : 'Untitled Draft')}
                                        </p>

                                        <div className="flex items-center text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                            {lang === 'it' ? 'Continua' : 'Resume'}
                                            <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
