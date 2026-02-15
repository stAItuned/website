'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Contribution, ContributorBrief, CoverageAssessment, InterviewQnA } from '@/lib/types/contributor'
import { ContributeLanguage } from '@/lib/i18n/contribute-translations'
import { WizardStep } from './useWizardState'

interface UseWizardNavigationProps {
    step: WizardStep
    setStep: (step: WizardStep) => void
    data: Partial<Contribution>
    setData: React.Dispatch<React.SetStateAction<Partial<Contribution>>>
    setCoverageAssessment: (assessment: CoverageAssessment | null) => void
    user: any
    lang: ContributeLanguage
    searchParams: URLSearchParams
}

interface UseWizardNavigationReturn {
    // Step handlers
    handlePitchSubmit: (brief: ContributorBrief) => void
    handleAgreementComplete: (contribution: Contribution) => void
    handleInterviewComplete: (history: InterviewQnA[], coverage?: CoverageAssessment) => void
    handleCoverageReviewProceed: () => void
    handleCoverageReviewAnswerMore: () => void
    handleSourceDiscoveryComplete: (discoveryData: any) => Promise<void>
    handleDraftSubmissionComplete: (draftContent?: string, isPending?: boolean) => Promise<void>
    handleOutlineComplete: () => void
    handleGuidelinesComplete: () => void

    // Navigation handlers
    handleBack: () => void
    handleResumeSelect: (contribution: Contribution) => void
    handleStartNew: () => void

    // Path configuration
    getStepsForPath: (path: string) => WizardStep[]
    currentStepIndex: number
    totalSteps: number
}

/**
 * Hook that manages wizard navigation and step handlers.
 * Contains all the business logic for transitioning between steps.
 */
export function useWizardNavigation({
    step,
    setStep,
    data,
    setData,
    setCoverageAssessment,
    user,
    lang,
    searchParams
}: UseWizardNavigationProps): UseWizardNavigationReturn {
    const router = useRouter()
    const isTerminalStatus = (status: Contribution['status']) =>
        status === 'review' || status === 'scheduled' || status === 'published'

    // Step handlers
    const handlePitchSubmit = useCallback((brief: ContributorBrief) => {
        setData(prev => ({ ...prev, brief }))
        setStep('agreement')
    }, [setData, setStep])

    const handleAgreementComplete = useCallback((contribution: Contribution) => {
        setData(contribution)
        router.push('/contribute')
    }, [router, setData])

    const handleInterviewComplete = useCallback((history: InterviewQnA[], coverage?: CoverageAssessment) => {
        setData(prev => ({ ...prev, interviewHistory: history }))
        if (coverage) {
            setCoverageAssessment(coverage)
        }
        if (data.path === 'interview') {
            setStep('outline')
        } else {
            setStep('coverage_review')
        }
    }, [data.path, setData, setCoverageAssessment, setStep])

    const handleCoverageReviewProceed = useCallback(() => {
        setStep('source_discovery')
    }, [setStep])

    const handleCoverageReviewAnswerMore = useCallback(() => {
        setStep('interview')
    }, [setStep])

    const handleSourceDiscoveryComplete = useCallback(async (discoveryData: any) => {
        setData(prev => ({ ...prev, sourceDiscovery: discoveryData }))

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
    }, [data.id, setData, setStep, user])

    const handleDraftSubmissionComplete = useCallback(async (draftContent?: string, isPending?: boolean) => {
        setData(prev => ({ ...prev, draftContent }))

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
                        data: {
                            draftContent,
                            currentStep: 'review',
                            status: isPending ? 'draft' : 'review'
                        }
                    })
                })
            } catch (e) {
                console.error("Auto-save failed", e)
            }
        }

        setStep('review')
    }, [data.id, setData, setStep, user])

    const handleOutlineComplete = useCallback(() => {
        if (data.path === 'interview') {
            setStep('review')
        } else {
            setStep('draft_submission')
        }
    }, [data.path, setStep])

    const handleGuidelinesComplete = useCallback(() => {
        setStep('draft_submission')
    }, [setStep])

    // Navigation handlers
    const handleBack = useCallback(() => {
        switch (step) {
            case 'resume_selection':
                setStep('path_intro')
                break
            case 'path_intro':
                router.push('/contribute')
                break
            case 'pitch':
                setStep('path_intro')
                break
            case 'agreement':
                setStep('pitch')
                break
            case 'guidelines':
                setStep('pitch')
                break
            case 'interview':
                setStep('pitch')
                break
            case 'coverage_review':
                setStep('interview')
                break
            case 'source_discovery':
                setStep('coverage_review')
                break
            case 'outline':
                if (data.path === 'interview') setStep('interview')
                else setStep('source_discovery')
                break
            case 'draft_submission':
                if (data.path === 'autonomy') setStep('guidelines')
                else setStep('outline')
                break
            case 'review':
                if (data.path === 'autonomy') setStep('draft_submission')
                else if (data.path === 'interview') setStep('outline')
                else setStep('draft_submission')
                break
        }
    }, [step, data.path, router, setStep])

    const handleResumeSelect = useCallback((c: Contribution) => {
        if (isTerminalStatus(c.status)) {
            router.push('/contributor-dashboard')
            return
        }
        const resolvedStep: WizardStep = c.generatedOutline && (c.currentStep === 'review' || c.currentStep === 'draft_submission')
            ? 'outline'
            : (c.currentStep || 'pitch')
        setData(c)
        setStep(resolvedStep)
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            url.searchParams.set('id', c.id)
            window.history.replaceState({}, '', url.toString())
            localStorage.setItem('contributor_wizard_state', JSON.stringify({ step: resolvedStep, data: c }))
        }
    }, [router, setData, setStep])

    const handleStartNew = useCallback(() => {
        const freshData: Partial<Contribution> = {
            path: (searchParams.get('path') as any) || 'autonomy',
            language: lang,
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
        setData(freshData)
        setStep('path_intro')

        if (typeof window !== 'undefined') {
            localStorage.setItem('contributor_wizard_state', JSON.stringify({ step: 'path_intro', data: freshData }))
        }
    }, [lang, searchParams, setData, setStep])

    // Path configuration
    const getStepsForPath = useCallback((path: string): WizardStep[] => {
        if (path === 'autonomy') {
            return ['path_intro', 'pitch', 'agreement', 'guidelines', 'draft_submission', 'review']
        }
        if (path === 'interview') {
            return ['path_intro', 'pitch', 'agreement', 'interview', 'outline', 'review']
        }
        // Guided (default)
        return ['path_intro', 'pitch', 'agreement', 'interview', 'coverage_review', 'source_discovery', 'outline', 'draft_submission', 'review']
    }, [])

    const currentPathSteps = getStepsForPath(data.path || 'guided')
    const currentStepIndex = currentPathSteps.indexOf(step) + 1
    const totalSteps = currentPathSteps.length

    return {
        handlePitchSubmit,
        handleAgreementComplete,
        handleInterviewComplete,
        handleCoverageReviewProceed,
        handleCoverageReviewAnswerMore,
        handleSourceDiscoveryComplete,
        handleDraftSubmissionComplete,
        handleOutlineComplete,
        handleGuidelinesComplete,
        handleBack,
        handleResumeSelect,
        handleStartNew,
        getStepsForPath,
        currentStepIndex,
        totalSteps
    }
}
