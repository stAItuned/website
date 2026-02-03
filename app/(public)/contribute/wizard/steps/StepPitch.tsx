'use client'

import { useState } from 'react'
import { ContributorBrief, ContributorTarget, ContributorFormat } from '@/lib/types/contributor'
import { motion, AnimatePresence } from 'framer-motion'

interface StepPitchProps {
    initialData?: ContributorBrief
    onNext: (data: ContributorBrief) => void
    translations: any
    commonT?: any
}

export function StepPitch({ initialData, onNext, translations }: StepPitchProps) {
    const [formData, setFormData] = useState<ContributorBrief>(initialData || {
        topic: '',
        target: 'newbie',
        format: 'tutorial',
        thesis: '',
        hasExample: false,
        sources: []
    })

    const [otherFormat, setOtherFormat] = useState('')

    const handleChange = (field: keyof ContributorBrief, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const isValid = formData.topic.length > 3 && formData.thesis.length > 5

    return (
        <div className="space-y-8 pb-32">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">{translations.title}</h1>
                <p className="text-slate-500 dark:text-slate-400">{translations.subtitle}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">

                {/* Topic */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">{translations.topic.label}</label>
                    <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => handleChange('topic', e.target.value)}
                        placeholder={translations.topic.placeholder}
                        className="w-full text-lg px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Target */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500">{translations.target.label}</label>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {(['newbie', 'midway', 'expert'] as ContributorTarget[]).map(t => {
                                    const isSelected = formData.target === t

                                    // Colors based on ArticleCard.tsx
                                    const styles = {
                                        newbie: isSelected
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10',
                                        midway: isSelected
                                            ? 'bg-amber-100 border-amber-500 text-amber-800 ring-1 ring-amber-500'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/10',
                                        expert: isSelected
                                            ? 'bg-rose-100 border-rose-500 text-rose-800 ring-1 ring-rose-500'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/10'
                                    }

                                    const icons = { newbie: '🌱', midway: '⚡', expert: '🔬' }

                                    return (
                                        <button
                                            key={t}
                                            onClick={() => handleChange('target', t)}
                                            className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border transition-all duration-200 ${styles[t]}`}
                                        >
                                            <span className="text-xl">{icons[t]}</span>
                                            <span className="text-sm font-bold">{translations.target.options[t]}</span>
                                        </button>
                                    )
                                })}
                            </div>
                            {/* Target Description */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={formData.target}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-xs p-3 rounded-lg border flex items-start gap-2 ${formData.target === 'newbie' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-300' :
                                        formData.target === 'midway' ? 'bg-amber-50/50 border-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-300' :
                                            'bg-rose-50/50 border-rose-100 text-rose-800 dark:bg-rose-900/20 dark:border-rose-900/50 dark:text-rose-300'
                                        }`}
                                >
                                    <span className="text-base mt-0.5">ℹ️</span>
                                    <span>{translations.target.descriptions[formData.target]}</span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Format */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500">{translations.format.label}</label>
                        <div className="relative">
                            <select
                                value={formData.format === 'other' ? 'other' : formData.format}
                                onChange={(e) => handleChange('format', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none cursor-pointer appearance-none"
                            >
                                {(['tutorial', 'deep_dive', 'case_study', 'trend_analysis', 'comparative', 'framework', 'best_practices', 'tool_review', 'opinion', 'other'] as ContributorFormat[]).map(f => (
                                    <option key={f} value={f}>{translations.format.options[f]}</option>
                                ))}
                            </select>
                            {/* Custom caret */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                ▼
                            </div>
                        </div>

                        {/* Other Format Input */}
                        {formData.format === 'other' && (
                            <motion.input
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                type="text"
                                value={otherFormat}
                                onChange={(e) => {
                                    setOtherFormat(e.target.value)
                                    // Normally we might update 'context' or a specific field, but type has union 'other'.
                                    // Ideally we save the custom format string in context or thesis if the type doesn't allow random strings.
                                    // For now, let's keep format='other' and store the detail in 'context' or handle logic upstream.
                                    // Let's assume we map it to context for now.
                                    handleChange('context', e.target.value)
                                }}
                                placeholder={translations.format.otherPlaceholder}
                                className="w-full mt-2 px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        )}
                    </div>
                </div>

                {/* Context */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                        {translations.context?.label || 'Contesto (Opzionale)'}
                    </label>
                    <textarea
                        value={formData.context || ''}
                        onChange={(e) => handleChange('context', e.target.value)}
                        placeholder={translations.context?.placeholder || 'Dettagli su scenario, vincoli o background...'}
                        rows={2}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    />
                </div>

                {/* Thesis */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">{translations.thesis.label}</label>
                    <textarea
                        value={formData.thesis}
                        onChange={(e) => handleChange('thesis', e.target.value)}
                        placeholder={translations.thesis.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    />
                </div>

                {/* Sources (Optional) */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                        {translations.sources.label}
                    </label>
                    <textarea
                        value={formData.sources.join('\n')}
                        onChange={(e) => handleChange('sources', e.target.value.split('\n'))}
                        placeholder={translations.sources.placeholder}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none resize-none text-sm"
                    />
                    <p className="text-xs text-slate-400">Una fonte per riga</p>
                </div>

                {/* Action */}
                <div className="pt-4">
                    <button
                        onClick={() => onNext(formData)}
                        disabled={!isValid}
                        className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {translations.cta}
                    </button>
                </div>

            </div>
        </div>
    )
}
