'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthContext'
import { contributeTranslations, ContributeLanguage } from '@/lib/i18n/contribute-translations'
import { useLearnLocale } from '@/lib/i18n'
import { Contribution, ContributorBrief, CoverageAssessment, InterviewQnA } from '@/lib/types/contributor'
import { StepPitch } from './steps/StepPitch'
import { StepAgreement } from './steps/StepAgreement'
import { StepInterview } from './steps/StepInterview'
import { StepOutline } from './steps/StepOutline'
import { StepReview } from './steps/StepReview'
import { StepFinal } from './steps/StepFinal'
import { StepSourceDiscovery } from './steps/StepSourceDiscovery'

type WizardStep = 'pitch' | 'agreement' | 'interview' | 'coverage_review' | 'source_discovery' | 'outline' | 'review'

export default function WizardClient() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user, loading } = useAuth()
    const { locale } = useLearnLocale()

    // Initialize state
    // Load initial state from localStorage immediately to prevent flashes
    const getInitialState = () => {
        if (typeof window === 'undefined') return {
            step: 'pitch' as WizardStep, data: {
                path: (searchParams.get('path') as any) || 'autonomy',
                language: (locale as ContributeLanguage) || 'it',
                brief: {
                    topic: '',
                    target: 'newbie',
                    format: 'tutorial',
                    thesis: '',
                    hasExample: false,
                    sources: []
                },
                interviewHistory: []
            }
        }

        const savedState = localStorage.getItem('contributor_wizard_state')
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState)
                if (parsed.step && parsed.data) {
                    return { step: parsed.step as WizardStep, data: parsed.data }
                }
            } catch (e) {
                console.error("Failed to parse saved state", e)
            }
        }

        return {
            step: 'pitch' as WizardStep, data: {
                path: (searchParams.get('path') as any) || 'autonomy',
                language: (locale as ContributeLanguage) || 'it',
                brief: {
                    topic: '',
                    target: 'newbie',
                    format: 'tutorial',
                    thesis: '',
                    hasExample: false,
                    sources: []
                },
                interviewHistory: []
            }
        }
    }

    const initialState = getInitialState()
    const [step, setStep] = useState<WizardStep>(initialState.step)
    const [data, setData] = useState<Partial<Contribution>>(initialState.data)
    const [coverageAssessment, setCoverageAssessment] = useState<CoverageAssessment | null>(null)

    const lang = locale as ContributeLanguage
    const t = contributeTranslations[lang].wizard

    // Sync data.language when locale changes (optional, but good for consistency)
    useEffect(() => {
        setData(prev => ({ ...prev, language: lang }))
    }, [lang])

    // State Persistence (LocalStorage) to handle Auth Redirects
    // Effect to validte and possibly refresh state if we have an ID in URL
    useEffect(() => {
        const id = searchParams.get('id')
        // Only override if we have an ID and it matches what we might expect, OR if we are empty
        if (id && user) {
            fetchContribution(id)
        }
    }, [searchParams, user])

    // Resume from DB if ID is provided


    const fetchContribution = async (id: string) => {
        if (!user) return
        try {
            const token = await user.getIdToken()
            const res = await fetch(`/api/contributor/get-contribution?id=${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json = await res.json()
            if (json.success) {
                setData(json.contribution)
                setStep(json.contribution.currentStep || 'pitch')
            }
        } catch (e) {
            console.error("Failed to fetch contribution", e)
        }
    }

    // New: If user is logged in and we are at Step 1 (Pitch) but have NO data, maybe check DB? 
    // But user asked to use LocalStorage. 
    // Let's add a "Sync" effect: If we are past Step 2, and user is logged in, but we don't have an ID (e.g. lost in state), we might need to recover?
    // Actually simplicity is key. The current LocalStorage restoration IS the feature.

    useEffect(() => {
        // Save state whenever it changes
        localStorage.setItem('contributor_wizard_state', JSON.stringify({ step, data }))
    }, [step, data])

    useEffect(() => {
        // Scroll to top on step change
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [step])

    // Handlers
    const handlePitchSubmit = (brief: ContributorBrief) => {
        setData(prev => ({ ...prev, brief }))
        setStep('agreement')
    }

    const handleAgreementComplete = (contribution: Contribution) => {
        setData(contribution) // Now we have ID and full object

        // Skip Interview if "Autonomy" path -> Done
        if (contribution.path === 'autonomy') {
            setStep('review') // Go straight to review/done
        } else {
            setStep('interview')
        }
    }

    const handleInterviewComplete = (history: InterviewQnA[], coverage?: CoverageAssessment) => {
        setData(prev => ({ ...prev, interviewHistory: history }))

        // Store coverage assessment
        if (coverage) {
            setCoverageAssessment(coverage)
        }

        // If "Interview" path (done-for-you), skip outline, go to final review
        if (data.path === 'interview') {
            setStep('review')
        } else {
            // Guided path -> go to Coverage Review first
            setStep('coverage_review')
        }
    }

    const handleCoverageReviewProceed = () => {
        setStep('source_discovery')
    }

    const handleCoverageReviewAnswerMore = () => {
        setStep('interview')
    }

    const handleSourceDiscoveryComplete = async (discoveryData: any) => {
        setData(prev => ({ ...prev, sourceDiscovery: discoveryData }))

        // Save to DB
        if (user && data.id) {
            try {
                const token = await user.getIdToken()
                await fetch('/api/contributor/save-progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        contributionId: data.id,
                        data: { sourceDiscovery: discoveryData }
                    })
                })
            } catch (e) {
                console.error("Auto-save failed", e)
            }
        }

        setStep('outline')
    }

    const handleOutlineComplete = () => {
        setStep('review')
    }

    const handleBack = () => {
        switch (step) {
            case 'agreement':
                setStep('pitch')
                break
            case 'interview':
                setStep('agreement')
                break
            case 'coverage_review':
                setStep('interview')
                break
            case 'source_discovery':
                setStep('coverage_review')
                break
            case 'outline':
                setStep('source_discovery')
                break
            case 'review':
                if (data.path === 'autonomy') setStep('agreement')
                else if (data.path === 'interview') setStep('interview')
                else setStep('outline')
                break
            default:
                break
        }
    }

    // Render Step
    const renderStep = () => {
        switch (step) {
            case 'pitch':
                return <StepPitch
                    initialData={data.brief}
                    onNext={handlePitchSubmit}
                    translations={t.pitch}
                />
            case 'agreement':
                // Ensure brief exists
                if (!data.brief) return <div>Error: Missing Brief</div>

                return <StepAgreement
                    brief={data.brief}
                    path={data.path as any}
                    language={lang}
                    onNext={handleAgreementComplete}
                    translations={t.agreement}
                />
            case 'interview':
                // Ensure we have a valid contribution object (created in step 2)
                if (!data.id) return <div className="p-10 text-center animate-pulse">Initalizing session...</div>

                return <StepInterview
                    contribution={data as Contribution}
                    language={lang}
                    onNext={handleInterviewComplete}
                    translations={t.interview}
                />
            case 'outline':
                if (!data.id) return <div>Error: Missing Contribution ID</div>

                return <StepOutline
                    contribution={data as Contribution}
                    onNext={handleOutlineComplete}
                    translations={t.outline}
                />
            case 'coverage_review':
                // Show coverage assessment with option to answer more or proceed
                if (!coverageAssessment) {
                    // Fallback if no coverage - just proceed to outline
                    return <div className="p-10 text-center">
                        <p>Valutazione in corso...</p>
                    </div>
                }

                return <StepReview
                    coverageAssessment={coverageAssessment}
                    interviewHistory={(data.interviewHistory || []) as InterviewQnA[]}
                    translations={t.review}
                    onProceed={handleCoverageReviewProceed}
                    onAnswerMore={handleCoverageReviewAnswerMore}
                />
            case 'source_discovery':
                if (!data.id) return <div>Error: Missing Contribution ID</div>

                return <StepSourceDiscovery
                    contribution={data as Contribution}
                    onNext={handleSourceDiscoveryComplete}
                    translations={t.sourceDiscovery}
                    language={lang}
                />
            case 'review':
                // Clear state on completion
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('contributor_wizard_state')
                }

                // Determine content based on path
                // Note: t.success might be undefined if TS doesn't know about the update yet, so guard it
                return <StepFinal contribution={data as Contribution} />
            default:
                return <div>Unknown Step</div>
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
            {/* Main Content */}
            <main className="pt-24 pb-20 max-w-4xl mx-auto px-6 space-y-8">

                {/* Inline Progress Bar */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                            {step === 'pitch' ? (
                                <Link href="/contribute" className="hover:text-primary-500 transition flex items-center gap-1">
                                    <span>←</span> Esci
                                </Link>
                            ) : (
                                <button
                                    onClick={handleBack}
                                    className="hover:text-primary-500 transition flex items-center gap-1"
                                >
                                    <span>←</span> Indietro
                                </button>
                            )}
                        </div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                            Step {(['pitch', 'agreement', 'interview', 'coverage_review', 'source_discovery', 'outline', 'review'].indexOf(step) + 1)} / 7
                        </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        {(['pitch', 'agreement', 'interview', 'coverage_review', 'source_discovery', 'outline', 'review'] as WizardStep[]).map((s, idx) => {
                            const stepIndex = ['pitch', 'agreement', 'interview', 'coverage_review', 'source_discovery', 'outline', 'review'].indexOf(step)
                            const isCompleted = stepIndex > idx
                            const isCurrent = stepIndex === idx

                            return (
                                <div
                                    key={s}
                                    className={`h-full transition-all duration-500 ease-out border-r border-white/20 last:border-0 ${isCompleted ? 'bg-green-500 flex-1' :
                                        isCurrent ? 'bg-primary-500 flex-1' :
                                            'bg-transparent flex-1 opacity-20'
                                        }`}
                                />
                            )
                        })}
                    </div>

                    {/* Step Label */}
                    <div className="text-center md:text-left">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary-500">
                            {t.steps[step]}
                        </span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
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
