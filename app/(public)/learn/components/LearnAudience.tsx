'use client'

import { useLearnLocale } from '@/lib/i18n'

interface LearnAudienceProps {
    className?: string
}

/**
 * "Per chi è" section - qualifies the target audience
 * 
 * Shows who the platform is for and (importantly) who it's NOT for.
 */
export function LearnAudience({ className = '' }: LearnAudienceProps) {
    const { t } = useLearnLocale()

    return (
        <section className={`max-w-3xl mx-auto ${className}`}>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 sm:p-8 shadow-sm">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                    {t.audience.title}
                </h2>

                {/* For who - list */}
                <ul className="space-y-3 mb-6">
                    {t.audience.forWho.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{item}</span>
                        </li>
                    ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-slate-200 dark:border-slate-700 my-5" />

                {/* Not for who */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </span>
                    <div>
                        <p className="font-medium text-amber-800 dark:text-amber-200">
                            {t.audience.notForWho.title}
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            {t.audience.notForWho.description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
