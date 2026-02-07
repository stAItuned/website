'use client'

import { AnimatePresence } from 'framer-motion'
import { Contribution, InterviewQnA, CoverageAssessment } from '@/lib/types/contributor'
import { ProgressIndicator } from '../components/ProgressIndicator'
import { AssistancePanel } from '../components/AssistancePanel'

// Extracted components and hook
import {
    useInterviewState,
    BriefExpander,
    InterviewQuestion,
    InterviewHistory,
    LoadingState,
    ErrorState,
    RateLimitState
} from './interview'

interface StepInterviewProps {
    contribution: Contribution
    onNext: (history: InterviewQnA[], coverageAssessment?: CoverageAssessment) => void
    translations: any
    language: 'it' | 'en'
}

/**
 * StepInterview - Guided interview with question cap and coverage tracking.
 * Enhanced with progress indicator, "I'm done" button, and coverage assessment.
 * 
 * Refactored to use modular components:
 * - useInterviewState: All state management and handlers
 * - BriefExpander: Collapsible brief display
 * - InterviewQuestion: Current question card
 * - InterviewHistory: Review past Q&A
 * - LoadingState, ErrorState, RateLimitState: UI state cards
 */
export function StepInterview({ contribution, onNext, translations, language }: StepInterviewProps) {
    const state = useInterviewState({
        contribution,
        language,
        onComplete: onNext
    })

    // Format progress text
    const progressText = translations.questionProgress
        ?.replace('{current}', String(Math.min(state.questionNumber, state.maxQuestions)))
        ?.replace('{max}', String(state.maxQuestions)) || `${state.questionNumber}/${state.maxQuestions}`

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-32">
            {/* Brief Expander */}
            <BriefExpander
                brief={contribution.brief}
                isOpen={state.showBrief}
                onToggle={() => state.setShowBrief(!state.showBrief)}
                translations={translations.briefExpander || {}}
            />

            {/* Header with Progress */}
            <div className="text-center space-y-3">
                <h2 className="text-xl font-bold">{translations.title}</h2>

                {/* Progress Indicator */}
                <ProgressIndicator
                    current={Math.min(state.questionNumber, state.maxQuestions)}
                    max={state.maxQuestions}
                    text={progressText}
                />

                {/* Dot indicators for navigation */}
                <div className="flex justify-center gap-1.5 pt-2">
                    {Array.from({ length: state.history.length + (state.currentQuestion ? 1 : 0) }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-500 ${idx === state.activeIndex ? 'w-10 bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm' : 'w-2 bg-slate-200 dark:bg-slate-800'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="min-h-[400px] flex flex-col relative">
                <AnimatePresence mode="wait">
                    {/* Loading State */}
                    {state.isGenerating ? (
                        <LoadingState translations={translations} />
                    ) : state.isReviewing && state.activeHistoryItem ? (
                        /* Review Past Question */
                        <InterviewHistory
                            historyItem={state.activeHistoryItem}
                            index={state.activeIndex}
                            maxQuestions={state.maxQuestions}
                            onBack={state.handleBack}
                            onForward={state.handleForward}
                            canGoBack={state.activeIndex > 0}
                            translations={translations}
                        />
                    ) : state.getRemaining('gemini', 'questionGeneration') === 0 && !state.currentQuestion ? (
                        /* Rate Limit State */
                        <RateLimitState
                            resetTime={state.getResetTime('gemini', 'questionGeneration')}
                            onProceed={() => onNext(state.history, state.coverageAssessment || undefined)}
                            translations={translations}
                        />
                    ) : state.generationError ? (
                        /* Error State */
                        <ErrorState
                            error={state.generationError}
                            onRetry={() => state.generateQuestion()}
                            onProceed={state.history.length > 0 ? () => onNext(state.history, state.coverageAssessment || undefined) : undefined}
                            hasHistory={state.history.length > 0}
                        />
                    ) : state.currentQuestion ? (
                        /* Current Active Question */
                        <InterviewQuestion
                            question={state.currentQuestion}
                            questionNumber={state.questionNumber}
                            maxQuestions={state.maxQuestions}
                            progressText={progressText}
                            userAnswer={state.userAnswer}
                            assistanceTypeResolved={state.assistanceTypeResolved}
                            onAnswerChange={state.setUserAnswer}
                            onSubmit={state.handleAnswerSubmit}
                            onBack={state.handleBack}
                            onImDone={state.handleImDone}
                            onFetchAssistance={state.handleFetchAssistance}
                            hasHistory={state.history.length > 0}
                            translations={translations}
                        />
                    ) : null}
                </AnimatePresence>
            </div>

            {/* Assistance Panel */}
            <AssistancePanel
                isOpen={state.showAssistance}
                onClose={() => state.setShowAssistance(false)}
                isLoading={state.isAssistanceLoading}
                suggestions={state.assistanceSuggestions}
                onSelect={state.handleUseSuggestion}
                onGenerateAnswer={state.handleGenerateAnswerFromSources}
                generatedAnswer={state.generatedAnswer}
                isGeneratingAnswer={state.isGeneratingAnswer}
                cached={state.assistanceCached}
                model={state.assistanceModel}
                translations={translations.assistance}
                type={state.assistanceTypeResolved || 'examples'}
            />
        </div>
    )
}
