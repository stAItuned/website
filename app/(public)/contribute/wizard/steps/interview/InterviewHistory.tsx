'use client'

import { motion } from 'framer-motion'
import { InterviewQnA } from '@/lib/types/contributor'

interface InterviewHistoryProps {
    historyItem: InterviewQnA
    index: number
    maxQuestions: number
    onBack: () => void
    onForward: () => void
    canGoBack: boolean
    translations: {
        questionProgress?: string
        yourAnswer?: string
        back?: string
        next?: string
    }
}

/**
 * Component for reviewing a past question/answer pair in the interview history.
 * Allows navigation between previously answered questions.
 */
export function InterviewHistory({
    historyItem,
    index,
    maxQuestions,
    onBack,
    onForward,
    canGoBack,
    translations
}: InterviewHistoryProps) {
    const questionLabel = translations?.questionProgress
        ?.replace('{current}', String(index + 1))
        ?.replace('{max}', String(maxQuestions)) || `Domanda ${index + 1}`

    return (
        <motion.div
            key={`hist-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6 flex-1"
        >
            {/* Question */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                    {questionLabel}
                </span>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                    {historyItem.question}
                </p>
            </div>

            {/* Answer */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
                <span className="text-xs font-bold uppercase text-primary-500 mb-2 block">
                    {translations?.yourAnswer || 'La tua risposta'}
                </span>
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                    {historyItem.answer}
                </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <button
                    onClick={onBack}
                    disabled={!canGoBack}
                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                >
                    ← {translations?.back || 'Indietro'}
                </button>
                <button
                    onClick={onForward}
                    className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition shadow-lg"
                >
                    {translations?.next || 'Avanti'} →
                </button>
            </div>
        </motion.div>
    )
}
