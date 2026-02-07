'use client'

import { Contribution } from '@/lib/types/contributor'
import { motion } from 'framer-motion'
import { contributeTranslations, ContributeLanguage } from '@/lib/i18n/contribute-translations'
import { useLearnLocale } from '@/lib/i18n'

interface StepResumeSelectionProps {
    contributions: Contribution[]
    onSelect: (contribution: Contribution) => void
    onStartNew: () => void
}

export function StepResumeSelection({ contributions, onSelect, onStartNew }: StepResumeSelectionProps) {
    const { locale } = useLearnLocale()
    const lang = locale as ContributeLanguage
    const t = contributeTranslations[lang].wizard.resumeSelection

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusLabel = (status: string) => {
        // Use dashboard status translations
        const statusT = contributeTranslations[lang].dashboard.status as Record<string, string>
        return statusT[status] || status
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
            case 'review': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
            case 'draft':
            case 'pitch':
                return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
            default: return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
        }
    }

    return (
        <div className="space-y-8 pb-32">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {t.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    {t.subtitle}
                </p>
            </div>

            <div className="flex justify-center py-4">
                <button
                    onClick={onStartNew}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                    <span>✨</span>
                    {t.startNew}
                </button>
            </div>

            <div className="grid gap-4">
                {contributions.map((contribution, idx) => (
                    <motion.div
                        key={contribution.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 transition-all shadow-sm hover:shadow-md cursor-pointer group"
                        onClick={() => onSelect(contribution)}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1 min-w-0 flex-1">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                                    {contribution.brief?.topic || t.untitled}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contribution.status)}`}>
                                        {getStatusLabel(contribution.status)}
                                    </span>

                                    {/* Path Badge */}
                                    {contribution.path && (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${contribution.path === 'autonomy' ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' :
                                            contribution.path === 'interview' ? 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800' :
                                                'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                                            }`}>
                                            {contribution.path === 'autonomy' ? '⚡ ' : contribution.path === 'interview' ? '🎤 ' : '🧭 '}
                                            {contributeTranslations[lang].landing.paths[contribution.path]?.title || contribution.path}
                                        </span>
                                    )}

                                    <span className="hidden sm:inline">
                                        • {t.updatedAt} {formatDate(contribution.updatedAt || contribution.createdAt)}
                                    </span>
                                    {contribution.brief?.format && (
                                        <span className="capitalize hidden md:inline-block">
                                            • {contribution.brief.format.replace('_', ' ')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="shrink-0">
                                <button
                                    className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium text-sm group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors"
                                >
                                    {['review', 'published'].includes(contribution.status) ? t.view : t.resume}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>


        </div>
    )
}
