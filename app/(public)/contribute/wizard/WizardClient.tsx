'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { contributeTranslations } from '@/lib/i18n/contribute-translations'
import { Contribution, InterviewQnA } from '@/lib/types/contributor'
import { useAuth } from '@/components/auth/AuthContext' // Added useAuth

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
import { StepBecomeWriter } from './steps/StepBecomeWriter'

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
    const router = useRouter()
    const { user, loading: authLoading } = useAuth() // Get auth state directly
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

    // Writer Check
    const { isWriter, hasAgreement, checkWriterStatus, isLoadingContribution } = state

    // 1. Auth & Writer Protection
    useEffect(() => {
        if (authLoading) return

        // Case A: Not Logged In -> Redirect to Login
        if (!user) {
            router.replace('/signin?redirect=/contribute/wizard') // Redirect to login
            return
        }

        // Case B: Logged In but Writer Status Unknown -> Check it
        if (isWriter === null) {
            checkWriterStatus()
            return
        }

        // Case C: Logged In but Not Writer -> Redirect to Become Writer
        // We only check this if we are not already on the "become_writer" step (although that step is deprecated in favor of the page)
        if (isWriter === false) {
            const next = `/contribute/wizard${typeof window !== 'undefined' ? window.location.search : ''}`
            router.replace(`/become-writer?next=${encodeURIComponent(next)}`)
        }

    }, [user, authLoading, isWriter, checkWriterStatus, router])


    // Autonomy path now stays in wizard to collect the brief first.

    const t = contributeTranslations[state.lang].wizard
    const { currentStepIndex, totalSteps, getStepsForPath } = navigation
    const currentPathSteps = getStepsForPath(state.data.path || 'guided')

    // Render Step
    const renderStep = () => {
        switch (state.step) {
            case 'become_writer':
                // This case should ideally not be reached anymore due to redirect,
                // but keeping it for safety or redirecting manually here
                router.push('/become-writer')
                return null
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
                    onNext={(c) => {
                        navigation.handleAgreementComplete(c)
                        // Critical: Refresh writer status immediately so we don't trigger the stale-state cleanup
                        checkWriterStatus()
                    }}
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
                if (!state.data.id) return <div className="p-10 text-center"><p>Valutazione in corso...</p></div>
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

    if (!state.isMounted || authLoading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900" />

    // Protected Steps Logic: preventing rendering of sensitive steps until writer status is confirmed
    // This prevents "flashing" the interview question before the redirect happens
    const protectedSteps = [
        'interview', 'guidelines', 'coverage_review',
        'source_discovery', 'outline', 'draft_submission', 'review'
    ]

    // If we are not logged in or not a writer (and done loading), we shouldn't render the wizard at all
    // If we are in a protected step, we STRICTLY wait for writer confirmation (isWriter === true)
    // If step is public (Pitch, Agreement), we allow rendering and rely on the useEffect redirect if verification fails
    // ALSO: if we are loading the contribution from network (isLoadingContribution), we wait.
    const isProtectedStep = protectedSteps.includes(state.step as any)

    if (!user || (isProtectedStep && (isWriter !== true || hasAgreement !== true)) || (isWriter === false) || isLoadingContribution) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    }

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
                        {state.step !== 'resume_selection' && state.step !== 'become_writer' && (
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                Step {currentStepIndex} / {totalSteps}
                            </div>
                        )}
                    </div>

                    {/* Progress Track */}
                    {state.step !== 'resume_selection' && state.step !== 'become_writer' && (
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
