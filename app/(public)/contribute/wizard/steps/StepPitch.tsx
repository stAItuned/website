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
        <div className="space-y-10 pb-32">
            <div className="text-center space-y-4">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    {translations.title}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
                    {translations.subtitle}
                </p>
            </div>

            <div className="stai-glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/20 dark:border-slate-700/50 shadow-2xl space-y-8">

                {/* Topic */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                        {translations.topic.label}
                    </label>
                    <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => handleChange('topic', e.target.value)}
                        placeholder={translations.topic.placeholder}
                        className="w-full text-xl px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-900 dark:text-white"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Target */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                            {translations.target.label}
                        </label>
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {(['newbie', 'midway', 'expert'] as ContributorTarget[]).map(t => {
                                    const isSelected = formData.target === t

                                    const styles = {
                                        newbie: isSelected
                                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 ring-4 ring-emerald-500/20'
                                            : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10',
                                        midway: isSelected
                                            ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 ring-4 ring-amber-500/20'
                                            : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/50 dark:hover:bg-amber-900/10',
                                        expert: isSelected
                                            ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400 ring-4 ring-rose-500/20'
                                            : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-900/10'
                                    }

                                    const icons = { newbie: '🌱', midway: '⚡', expert: '🔬' }

                                    return (
                                        <button
                                            key={t}
                                            onClick={() => handleChange('target', t)}
                                            className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border font-bold transition-all duration-300 ${styles[t]}`}
                                        >
                                            <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{icons[t]}</span>
                                            <span className="text-xs">{translations.target.options[t]}</span>
                                        </button>
                                    )
                                })}
                            </div>
                            {/* Target Description */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={formData.target}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`text-xs p-4 rounded-2xl border flex items-start gap-3 backdrop-blur-sm ${formData.target === 'newbie' ? 'bg-emerald-50/30 border-emerald-100/50 text-emerald-800 dark:bg-emerald-900/10 dark:border-emerald-900/20 dark:text-emerald-300' :
                                        formData.target === 'midway' ? 'bg-amber-50/30 border-amber-100/50 text-amber-800 dark:bg-amber-900/10 dark:border-amber-900/20 dark:text-amber-300' :
                                            'bg-rose-50/30 border-rose-100/50 text-rose-800 dark:bg-rose-900/10 dark:border-rose-900/20 dark:text-rose-300'
                                        }`}
                                >
                                    <span className="text-lg mt-0.5">💡</span>
                                    <span className="font-medium leading-relaxed">{translations.target.descriptions[formData.target]}</span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Format */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                            {translations.format.label}
                        </label>
                        <div className="relative group">
                            <select
                                value={formData.format === 'other' ? 'other' : formData.format}
                                onChange={(e) => handleChange('format', e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none cursor-pointer appearance-none font-bold text-slate-900 dark:text-white transition-all group-hover:bg-white dark:group-hover:bg-slate-950"
                            >
                                {(['tutorial', 'deep_dive', 'case_study', 'trend_analysis', 'comparative', 'framework', 'best_practices', 'tool_review', 'opinion', 'other'] as ContributorFormat[]).map(f => (
                                    <option key={f} value={f}>{translations.format.options[f]}</option>
                                ))}
                            </select>
                            {/* Custom caret */}
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-amber-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

                        {/* Other Format Input */}
                        {formData.format === 'other' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="pt-2"
                            >
                                <input
                                    type="text"
                                    value={otherFormat}
                                    onChange={(e) => {
                                        setOtherFormat(e.target.value)
                                        handleChange('context', e.target.value)
                                    }}
                                    placeholder={translations.format.otherPlaceholder}
                                    className="w-full px-6 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-900 dark:text-white"
                                />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Context */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                        {translations.context?.label || 'Contesto (Opzionale)'}
                    </label>
                    <textarea
                        value={formData.context || ''}
                        onChange={(e) => handleChange('context', e.target.value)}
                        placeholder={translations.context?.placeholder || 'Dettagli su scenario, vincoli o background...'}
                        rows={2}
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none"
                    />
                </div>

                {/* Thesis */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                        {translations.thesis.label}
                    </label>
                    <textarea
                        value={formData.thesis}
                        onChange={(e) => handleChange('thesis', e.target.value)}
                        placeholder={translations.thesis.placeholder}
                        rows={3}
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none"
                    />
                </div>

                {/* Sources (Optional) */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                        {translations.sources.label}
                    </label>
                    <textarea
                        value={formData.sources.join('\n')}
                        onChange={(e) => handleChange('sources', e.target.value.split('\n'))}
                        placeholder={translations.sources.placeholder}
                        rows={2}
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none text-sm"
                    />
                    <div className="flex items-center gap-2 ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Una fonte per riga</p>
                    </div>
                </div>

                {/* Action */}
                <div className="pt-6">
                    <button
                        onClick={() => onNext(formData)}
                        disabled={!isValid}
                        className="w-full py-5 rounded-[1.5rem] stai-btn-gradient text-lg shadow-2xl disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none transition-all"
                    >
                        {translations.cta}
                    </button>
                </div>

            </div>
        </div>
    )
}
