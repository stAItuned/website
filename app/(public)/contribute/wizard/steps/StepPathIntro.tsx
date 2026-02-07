'use client'

import { motion } from 'framer-motion'

interface StepPathIntroProps {
    path: 'guided' | 'autonomy' | 'interview'
    onNext: () => void
    translations: any
}

export function StepPathIntro({ path, onNext, translations }: StepPathIntroProps) {
    // Fallback to guided if path translations aren't found (safety check)
    const content = translations[path] || translations.guided

    return (
        <div className="space-y-8 pb-32">
            <div className="text-center space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold"
                >
                    {content.title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
                >
                    {content.subtitle}
                </motion.p>
            </div>

            <div className="stai-glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/20 dark:border-slate-700/50 shadow-2xl space-y-10">

                {/* Steps List */}
                <div className="space-y-8">
                    {content.steps.map((step: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            className="flex gap-6 items-start group"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm border border-amber-200/50 dark:border-amber-700/30 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                {idx + 1}
                            </div>
                            <div className="space-y-2 w-full">
                                <h3 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                                    {step.desc}
                                </p>

                                {/* 5 Goals Integration for Guided & Interview Path - Step 2 */}
                                {(path === 'guided' || path === 'interview') && idx === 1 && content.fiveQuestionsGoals && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ delay: 0.3 }}
                                        className="pt-6"
                                    >
                                        <div className="bg-slate-50/50 dark:bg-slate-900/40 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800/50 shadow-inner">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-xl">🎯</span>
                                                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                                    {content.fiveQuestionsGoals.title}
                                                </h4>
                                            </div>

                                            <p className="text-sm text-slate-500 dark:text-slate-500 mb-6 font-medium leading-relaxed">
                                                {content.fiveQuestionsGoals.description}
                                            </p>

                                            <div className="grid gap-3">
                                                {content.fiveQuestionsGoals.items.map((item: any, i: number) => (
                                                    <div key={i} className="flex items-start gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                                                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-black mt-0.5 border border-indigo-100 dark:border-indigo-800/30">
                                                            {i + 1}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block mb-1">{item.fullLabel}</span>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-8 opacity-50"></div>

                {/* Additional Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Why Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-amber-50/30 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100/50 dark:border-amber-900/20 group hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-3 text-amber-600 dark:text-amber-400">
                            <span className="text-xl group-hover:scale-110 transition-transform">🎯</span>
                            <h4 className="font-black text-xs uppercase tracking-widest">{content.why.title}</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {content.why.desc}
                        </p>
                    </motion.div>

                    {/* Inspiration Section - Only show if it exists */}
                    {content.inspiration && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-indigo-50/30 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/20 group hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-3 text-indigo-600 dark:text-indigo-400">
                                <span className="text-xl group-hover:scale-110 transition-transform">💡</span>
                                <h4 className="font-black text-xs uppercase tracking-widest">{content.inspiration.title}</h4>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {content.inspiration.desc}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="pt-4"
                >
                    <button
                        onClick={onNext}
                        className="w-full py-5 rounded-2xl stai-btn-gradient text-lg shadow-2xl shadow-amber-500/30"
                    >
                        {content.cta}
                    </button>
                </motion.div>

            </div>
        </div>
    )
}
