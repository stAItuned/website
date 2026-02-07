'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { contributeTranslations } from '@/lib/i18n/contribute-translations'
import { Contribution, InterviewQnA } from '@/lib/types/contributor'

// Steps
import { StepPitch } from './steps/StepPitch'
import { StepAgreement } from './steps/StepAgreement'
import { StepInterview } from './steps/StepInterview'
import { StepOutline } from './steps/StepOutline'
import { StepReview } from './steps/StepReview'
import { StepFinal } from './steps/StepFinal'
import { StepSourceDiscovery } from './steps/StepSourceDiscovery'
import { StepDraftSubmission } from './steps/StepDraftSubmission'
import { StepResumeSelection } from './steps/StepResumeSelection'
import { StepPathIntro } from './steps/StepPathIntro'
import { StepGuidelines } from './steps/StepGuidelines'

// Hooks
import { useWizardState } from './hooks/useWizardState'
import { useWizardNavigation } from './hooks/useWizardNavigation'

/**
 * WizardClient - Main contributor wizard component.
 * 
 * Refactored to use modular hooks:
 * - useWizardState: State management, persistence, URL sync
 * - useWizardNavigation: Step handlers and navigation logic
 */
export default function WizardClient() {
    const state = useWizardState()
    const navigation = useWizardNavigation({
        step: state.step,
        setStep: state.setStep,
        data: state.data,
        setData: state.setData,
        setCoverageAssessment: state.setCoverageAssessment,
        user: state.user,
        lang: state.lang,
        searchParams: state.searchParams
    })

    const t = contributeTranslations[state.lang].wizard
    const { currentStepIndex, totalSteps, getStepsForPath } = navigation
    const currentPathSteps = getStepsForPath(state.data.path || 'guided')

    // Render Step
    const renderStep = () => {
        switch (state.step) {
            case 'resume_selection':
                return <StepResumeSelection
                    contributions={state.existingContributions}
                    onSelect={navigation.handleResumeSelect}
                    onStartNew={navigation.handleStartNew}
                />
            case 'path_intro':
                return <StepPathIntro
                    path={state.data.path as any}
                    onNext={() => state.setStep('pitch')}
                    translations={t.pathIntro}
                />
            case 'pitch':
                return <StepPitch
                    initialData={state.data.brief}
                    onNext={navigation.handlePitchSubmit}
                    translations={t.pitch}
                />
            case 'agreement':
                if (!state.data.brief) return <div>Error: Missing Brief</div>
                return <StepAgreement
                    brief={state.data.brief}
                    path={state.data.path as any}
                    language={state.lang}
                    onNext={navigation.handleAgreementComplete}
                    translations={t.agreement}
                    id={state.data.id}
                />
            case 'guidelines':
                return <StepGuidelines
                    translations={t.guidelines}
                    onNext={navigation.handleGuidelinesComplete}
                />
            case 'interview':
                if (!state.data.id) return <div className="p-10 text-center animate-pulse">Initializing session...</div>
                return <StepInterview
                    contribution={state.data as Contribution}
                    language={state.lang}
                    onNext={navigation.handleInterviewComplete}
                    translations={t.interview}
                />
            case 'outline':
                if (!state.data.id) return <div>Error: Missing Contribution ID</div>
                return <StepOutline
                    contribution={state.data as Contribution}
                    onNext={navigation.handleOutlineComplete}
                    translations={t.outline}
                />
            case 'coverage_review':
                if (!state.coverageAssessment) {
                    return <div className="p-10 text-center"><p>Valutazione in corso...</p></div>
                }
                return <StepReview
                    coverageAssessment={state.coverageAssessment}
                    interviewHistory={(state.data.interviewHistory || []) as InterviewQnA[]}
                    translations={t.review}
                    onProceed={navigation.handleCoverageReviewProceed}
                    onAnswerMore={navigation.handleCoverageReviewAnswerMore}
                />
            case 'source_discovery':
                if (!state.data.id) return <div>Error: Missing Contribution ID</div>
                return <StepSourceDiscovery
                    contribution={state.data as Contribution}
                    onNext={navigation.handleSourceDiscoveryComplete}
                    translations={t.sourceDiscovery}
                    language={state.lang}
                />
            case 'draft_submission':
                if (!state.data.id) return <div>Error: Missing Contribution ID</div>
                return <StepDraftSubmission
                    contribution={state.data as Contribution}
                    onNext={navigation.handleDraftSubmissionComplete}
                    translations={t.draftSubmission}
                />
            case 'review':
                // Clear state on completion
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('contributor_wizard_state')
                }
                return <StepFinal
                    contribution={state.data as Contribution}
                    onBackToSelection={() => state.setStep('resume_selection')}
                />
            default:
                return <div>Unknown Step</div>
        }
    }

    if (!state.isMounted) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900" />

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
            <main className="pt-24 pb-20 max-w-4xl mx-auto px-6 space-y-8">

                {/* Progress Bar */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                            {state.step === 'path_intro' || state.step === 'resume_selection' ? (
                                <Link href="/contribute" className="hover:text-primary-500 transition flex items-center gap-1">
                                    <span>←</span> Esci
                                </Link>
                            ) : (
                                <button
                                    onClick={navigation.handleBack}
                                    className="hover:text-primary-500 transition flex items-center gap-1"
                                >
                                    <span>←</span> Indietro
                                </button>
                            )}
                        </div>
                        {state.step !== 'resume_selection' && (
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                Step {currentStepIndex} / {totalSteps}
                            </div>
                        )}
                    </div>

                    {/* Progress Track */}
                    {state.step !== 'resume_selection' && (
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                            {currentPathSteps.map((s, idx) => {
                                const isCompleted = currentStepIndex > (idx + 1)
                                const isCurrent = currentPathSteps[idx] === state.step

                                return (
                                    <div
                                        key={s}
                                        className={`h-full transition-all duration-700 ease-out border-r border-white/10 last:border-0 ${isCompleted ? 'bg-gradient-to-r from-amber-400 to-amber-500 flex-1' :
                                            isCurrent ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 flex-1 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
                                                'bg-slate-200 dark:bg-slate-800 flex-1 opacity-20'
                                            }`}
                                    />
                                )
                            })}
                        </div>
                    )}

                    {/* Step Label */}
                    <div className="text-center md:text-left">
                        <span className="text-xs font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
                            {(t.steps as Record<string, string>)[state.step] || state.step}
                        </span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={state.step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
