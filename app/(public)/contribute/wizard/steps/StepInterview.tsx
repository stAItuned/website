'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Contribution, GeneratedQuestion, InterviewQnA, CoverageAssessment } from '@/lib/types/contributor'
import { useAuth } from '@/components/auth/AuthContext'
import { DEFAULT_MAX_QUESTIONS } from '@/lib/ai/contributor-engine'
import { useAIUsage } from '@/lib/hooks/use-ai-usage'

interface StepInterviewProps {
    contribution: Contribution
    onNext: (history: InterviewQnA[], coverageAssessment?: CoverageAssessment) => void
    translations: any
    language: 'it' | 'en'
}

/**
 * StepInterview - Guided interview with question cap and coverage tracking
 * Enhanced with progress indicator, "I'm done" button, and coverage assessment
 */
export function StepInterview({ contribution, onNext, translations, language }: StepInterviewProps) {
    const { user } = useAuth()
    const [history, setHistory] = useState<InterviewQnA[]>(contribution.interviewHistory || [])
    const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuestion | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [userAnswer, setUserAnswer] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)
    const [maxQuestions, setMaxQuestions] = useState(DEFAULT_MAX_QUESTIONS)
    const [coverageAssessment, setCoverageAssessment] = useState<CoverageAssessment | null>(null)
    const { getRemaining, refreshUsage, getResetTime } = useAIUsage()
    const isFirstRender = useRef(true)

    // Current question number (1-based)
    const questionNumber = history.length + 1

    // Sync active index with history length when a new question arrives
    useEffect(() => {
        if (currentQuestion) {
            setActiveIndex(history.length)
        }
    }, [currentQuestion, history.length])

    // Initial Question Generation
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            if (history.length === 0) {
                generateQuestion()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const generateQuestion = async (forceComplete: boolean = false) => {
        if (!user) return

        // Client-side check
        // const remaining = getRemaining('gemini', 'questionGeneration');
        // Only block if we strictly know it's 0 (usage loaded)
        // If usage is null/loading, let the server decide (it will return 429)

        setIsGenerating(true)

        try {
            const res = await fetch('/api/contributor/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    brief: contribution.brief,
                    interviewHistory: history,
                    contributionId: contribution.id,
                    language,
                    forceComplete,
                    maxQuestions
                })
            })

            if (res.status === 429) {
                // Rate limit hit
                const json = await res.json();
                console.warn("Rate limit exceeded", json);
                await refreshUsage(); // Sync state
                return;
            }

            const json = await res.json()

            if (json.success && json.data) {
                // Store coverage for later
                if (json.data.coverageAssessment) {
                    setCoverageAssessment(json.data.coverageAssessment)
                }

                // Update max questions from server
                if (json.data.maxQuestions) {
                    setMaxQuestions(json.data.maxQuestions)
                }

                if (json.data.readyForOutline) {
                    onNext(history, json.data.coverageAssessment)
                    return
                }

                // Take the first question (engine returns array, we ask 1 by 1)
                if (json.data.questions && json.data.questions.length > 0) {
                    setCurrentQuestion(json.data.questions[0])
                }

                // Refresh usage after successful generation
                refreshUsage()
            }
        } catch (err) {
            console.error(err)
            setIsGenerating(false)
        }
    }

    const handleAnswerSubmit = async (skipped: boolean = false) => {
        if (!currentQuestion || !user) return

        const answerText = skipped ? "SKIPPED" : userAnswer

        const newItem: InterviewQnA = {
            questionId: currentQuestion.id,
            question: currentQuestion.text,
            answer: answerText,
            dataPoint: currentQuestion.dataPoint,
            answeredAt: new Date().toISOString()
        }

        const newHistory = [...history, newItem]
        setHistory(newHistory)
        setUserAnswer('')
        setCurrentQuestion(null)

        // Auto-save (optimistic)
        try {
            // Saving in background
            fetch('/api/contributor/save-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    contributionId: contribution.id,
                    data: {
                        interviewHistory: newHistory,
                        currentStep: 'interview'
                    }
                })
            })
        } catch (e) {
            console.error("Auto-save failed", e)
        } finally {
            // No op
        }

        // Generate next
        generateQuestion()
    }

    const handleImDone = () => {
        // Force complete - skip remaining questions and go to review
        generateQuestion(true)
    }

    const handleBack = () => {
        if (activeIndex > 0) setActiveIndex(prev => prev - 1)
    }

    const handleForward = () => {
        if (activeIndex < history.length) setActiveIndex(prev => prev + 1)
    }

    // Determine what to show
    const isReviewing = activeIndex < history.length
    const activeHistoryItem = isReviewing ? history[activeIndex] : null

    // Progress calculation
    const progressPercentage = Math.min(100, (history.length / maxQuestions) * 100)

    // Format progress text
    const progressText = translations.questionProgress
        ?.replace('{current}', String(Math.min(questionNumber, maxQuestions)))
        ?.replace('{max}', String(maxQuestions)) || `${questionNumber}/${maxQuestions}`

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-32">
            {/* Header with Progress */}
            <div className="text-center space-y-3">
                <h2 className="text-xl font-bold">{translations.title}</h2>

                {/* Progress Indicator */}
                <div className="space-y-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {progressText}
                    </span>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 max-w-xs mx-auto">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.3 }}
                            className="bg-primary-500 h-2 rounded-full"
                        />
                    </div>
                </div>

                {/* Dot indicators for navigation */}
                <div className="flex justify-center gap-1">
                    {Array.from({ length: history.length + (currentQuestion ? 1 : 0) }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all ${idx === activeIndex ? 'w-8 bg-primary-500' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="min-h-[400px] flex flex-col relative">
                <AnimatePresence mode="wait">
                    {/* Loading State */}
                    {isGenerating ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="bg-white dark:bg-slate-800 p-10 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-6 text-center h-full flex-1"
                        >
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0s' }} />
                                <div className="w-3 h-3 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                                <div className="w-3 h-3 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                            <p className="text-slate-500 font-medium">{translations.thinking}</p>
                        </motion.div>
                    ) : (isReviewing && activeHistoryItem) ? (
                        /* Review Past Question */
                        <motion.div
                            key={`hist-${activeIndex}`}
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="space-y-6 flex-1"
                        >
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <span className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                                    {translations.questionProgress?.replace('{current}', String(activeIndex + 1)).replace('{max}', String(maxQuestions)) || `Domanda ${activeIndex + 1}`}
                                </span>
                                <p className="text-lg font-medium text-slate-800 dark:text-slate-200">{activeHistoryItem.question}</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
                                <span className="text-xs font-bold uppercase text-primary-500 mb-2 block">La tua risposta</span>
                                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{activeHistoryItem.answer}</p>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={handleBack}
                                    disabled={activeIndex === 0}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                                >
                                    ← {translations.back || 'Indietro'}
                                </button>
                                <button
                                    onClick={handleForward}
                                    className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition shadow-lg"
                                >
                                    {translations.next || 'Avanti'} →
                                </button>
                            </div>
                        </motion.div>
                    ) : (getRemaining('gemini', 'questionGeneration') === 0 && !currentQuestion) ? (
                        /* Limit Reached State */
                        <motion.div
                            key="limit-reached"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="bg-amber-50 dark:bg-amber-900/20 p-10 rounded-2xl border border-amber-200 dark:border-amber-800 text-center flex flex-col items-center justify-center gap-4 flex-1"
                        >
                            <span className="text-4xl">⏳</span>
                            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">Limite Giornaliero Raggiunto</h3>
                            <p className="text-amber-800 dark:text-amber-200">
                                Hai terminato le domande disponibili per oggi. <br />
                                Il limite verrà reimpostato alle {getResetTime('gemini', 'questionGeneration')}.
                            </p>
                            <button
                                onClick={() => onNext(history, coverageAssessment || undefined)}
                                className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                            >
                                Procedi comunque (concludi qui)
                            </button>
                        </motion.div>
                    ) : currentQuestion ? (
                        /* Current Active Question */
                        <motion.div
                            key="current"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 flex-1"
                        >
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border-2 border-primary-500 shadow-xl relative overflow-hidden">
                                {/* Decorator */}
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl text-primary-500 leading-none -mt-2 -mr-2">?</div>

                                <span className="text-xs font-bold uppercase text-primary-600 mb-3 block tracking-wider">
                                    {progressText}
                                </span>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-relaxed">
                                    {currentQuestion.text}
                                </h3>

                                {/* Motivation Badge */}
                                {currentQuestion.motivation && (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 p-4 rounded-xl flex gap-3 items-start">
                                        <span className="text-xl">💡</span>
                                        <div>
                                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Perché te lo chiedo?</p>
                                            <p className="text-sm text-amber-900/80 dark:text-amber-200/80 italic">
                                                &quot;{currentQuestion.motivation}&quot;
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <textarea
                                    autoFocus
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder={translations.inputPlaceholder || "Scrivi la tua risposta..."}
                                    rows={4}
                                    className="w-full p-5 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none shadow-sm text-lg transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            if (userAnswer.trim()) handleAnswerSubmit()
                                        }
                                    }}
                                />

                                <div className="flex items-center justify-between gap-4">
                                    <button
                                        onClick={handleBack}
                                        disabled={history.length === 0}
                                        className="px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-0 transition"
                                    >
                                        ← {translations.back || 'Indietro'}
                                    </button>

                                    <div className="flex items-center gap-3">
                                        {/* Skip Button */}
                                        <button
                                            onClick={() => handleAnswerSubmit(true)}
                                            className="px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                        >
                                            {translations.skip || "Salta"}
                                        </button>

                                        {/* I'm Done Button - only show after at least 1 answer */}
                                        {history.length >= 1 && (
                                            <button
                                                onClick={handleImDone}
                                                className="px-4 py-3 rounded-xl font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 transition"
                                            >
                                                {translations.imDone || "Ho detto tutto"}
                                            </button>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            onClick={() => handleAnswerSubmit()}
                                            disabled={!userAnswer.trim()}
                                            className="px-8 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-primary-500/25 transform active:scale-95"
                                        >
                                            {translations.submit || 'Invia Risposta'} ➤
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    )
}
