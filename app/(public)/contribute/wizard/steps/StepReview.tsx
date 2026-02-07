'use client'

import { motion } from 'framer-motion'
import { CoverageAssessment, InterviewQnA } from '@/lib/types/contributor'

interface StepReviewProps {
    coverageAssessment: CoverageAssessment
    interviewHistory: InterviewQnA[]
    translations: any
    onProceed: () => void
    onAnswerMore: () => void
}

/**
 * StepReview - Shows coverage assessment before generating outline
 * Displays what data points are covered/missing and recommendation
 */
export function StepReview({
    coverageAssessment,
    interviewHistory,
    translations,
    onProceed,
    onAnswerMore
}: StepReviewProps) {
    const t = translations

    // All trackable data points
    const allDataPoints = ['thesis_depth', 'context_relevance', 'author_expertise', 'key_mechanisms', 'evidence'] as const

    // Get score color based on recommendation
    const getScoreColor = (recommendation: string) => {
        switch (recommendation) {
            case 'strong': return 'text-emerald-600 dark:text-emerald-400'
            case 'acceptable': return 'text-amber-600 dark:text-amber-400'
            case 'weak': return 'text-red-600 dark:text-red-400'
            default: return 'text-slate-600'
        }
    }

    const getProgressColor = (recommendation: string) => {
        switch (recommendation) {
            case 'strong': return 'bg-emerald-500'
            case 'acceptable': return 'bg-amber-500'
            case 'weak': return 'bg-red-500'
            default: return 'bg-slate-500'
        }
    }

    const getRecommendationBg = (recommendation: string) => {
        switch (recommendation) {
            case 'strong': return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
            case 'acceptable': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
            case 'weak': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            default: return 'bg-slate-50 border-slate-200'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-2xl mx-auto pb-32"
        >
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {t.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    {t.subtitle}
                </p>
            </div>

            {/* Score Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {t.coverageScore}
                    </span>
                    <span className={`text-3xl font-bold ${getScoreColor(coverageAssessment.recommendation)}`}>
                        {coverageAssessment.score}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${coverageAssessment.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${getProgressColor(coverageAssessment.recommendation)}`}
                    />
                </div>

                {/* Questions Answered Badge */}
                <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-medium">{interviewHistory.length}</span>
                        <span>{t.responsesCollected}</span>
                    </span>
                </div>
            </div>

            {/* Data Points Coverage */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="grid gap-3">
                    {allDataPoints.map((point) => {
                        const isCovered = coverageAssessment.covered.includes(point)
                        const isMissing = coverageAssessment.missing.includes(point)

                        return (
                            <div
                                key={point}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isCovered
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                                    : isMissing
                                        ? 'bg-amber-50 dark:bg-amber-900/20'
                                        : 'bg-slate-50 dark:bg-slate-700/50'
                                    }`}
                            >
                                {/* Icon */}
                                <span className={`text-xl ${isCovered ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {isCovered ? '✓' : '○'}
                                </span>

                                {/* Label */}
                                <span className={`font-medium ${isCovered
                                    ? 'text-emerald-700 dark:text-emerald-300'
                                    : 'text-amber-700 dark:text-amber-300'
                                    }`}>
                                    {t.dataPoints[point] || point}
                                </span>

                                {/* Status Badge */}
                                <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${isCovered
                                    ? 'bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-amber-100 dark:bg-amber-800/50 text-amber-600 dark:text-amber-400'
                                    }`}>
                                    {isCovered ? t.covered : t.missing}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Recommendation Message */}
            <div className={`rounded-2xl border p-5 ${getRecommendationBg(coverageAssessment.recommendation)}`}>
                <div className="flex items-start gap-3">
                    <span className="text-2xl">
                        {coverageAssessment.recommendation === 'strong' ? '🎯' :
                            coverageAssessment.recommendation === 'acceptable' ? '💡' : '⚠️'}
                    </span>
                    <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                            {t.recommendation[coverageAssessment.recommendation]}
                        </p>
                        {coverageAssessment.warningMessage && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {coverageAssessment.warningMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Answer More - only if not strong */}
                {coverageAssessment.recommendation !== 'strong' && (
                    <button
                        onClick={onAnswerMore}
                        className="flex-1 px-6 py-4 rounded-xl font-bold border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                        ← {t.answerMore}
                    </button>
                )}

                {/* Proceed */}
                <button
                    onClick={onProceed}
                    className="flex-1 px-6 py-4 rounded-xl font-bold bg-primary-600 text-white hover:bg-primary-500 transition-all shadow-lg hover:shadow-primary-500/25"
                >
                    {coverageAssessment.recommendation === 'weak' ? t.proceedAnyway : t.generateOutline} →
                </button>
            </div>
        </motion.div>
    )
}
