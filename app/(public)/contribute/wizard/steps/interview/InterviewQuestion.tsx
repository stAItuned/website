'use client'

import { motion } from 'framer-motion'
import { GeneratedQuestion } from '@/lib/types/contributor'

interface InterviewQuestionProps {
    question: GeneratedQuestion
    questionNumber: number
    maxQuestions: number
    progressText: string
    userAnswer: string
    assistanceTypeResolved: 'examples' | 'claims' | 'sources' | 'definition' | 'drafting' | null
    onAnswerChange: (answer: string) => void
    onSubmit: (skipped?: boolean) => void
    onBack: () => void
    onImDone: () => void
    onFetchAssistance: () => void
    hasHistory: boolean
    translations: {
        inputPlaceholder?: string
        whyAsk?: string
        suggestion?: string
        back?: string
        skip?: string
        imDone?: string
        submit?: string
        finishAndGenerate?: string
        dataPointLabels?: Record<string, string>
        assistance?: {
            buttonLabel?: string
            draftButtonLabel?: string
        }
    }
}

/**
 * The main question card component for the current interview question.
 * Displays the question, motivation, helper text, and answer input.
 */
export function InterviewQuestion({
    question,
    questionNumber,
    maxQuestions,
    progressText,
    userAnswer,
    assistanceTypeResolved,
    onAnswerChange,
    onSubmit,
    onBack,
    onImDone,
    onFetchAssistance,
    hasHistory,
    translations
}: InterviewQuestionProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (userAnswer.trim()) onSubmit()
        }
    }

    return (
        <motion.div
            key="current"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8 flex-1"
        >
            {/* Question Card */}
            <div className="stai-glass-card p-8 md:p-10 rounded-[2.5rem] border border-white/20 dark:border-slate-800 shadow-2xl relative overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/5">
                {/* Decorator */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] font-black text-[12rem] text-slate-900 dark:text-white leading-none -mt-4 -mr-4 select-none">?</div>

                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-[0.2em] bg-amber-500/10 px-2 py-1 rounded-md">
                        {progressText}
                    </span>
                    {question.dataPoint && (
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            {translations?.dataPointLabels?.[question.dataPoint] || question.dataPoint}
                        </span>
                    )}
                </div>

                {/* Question Text */}
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 leading-[1.3] relative z-10 tracking-tight">
                    {question.text}
                </h3>

                <div className="space-y-4 relative z-10">
                    {/* Motivation Badge */}
                    {question.motivation && (
                        <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-900/20 p-5 rounded-2xl flex gap-4 items-start group/motivation transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20">
                            <span className="text-2xl mt-0.5 group-hover/motivation:scale-110 transition-transform">💡</span>
                            <div>
                                <p className="text-[10px] font-black text-amber-700/70 dark:text-amber-400/70 uppercase tracking-[0.15em] mb-1">
                                    {translations?.whyAsk || 'Perché te lo chiedo?'}
                                </p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                                    &quot;{question.motivation}&quot;
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Helper Text */}
                    {question.helperText && (
                        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20 p-5 rounded-2xl flex gap-4 items-start group/helper transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                            <span className="text-2xl mt-0.5 group-hover/helper:scale-110 transition-transform">🎯</span>
                            <div>
                                <p className="text-[10px] font-black text-indigo-700/70 dark:text-indigo-400/70 uppercase tracking-[0.15em] mb-1">
                                    {translations?.suggestion || 'Suggerimento'}
                                </p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                    {question.helperText}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Answer Input */}
            <div className="space-y-6">
                <div className="relative group">
                    <textarea
                        autoFocus
                        value={userAnswer}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        placeholder={translations?.inputPlaceholder || "Scrivi la tua risposta..."}
                        rows={4}
                        className="w-full p-6 p-y-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 outline-none resize-none shadow-xl shadow-slate-200/50 dark:shadow-none text-xl font-medium tracking-tight transition-all placeholder:text-slate-400"
                        onKeyDown={handleKeyDown}
                    />
                    <div className="absolute bottom-6 right-8 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                        Press Enter to Submit
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <button
                        onClick={onBack}
                        disabled={!hasHistory}
                        className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-0 transition-all"
                    >
                        ← {translations?.back || 'Indietro'}
                    </button>

                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
                        {/* Assistance Button */}
                        <button
                            onClick={onFetchAssistance}
                            className="px-6 py-4 rounded-2xl font-bold bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all border border-amber-200 dark:border-amber-800/50 shadow-sm text-sm"
                        >
                            {assistanceTypeResolved === 'drafting' || assistanceTypeResolved === 'definition'
                                ? (translations?.assistance?.draftButtonLabel || 'Suggeriscimi una risposta ✨')
                                : (translations?.assistance?.buttonLabel || 'Aiutami a rispondere 🔍')}
                        </button>

                        {/* Skip Button */}
                        <button
                            onClick={() => onSubmit(true)}
                            className="px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
                        >
                            {translations?.skip || "Salta"}
                        </button>

                        {/* I'm Done Button */}
                        {hasHistory && questionNumber < maxQuestions && (
                            <button
                                onClick={onImDone}
                                className="px-6 py-4 rounded-2xl font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50 transition-all shadow-sm text-sm"
                            >
                                {translations?.imDone || "Ho detto tutto"}
                            </button>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={() => onSubmit()}
                            disabled={!userAnswer.trim()}
                            className="px-10 py-4 rounded-2xl stai-btn-gradient text-sm shadow-2xl shadow-amber-500/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {questionNumber >= maxQuestions
                                ? (translations?.finishAndGenerate || "Concludi e Genera Outline 📝")
                                : (translations?.submit || 'Invia Risposta') + ' ➤'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
