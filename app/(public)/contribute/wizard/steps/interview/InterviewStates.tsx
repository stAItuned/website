'use client'

import { motion } from 'framer-motion'
import { InterviewQnA, CoverageAssessment } from '@/lib/types/contributor'

interface LoadingStateProps {
    translations: { thinking?: string }
}

interface ErrorStateProps {
    error: string
    onRetry: () => void
    onProceed?: () => void
    hasHistory: boolean
}

interface RateLimitStateProps {
    resetTime: string
    onProceed: () => void
    translations: {
        rateLimitTitle?: string
        rateLimitDesc?: string
        proceedAnyway?: string
    }
}

/**
 * Loading state displayed while generating the next question.
 */
export function LoadingState({ translations }: LoadingStateProps) {
    return (
        <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-slate-800 p-10 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-6 text-center h-full flex-1"
        >
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-3 h-3 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
            <p className="text-slate-500 font-medium">{translations?.thinking || 'Sto pensando...'}</p>
        </motion.div>
    )
}

/**
 * Error state displayed when question generation fails.
 */
export function ErrorState({ error, onRetry, onProceed, hasHistory }: ErrorStateProps) {
    return (
        <motion.div
            key="generation-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 dark:bg-red-900/20 p-10 rounded-2xl border border-red-200 dark:border-red-800 text-center flex flex-col items-center justify-center gap-4 flex-1"
        >
            <span className="text-4xl">⚠️</span>
            <h3 className="text-xl font-bold text-red-900 dark:text-red-100">Errore</h3>
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <div className="flex gap-3">
                <button
                    onClick={onRetry}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    Riprova
                </button>
                {hasHistory && onProceed && (
                    <button
                        onClick={onProceed}
                        className="mt-4 px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
                    >
                        Procedi comunque
                    </button>
                )}
            </div>
        </motion.div>
    )
}

/**
 * Rate limit state displayed when daily question limit is reached.
 */
export function RateLimitState({ resetTime, onProceed, translations }: RateLimitStateProps) {
    return (
        <motion.div
            key="limit-reached"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-50 dark:bg-amber-900/20 p-10 rounded-2xl border border-amber-200 dark:border-amber-800 text-center flex flex-col items-center justify-center gap-4 flex-1"
        >
            <span className="text-4xl">⏳</span>
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                {translations?.rateLimitTitle || 'Limite Giornaliero Raggiunto'}
            </h3>
            <p
                className="text-amber-800 dark:text-amber-200"
                dangerouslySetInnerHTML={{
                    __html: (translations?.rateLimitDesc || 'Hai terminato le domande disponibili per oggi. <br />Il limite verrà reimpostato alle {resetTime}.')
                        .replace('{resetTime}', resetTime)
                }}
            />
            <button
                onClick={onProceed}
                className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
                {translations?.proceedAnyway || 'Procedi comunque (concludi qui)'}
            </button>
        </motion.div>
    )
}
