'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AssistanceSuggestion, AssistanceType, Contribution, GeneratedQuestion, InterviewQnA, CoverageAssessment, DEFAULT_MAX_QUESTIONS } from '@/lib/types/contributor'
import { useAuth } from '@/components/auth/AuthContext'
import { useAIUsage } from '@/lib/hooks/use-ai-usage'
import { useDebounce } from '@/hooks/useDebounce'

interface UseInterviewStateProps {
    contribution: Contribution
    language: 'it' | 'en'
    onComplete: (history: InterviewQnA[], coverageAssessment?: CoverageAssessment) => void
}

interface UseInterviewStateReturn {
    // State
    history: InterviewQnA[]
    currentQuestion: GeneratedQuestion | null
    isGenerating: boolean
    userAnswer: string
    activeIndex: number
    maxQuestions: number
    coverageAssessment: CoverageAssessment | null
    generationError: string | null

    // Assistance state
    showAssistance: boolean
    isAssistanceLoading: boolean
    assistanceSuggestions: AssistanceSuggestion[]
    assistanceTypeResolved: AssistanceType | null
    assistanceCached: boolean
    assistanceModel: string | null
    generatedAnswer: string | null
    isGeneratingAnswer: boolean

    // Brief expander state
    showBrief: boolean
    setShowBrief: (show: boolean) => void

    // Rate limit helpers
    getRemaining: (provider: 'gemini' | 'perplexity', operation: string) => number
    getResetTime: (provider: 'gemini' | 'perplexity', operation: string) => string

    // Computed
    questionNumber: number
    progressPercentage: number
    isReviewing: boolean
    activeHistoryItem: InterviewQnA | null

    // Handlers
    setUserAnswer: (answer: string) => void
    handleAnswerSubmit: (skipped?: boolean) => void
    handleBack: () => void
    handleForward: () => void
    handleImDone: () => void
    handleFetchAssistance: () => void
    handleGenerateAnswerFromSources: () => void
    handleUseSuggestion: (text: string) => void
    setShowAssistance: (show: boolean) => void
    generateQuestion: (forceComplete?: boolean, overrideHistory?: InterviewQnA[]) => void
}

/**
 * Custom hook that manages all interview step state and logic.
 * Extracts complex state management from the component.
 */
export function useInterviewState({
    contribution,
    language,
    onComplete
}: UseInterviewStateProps): UseInterviewStateReturn {
    const { user } = useAuth()
    const cacheKey = `contributor_current_question_${contribution.id}`

    // Core interview state
    const [history, setHistory] = useState<InterviewQnA[]>(contribution.interviewHistory || [])
    const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuestion | null>(contribution.currentQuestion || null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [userAnswer, setUserAnswer] = useState('')
    const [isRestored, setIsRestored] = useState(false)

    // Ensure activeIndex doesn't exceed history bounds
    const safeActiveIndex = Math.min(contribution.interviewHistory?.length || 0, history.length)
    const [activeIndex, setActiveIndex] = useState(safeActiveIndex)
    const [maxQuestions, setMaxQuestions] = useState(DEFAULT_MAX_QUESTIONS)

    const [coverageAssessment, setCoverageAssessment] = useState<CoverageAssessment | null>(null)

    // Assistance State
    const [showAssistance, setShowAssistance] = useState(false)
    const [isAssistanceLoading, setIsAssistanceLoading] = useState(false)
    const [assistanceSuggestions, setAssistanceSuggestions] = useState<AssistanceSuggestion[]>([])
    const [generationError, setGenerationError] = useState<string | null>(null)
    const [generatedAnswer, setGeneratedAnswer] = useState<string | null>(null)
    const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false)
    const [assistanceCached, setAssistanceCached] = useState(false)
    const [assistanceModel, setAssistanceModel] = useState<string | null>(null)

    // Brief expander state
    const [showBrief, setShowBrief] = useState(false)

    const { getRemaining, refreshUsage, getResetTime } = useAIUsage()
    const isFirstRender = useRef(true)
    const hasSyncedRef = useRef(false)

    // Computed values
    const questionNumber = history.length + 1
    const progressPercentage = Math.min(100, (history.length / maxQuestions) * 100)
    const isReviewing = activeIndex < history.length
    const activeHistoryItem = isReviewing ? history[activeIndex] : null

    const readCachedQuestion = useCallback((): GeneratedQuestion | null => {
        if (typeof window === 'undefined') return null
        try {
            const raw = localStorage.getItem(cacheKey)
            if (!raw) return null
            const parsed = JSON.parse(raw) as GeneratedQuestion
            if (!parsed?.id || !parsed?.text) return null
            return parsed
        } catch {
            return null
        }
    }, [cacheKey])

    const clearCachedQuestion = useCallback(() => {
        if (typeof window === 'undefined') return
        try {
            localStorage.removeItem(cacheKey)
        } catch {
            // Ignore cache removal failures
        }
    }, [cacheKey])

    const cacheQuestion = useCallback((question: GeneratedQuestion | null) => {
        if (typeof window === 'undefined') return
        try {
            if (!question) {
                localStorage.removeItem(cacheKey)
                return
            }
            localStorage.setItem(cacheKey, JSON.stringify(question))
        } catch {
            // Ignore cache write failures
        }
    }, [cacheKey])

    // Sync active index with history length when a new question arrives
    useEffect(() => {
        if (currentQuestion) {
            setActiveIndex(history.length)
            // Reset assistance state
            setShowAssistance(false)
            setAssistanceSuggestions([])
            setGenerationError(null)
            setGeneratedAnswer(null)
            setAssistanceCached(false)
            setAssistanceModel(null)
        }
    }, [currentQuestion, history.length])

    // Restore cached question on mount (avoid regenerating on refresh)
    useEffect(() => {
        const answeredIds = new Set(history.map((item) => item.questionId))

        if (currentQuestion && answeredIds.has(currentQuestion.id)) {
            setCurrentQuestion(null)
            clearCachedQuestion()
            setIsRestored(true)
            return
        }

        if (!currentQuestion) {
            const cached = readCachedQuestion()
            if (cached && !answeredIds.has(cached.id)) {
                setCurrentQuestion(cached)
            } else if (cached) {
                clearCachedQuestion()
            }
        }
        setIsRestored(true)
    }, [clearCachedQuestion, currentQuestion, history, readCachedQuestion])

    // Sync latest interview state from server on mount to survive refresh
    useEffect(() => {
        const syncFromServer = async () => {
            if (!user || !contribution.id || hasSyncedRef.current) return
            hasSyncedRef.current = true
            try {
                const res = await fetch(`/api/contributor/get-contribution?id=${contribution.id}`, {
                    headers: { 'Authorization': `Bearer ${await user.getIdToken()}` }
                })
                const json = await res.json()
                if (!json?.success || !json?.contribution) return

                const serverContribution = json.contribution as Contribution
                const serverHistory = serverContribution.interviewHistory || []

                if (serverHistory.length > history.length) {
                    setHistory(serverHistory)
                }

                if (serverContribution.currentQuestion && !currentQuestion) {
                    setCurrentQuestion(serverContribution.currentQuestion)
                    cacheQuestion(serverContribution.currentQuestion)
                }
            } catch (e) {
                console.error('Failed to sync interview state', e)
            }
        }

        syncFromServer()
    }, [cacheQuestion, contribution.id, currentQuestion, history.length, user])

    // Initial Question Generation
    useEffect(() => {
        if (!isRestored) return
        if (isFirstRender.current) {
            isFirstRender.current = false
            // Always generate if we don't have a current question (resuming session)
            if (!currentQuestion) {
                generateQuestion()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRestored])

    const saveProgress = useCallback(async (payload: Partial<Contribution>) => {
        if (!user) return
        try {
            await fetch('/api/contributor/save-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    contributionId: contribution.id,
                    data: payload
                })
            })
        } catch (e) {
            console.error("Auto-save failed", e)
        }
    }, [contribution.id, user])

    // Auto-save with debounce
    const debouncedSave = useDebounce(async (updatedHistory: InterviewQnA[], question: GeneratedQuestion | null) => {
        await saveProgress({
            interviewHistory: updatedHistory,
            currentQuestion: question,
            currentStep: 'interview',
            updatedAt: new Date().toISOString()
        })
    }, 1000)

    const generateQuestion = useCallback(async (forceComplete: boolean = false, overrideHistory?: InterviewQnA[]) => {
        if (!user) return

        const currentHistory = overrideHistory || history

        setIsGenerating(true)
        setGenerationError(null)

        try {
            const res = await fetch('/api/contributor/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    brief: contribution.brief,
                    interviewHistory: currentHistory,
                    contributionId: contribution.id,
                    language,
                    forceComplete,
                    maxQuestions
                })
            })

            if (res.status === 429) {
                const json = await res.json()
                console.warn("Rate limit exceeded", json)
                await refreshUsage()
                setIsGenerating(false)
                return
            }

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`)
            }

            const json = await res.json()

            if (!json.success) {
                throw new Error(json.error?.message || 'Failed to generate question')
            }

            if (json.data) {
                if (json.data.coverageAssessment) {
                    setCoverageAssessment(json.data.coverageAssessment)
                }

                if (json.data.maxQuestions) {
                    setMaxQuestions(json.data.maxQuestions)
                }

                if (json.data.readyForOutline) {
                    setIsGenerating(false)
                    clearCachedQuestion()
                    await saveProgress({
                        currentQuestion: null,
                        currentStep: 'interview',
                        updatedAt: new Date().toISOString()
                    })
                    onComplete(currentHistory, json.data.coverageAssessment)
                    return
                }

                if (json.data.questions && json.data.questions.length > 0) {
                    const nextQuestion = json.data.questions[0]
                    setCurrentQuestion(nextQuestion)
                    cacheQuestion(nextQuestion)
                    await saveProgress({
                        currentQuestion: nextQuestion,
                        currentStep: 'interview',
                        updatedAt: new Date().toISOString()
                    })
                } else {
                    console.error('No questions returned from API')
                    setGenerationError('Unable to generate next question. Please try again.')
                }

                refreshUsage()
            }
        } catch (err) {
            console.error('Error generating question:', err)
            setGenerationError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsGenerating(false)
        }
    }, [user, history, contribution.brief, contribution.id, language, maxQuestions, onComplete, refreshUsage, cacheQuestion, clearCachedQuestion, saveProgress])

    const conceptualDataPoints = new Set([
        'thesis_depth',
        'context_relevance',
        'author_expertise',
        'key_mechanisms',
        'key_points',
        'thesis'
    ])

    const evidenceDataPoints = new Set(['evidence', 'examples', 'claims'])

    const assistanceTypeResolved: AssistanceType | null = currentQuestion
        ? (conceptualDataPoints.has(currentQuestion.dataPoint)
            ? 'drafting'
            : evidenceDataPoints.has(currentQuestion.dataPoint)
                ? (currentQuestion.assistanceType || 'examples')
                : (currentQuestion.assistanceType || 'examples'))
        : null

    const handleFetchAssistance = useCallback(async () => {
        if (!currentQuestion || !user) return

        setShowAssistance(true)
        if (assistanceSuggestions.length > 0) return

        const assistanceType = assistanceTypeResolved || 'examples'
        const assistancePrompt = currentQuestion.assistancePrompt || currentQuestion.text

        setIsAssistanceLoading(true)
        try {
            const useGemini = assistanceType === 'drafting' || assistanceType === 'definition'
            const endpoint = useGemini
                ? '/api/contributor/generate-answer-suggestions'
                : '/api/contributor/find-assistance'

            const payload = useGemini ? {
                brief: contribution.brief,
                question: currentQuestion,
                interviewHistory: history,
                language
            } : {
                query: assistancePrompt,
                assistanceType,
                context: {
                    topic: contribution.brief.topic,
                    thesis: contribution.brief.thesis
                },
                language
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify(payload)
            })

            const json = await res.json()
            if (json.success) {
                setAssistanceSuggestions(json.data.suggestions)
                setAssistanceCached(Boolean(json.cached))
                setAssistanceModel(typeof json.model === 'string' ? json.model : null)
                refreshUsage()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsAssistanceLoading(false)
        }
    }, [currentQuestion, user, assistanceSuggestions.length, contribution.brief, history, language, refreshUsage, assistanceTypeResolved])

    const handleUseSuggestion = useCallback((text: string) => {
        setUserAnswer((prev) => {
            const separator = prev.trim() ? '\n\n' : ''
            return prev + separator + text
        })
        setShowAssistance(false)
    }, [])

    const handleGenerateAnswerFromSources = useCallback(async () => {
        if (!currentQuestion || !user) return
        if (assistanceSuggestions.length === 0) return
        if (isGeneratingAnswer) return

        setIsGeneratingAnswer(true)
        try {
            const res = await fetch('/api/contributor/generate-answer-from-sources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    brief: contribution.brief,
                    question: currentQuestion,
                    interviewHistory: history,
                    suggestions: assistanceSuggestions,
                    language
                })
            })

            const json = await res.json()
            if (json.success && json.data?.answer) {
                setGeneratedAnswer(json.data.answer)
            }
        } catch (error) {
            console.error('Failed to generate answer from sources', error)
        } finally {
            setIsGeneratingAnswer(false)
        }
    }, [assistanceSuggestions, contribution.brief, currentQuestion, history, isGeneratingAnswer, language, user])

    const handleAnswerSubmit = useCallback(async (skipped: boolean = false) => {
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

        clearCachedQuestion()
        await saveProgress({
            interviewHistory: newHistory,
            currentQuestion: null,
            currentStep: 'interview',
            updatedAt: new Date().toISOString()
        })
        debouncedSave(newHistory, null)
        generateQuestion(false, newHistory)
    }, [currentQuestion, user, userAnswer, history, debouncedSave, generateQuestion, clearCachedQuestion, saveProgress])

    const handleImDone = useCallback(() => {
        generateQuestion(true, history)
    }, [generateQuestion, history])

    const handleBack = useCallback(() => {
        if (activeIndex > 0) setActiveIndex(prev => prev - 1)
    }, [activeIndex])

    const handleForward = useCallback(() => {
        if (activeIndex < history.length) setActiveIndex(prev => prev + 1)
    }, [activeIndex, history.length])

    return {
        // State
        history,
        currentQuestion,
        isGenerating,
        userAnswer,
        activeIndex,
        maxQuestions,
        coverageAssessment,
        generationError,

        // Assistance state
        showAssistance,
        isAssistanceLoading,
        assistanceSuggestions,
        assistanceTypeResolved,
        assistanceCached,
        assistanceModel,
        generatedAnswer,
        isGeneratingAnswer,

        // Brief expander state
        showBrief,
        setShowBrief,

        // Rate limit helpers
        getRemaining,
        getResetTime,

        // Computed
        questionNumber,
        progressPercentage,
        isReviewing,
        activeHistoryItem,

        // Handlers
        setUserAnswer,
        handleAnswerSubmit,
        handleBack,
        handleForward,
        handleImDone,
        handleFetchAssistance,
        handleGenerateAnswerFromSources,
        handleUseSuggestion,
        setShowAssistance,
        generateQuestion
    }
}
