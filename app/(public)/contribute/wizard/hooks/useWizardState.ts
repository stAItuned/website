'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { useLearnLocale } from '@/lib/i18n'
import { ContributeLanguage } from '@/lib/i18n/contribute-translations'
import { resolveAgreementAccepted } from '@/lib/contributor/agreementAcceptance'
import { Contribution, ContributorBrief, CoverageAssessment, InterviewQnA } from '@/lib/types/contributor'

export type WizardStep = 'become_writer' | 'resume_selection' | 'path_intro' | 'pitch' | 'agreement' | 'guidelines' | 'interview' | 'coverage_review' | 'source_discovery' | 'outline' | 'draft_submission' | 'review'

interface UseWizardStateReturn {
    // Core state
    step: WizardStep
    setStep: (step: WizardStep) => void
    data: Partial<Contribution>
    setData: React.Dispatch<React.SetStateAction<Partial<Contribution>>>
    coverageAssessment: CoverageAssessment | null
    setCoverageAssessment: (assessment: CoverageAssessment | null) => void

    // Resume selection state
    existingContributions: Contribution[]
    setExistingContributions: (contributions: Contribution[]) => void
    hasCheckedContributions: boolean
    setHasCheckedContributions: (checked: boolean) => void

    // Writer status
    isWriter: boolean | null
    hasAgreement: boolean | null
    checkWriterStatus: () => Promise<void>

    // Mounting state
    isMounted: boolean

    // Helpers
    lang: ContributeLanguage
    user: ReturnType<typeof useAuth>['user']
    searchParams: ReturnType<typeof useSearchParams>
    isLoadingContribution: boolean
}

/**
 * Hook that manages wizard state, persistence, and URL sync.
 * Handles localStorage save/restore and URL parameter syncing.
 */
export function useWizardState(): UseWizardStateReturn {
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const { locale } = useLearnLocale()
    const lang = locale as ContributeLanguage

    // Initialize state
    const [isMounted, setIsMounted] = useState(false)
    const [step, setStep] = useState<WizardStep>('path_intro')
    const [data, setData] = useState<Partial<Contribution>>({
        path: (searchParams.get('path') as any) || 'guided',
        language: lang || 'it',
        brief: {
            topic: '',
            target: 'newbie',
            format: 'tutorial',
            thesis: '',
            hasExample: false,
            sources: []
        },
        interviewHistory: []
    })
    const [coverageAssessment, setCoverageAssessment] = useState<CoverageAssessment | null>(null)

    // Resume Selection State
    const [existingContributions, setExistingContributions] = useState<Contribution[]>([])
    const [hasCheckedContributions, setHasCheckedContributions] = useState(false)
    const [isWriter, setIsWriter] = useState<boolean | null>(null)
    const [hasAgreement, setHasAgreement] = useState<boolean | null>(null)
    const [isLoadingContribution, setIsLoadingContribution] = useState(() => {
        // Initialize to true if we have an ID in the URL to prevent rendering stale data
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            return !!params.get('id')
        }
        return false
    })

    const checkWriterStatus = useCallback(async () => {
        if (!user) return
        try {
            const token = await user.getIdToken()
            const res = await fetch('/api/user/writer-status', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json: unknown = await res.json()
            if (res.ok && typeof json === 'object' && json) {
                const j = json as { isWriter?: unknown; hasAgreement?: unknown }
                setIsWriter(Boolean(j.isWriter))
                setHasAgreement(typeof j.hasAgreement === 'boolean' ? j.hasAgreement : false)
                return
            }
            setIsWriter(false)
            setHasAgreement(false)
        } catch (e) {
            console.error("Failed to check writer status", e)
            setIsWriter(false)
            setHasAgreement(false)
        }
    }, [user])

    // Load state from localStorage after mount to avoid hydration mismatch
    // Load state from localStorage after mount to avoid hydration mismatch
    useEffect(() => {
        const savedState = localStorage.getItem('contributor_wizard_state')
        const urlPath = searchParams.get('path')
        let parsedState: any = null

        if (savedState) {
            try {
                parsedState = JSON.parse(savedState)
            } catch (e) {
                console.error("Failed to parse saved state", e)
            }
        }

        // Handle URL Path parameter
        if (urlPath) {
            // Check if we are "resuming" the same path (User refreshed page)
            if (parsedState && parsedState.data && parsedState.data.path === urlPath) {
                // Restore state exactly as is
                setData(parsedState.data)
                setStep(parsedState.step as WizardStep)
            } else {
                // New path or no saved state -> Reset to Intro
                setData(prev => ({
                    ...prev,
                    path: urlPath as any
                }))
                setStep('path_intro')
            }
            setIsMounted(true)
            return
        }

        // No URL path - Standard Restore
        if (parsedState && parsedState.step && parsedState.data) {
            // Check if we should override 'pitch' with 'path_intro'
            if (parsedState.step === 'pitch' && !parsedState.data.brief?.topic && !parsedState.data.brief?.thesis) {
                setStep('path_intro')
            } else {
                setStep(parsedState.step as WizardStep)
            }
            setData(parsedState.data)
        }
        setIsMounted(true)
    }, [])

    // Sync data.language when locale changes
    useEffect(() => {
        setData(prev => ({ ...prev, language: lang }))
    }, [lang])

    // Monitor Path Changes (e.g. navigation from one wizard type to another)
    useEffect(() => {
        const urlPath = searchParams.get('path')
        if (urlPath && urlPath !== data.path) {
            setData(prev => ({
                ...prev,
                path: urlPath as any,
                currentStep: 'path_intro'
            }))
            setStep('path_intro')
        }
    }, [searchParams, data.path])

    // Save state whenever it changes
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('contributor_wizard_state', JSON.stringify({ step, data }))
        }
    }, [step, data, isMounted])

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [step])

    // Warn before leaving if there's progress
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (step !== 'path_intro' && step !== 'pitch' && step !== 'source_discovery' && step !== 'review' && step !== 'outline') {
                if (data.interviewHistory && data.interviewHistory.length > 0) {
                    e.preventDefault()
                    e.returnValue = ''
                }
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [step, data.interviewHistory])

    // Skip Agreement if already accepted (Firestore is source of truth; local only for immediate UX).
    useEffect(() => {
        const accepted = resolveAgreementAccepted({ hasAgreement, agreement: data.agreement })
        if (step === 'agreement' && accepted) {
            if (data.path === 'autonomy') {
                setStep('guidelines')
            } else {
                setStep('interview')
            }
        }
    }, [step, data.agreement?.agreed, data.agreement?.checkbox_general, data.path, hasAgreement])

    // SANITY CHECK: If Firestore says agreement is missing, we must not trust stale localStorage.
    useEffect(() => {
        const localAccepted = data.agreement?.checkbox_general === true || data.agreement?.agreed === true
        if (hasAgreement === false && localAccepted) {
            setData(prev => ({
                ...prev,
                agreement: undefined
            }))
        }
    }, [hasAgreement, data.agreement?.agreed, data.agreement?.checkbox_general, setData])

    // STEP GUARD: If no valid agreement, prevent accessing later steps.
    useEffect(() => {
        const protectedSteps: WizardStep[] = [
            'interview', 'guidelines', 'coverage_review',
            'source_discovery', 'outline', 'draft_submission', 'review'
        ]

        const accepted = resolveAgreementAccepted({ hasAgreement, agreement: data.agreement })
        if (hasAgreement === false && !accepted && protectedSteps.includes(step)) {
            // User is in a protected step but shouldn't be. Redirect to agreement (if brief exists) or pitch.
            if (data.brief?.topic || data.brief?.thesis) {
                setStep('agreement')
            } else {
                setStep('pitch')
            }
        }
    }, [hasAgreement, data.agreement?.agreed, data.agreement?.checkbox_general, step, setStep, data.brief])

    // Fetch contribution from ID in URL
    useEffect(() => {
        const id = searchParams.get('id')
        if (id && user) {
            setIsLoadingContribution(true) // Start loading
            fetchContribution(id)
        }
    }, [searchParams, user])

    // Check for existing contributions
    useEffect(() => {
        if (!isMounted) return

        const id = searchParams.get('id')
        const pathParam = searchParams.get('path')
        const hasLocalBrief = Boolean(data.brief?.topic || data.brief?.thesis)
        const hasLocalProgress = hasLocalBrief && !data.id

        const shouldCheckContributions = user && !id && !hasCheckedContributions && !hasLocalProgress && (
            (step === 'path_intro' && !pathParam) ||
            step === 'resume_selection'
        )

        if (shouldCheckContributions) {
            checkExistingContributions()
        }
    }, [user, step, searchParams, hasCheckedContributions, isMounted, data.brief, data.id])

    const resolveResumeStep = (contribution: Contribution): WizardStep => {
        const currentStep = contribution.currentStep as WizardStep | undefined
        if (contribution.generatedOutline && (currentStep === 'review' || currentStep === 'draft_submission')) {
            return 'outline'
        }
        return currentStep || 'pitch'
    }

    const fetchContribution = async (id: string) => {
        if (!user) return
        try {
            const token = await user.getIdToken()
            const res = await fetch(`/api/contributor/get-contribution?id=${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json = await res.json()
            if (json.success) {
                const contribution = json.contribution as Contribution
                setData(contribution)
                setStep(resolveResumeStep(contribution))
            } else {
                // Contribution not found or error (e.g. 404)
                console.warn(`Contribution ${id} not found:`, json.error)

                // Clear state related to this stale ID
                localStorage.removeItem('contributor_wizard_state')

                // Reset state to initial avoiding stale data
                setData(prev => ({
                    ...prev,
                    id: undefined, // Clear ID
                    brief: {
                        topic: '',
                        target: 'newbie',
                        format: 'tutorial',
                        thesis: '',
                        hasExample: false,
                        sources: []
                    },
                    interviewHistory: [],
                    agreement: undefined
                }))
                setStep('path_intro')

                // Remove ID from URL without full reload
                const url = new URL(window.location.href)
                url.searchParams.delete('id')
                window.history.replaceState({}, '', url.toString())
            }
        } catch (e) {
            console.error("Failed to fetch contribution", e)
        } finally {
            setIsLoadingContribution(false) // Done loading
        }
    }

    const checkExistingContributions = async () => {
        if (!user) return
        try {
            const token = await user.getIdToken()
            const res = await fetch('/api/contributor/get-progress', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const json = await res.json()
            const pathParam = searchParams.get('path')

            if (json.success && json.contributions && json.contributions.length > 0) {
                let filtered = json.contributions
                if (pathParam) {
                    filtered = filtered.filter((c: Contribution) => c.path === pathParam)
                }
                if (filtered.length > 0) {
                    setExistingContributions(filtered)
                    if (step !== 'resume_selection') {
                        setStep('resume_selection')
                    }
                } else if (step === 'resume_selection') {
                    setStep('path_intro')
                }
            } else if (step === 'resume_selection') {
                setStep('path_intro')
            }
        } catch (e) {
            console.error("Failed to check existing contributions", e)
            if (step === 'resume_selection') setStep('path_intro')
        } finally {
            setHasCheckedContributions(true)
        }
    }

    return {
        step,
        setStep,
        data,
        setData,
        coverageAssessment,
        setCoverageAssessment,
        existingContributions,
        setExistingContributions,
        hasCheckedContributions,
        setHasCheckedContributions,
        isWriter,
        hasAgreement,
        checkWriterStatus,
        isMounted,
        lang,
        user,
        searchParams,
        isLoadingContribution
    }
}
