'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface StepGuidelinesProps {
    onNext: () => void
    translations: any
}

export function StepGuidelines({ onNext, translations }: StepGuidelinesProps) {
    const [accepted, setAccepted] = useState(false)

    // Ensure translations exists
    if (!translations) return null

    return (
        <div className="space-y-8 pb-32">
            <div className="text-center space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold"
                >
                    {translations.title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
                >
                    {translations.subtitle}
                </motion.p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-8">

                <div className="grid md:grid-cols-1 gap-8">
                    {translations.sections.map((section: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (idx * 0.05) }}
                            className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                            {section.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 italic">
                                            {section.desc}
                                        </p>
                                    </div>

                                    <ul className="space-y-2">
                                        {section.rules.map((rule: string, rIdx: number) => (
                                            <li key={rIdx} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                <span className="text-green-500 flex-shrink-0">✓</span>
                                                <span>{rule}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="md:w-1/3 flex-shrink-0">
                                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 rounded-lg h-full">
                                        <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                                            <span className="text-lg">🚩</span>
                                            <p className="text-sm font-medium">
                                                {section.redFlag}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                    <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors group">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {translations.cta}
                        </span>
                    </label>
                </div>

                {/* Footer Action */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={onNext}
                        disabled={!accepted}
                        className={`
                            px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg
                            ${accepted
                                ? 'bg-primary-600 text-white hover:bg-primary-500 hover:shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'}
                        `}
                    >
                        {translations.cta.split(',')[1] || 'Proceed'} &rarr;
                    </button>
                </div>
            </div>
        </div>
    )
}
