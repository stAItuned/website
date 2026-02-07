'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface QuickPathSelectorProps {
    translations: any // Changed to any to simplify, or keep specific if preferred
    paths: any
    lang: string
    onPathSelected?: (pathKey: string | null) => void
}

export function QuickPathSelector({ translations: t, paths, lang, onPathSelected }: QuickPathSelectorProps) {
    const [step, setStep] = useState(1)
    const [answers, setAnswers] = useState({ hasDraft: false, preference: '', needsHelp: false })

    if (!t) return null

    // Step 1: Has draft?
    const handleStep1 = (hasDraft: boolean) => {
        if (hasDraft) {
            setAnswers({ ...answers, hasDraft: true })
            setStep(4) // Skip to result (Autonomy)
            onPathSelected?.('autonomy')
        } else {
            setAnswers({ ...answers, hasDraft: false })
            setStep(2)
        }
    }

    // Step 2: Write or talk?
    const handleStep2 = (pref: 'write' | 'talk') => {
        if (pref === 'talk') {
            setAnswers({ ...answers, preference: pref })
            setStep(4) // Interview
            onPathSelected?.('interview')
        } else {
            setAnswers({ ...answers, preference: pref })
            setStep(3) // Go to step 3: need help?
        }
    }

    // Step 3: Need help with blank page?
    const handleStep3 = (needsHelp: boolean) => {
        setAnswers({ ...answers, needsHelp })
        setStep(4)
        onPathSelected?.(needsHelp ? 'guided' : 'autonomy')
    }

    const getResult = () => {
        if (answers.hasDraft) return 'autonomy'
        if (answers.preference === 'talk') return 'interview'
        return answers.needsHelp ? 'guided' : 'autonomy'
    }

    const resultKey = getResult()
    const selectedPath = paths[resultKey as keyof typeof paths]

    const reset = () => {
        setStep(1)
        setAnswers({ hasDraft: false, preference: '', needsHelp: false })
        onPathSelected?.(null)
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-lg shadow-lg"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3"
                        >
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                {t.question1}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleStep1(true)}
                                    className="px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold transition-colors"
                                >
                                    {t.yes}
                                </button>
                                <button
                                    onClick={() => handleStep1(false)}
                                    className="px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors"
                                >
                                    {t.no}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3"
                        >
                            <button
                                onClick={() => setStep(1)}
                                className="text-slate-400 hover:text-amber-500 transition-colors"
                                aria-label={t.back}
                            >
                                ←
                            </button>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                {t.question2}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleStep2('write')}
                                    className="px-4 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-colors"
                                >
                                    ✍️ {t.write}
                                </button>
                                <button
                                    onClick={() => handleStep2('talk')}
                                    className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors"
                                >
                                    🎙️ {t.talk}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3"
                        >
                            <button
                                onClick={() => setStep(2)}
                                className="text-slate-400 hover:text-amber-500 transition-colors"
                                aria-label={t.back}
                            >
                                ←
                            </button>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                {t.question3}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleStep3(true)}
                                    className="px-4 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition-colors"
                                >
                                    🧭 {t.needHelp}
                                </button>
                                <button
                                    onClick={() => handleStep3(false)}
                                    className="px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors"
                                >
                                    {t.noHelp}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500 dark:text-slate-400">{t.resultLabel}</span>
                                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                                    {selectedPath.title}
                                </span>
                            </div>
                            <Link
                                href={`/contribute/wizard?path=${resultKey}&lang=${lang}`}
                                className="px-5 py-1.5 rounded-full stai-btn-gradient text-sm font-bold shadow-md active:scale-95 transition-all"
                            >
                                {selectedPath.cta} →
                            </Link>
                            <button
                                onClick={reset}
                                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                ↺
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
