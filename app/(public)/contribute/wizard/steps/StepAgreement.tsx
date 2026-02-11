'use client'

import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Contribution, ContributorBrief } from '@/lib/types/contributor'
import { useAuth } from '@/components/auth/AuthContext'
import Link from 'next/link'

interface StepAgreementProps {
    brief: ContributorBrief
    path: string | 'autonomy' | 'guided' | 'interview'
    onNext: (contribution: Contribution) => void
    translations: any
    language: 'it' | 'en'
    id?: string
}

export function StepAgreement({ brief, path, onNext, translations, language, id: existingId }: StepAgreementProps) {
    const { user, loading } = useAuth()
    const [agreementText, setAgreementText] = useState<string>('')
    const [legalName, setLegalName] = useState('')
    const [fiscalCode, setFiscalCode] = useState('')
    const [agreed, setAgreed] = useState(false)
    const [specificApproval, setSpecificApproval] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (user?.displayName) {
            setLegalName(user.displayName)
        }
    }, [user])

    // Fetch Agreement Markdown
    useEffect(() => {
        const fetchAgreement = async () => {
            try {
                const filename = language === 'it' ? 'contributor-agreement.md' : 'contributor-agreement.en.md'
                const res = await fetch(`/assets/staituned/contributors/article-writing/${filename}`)
                if (res.ok) {
                    const text = await res.text()
                    setAgreementText(text)
                } else {
                    setAgreementText('Failed to load agreement.')
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchAgreement()
    }, [language])

    // Dynamic Render of Agreement with User Data
    const renderedAgreement = useMemo(() => {
        if (!agreementText) return ''
        let text = agreementText

        const nameDisplay = legalName.trim() ? `**${legalName}**` : '____(Nome Cognome)____'
        const cfDisplay = fiscalCode.trim() ? `**${fiscalCode}**` : '____(CF)____'
        const emailDisplay = user?.email ? `**${user.email}**` : '____(Email)____'
        const dateDisplay = new Date().toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US')

        // Replace placeholders common in the body
        text = text.replace(/{Nome Cognome}/g, nameDisplay)
        text = text.replace(/{First Name Last Name}/g, nameDisplay)
        text = text.replace(/CF {…}/g, '') // Remove if still present
        text = text.replace(/Tax ID\/SSN {…}/g, '') // Remove if still present
        text = text.replace(/email {…}/g, `email ${emailDisplay}`)
        text = text.replace(/{Data}/g, `**${dateDisplay}**`)
        text = text.replace(/{Date}/g, `**${dateDisplay}**`)
        text = text.replace(/{…}/g, `____`)

        // Signatures Auto-fill
        // IT: **Autore**: _______ Data: _______
        text = text.replace(
            /\*\*Autore\*\*: _{5,} Data: _{5,}/g,
            `**Autore**: ${nameDisplay} Data: **${dateDisplay}**`
        )

        // EN: **Author**: _______ Date: _______
        text = text.replace(
            /\*\*Author\*\*: _{5,} Date: _{5,}/g,
            `**Author**: ${nameDisplay} Date: **${dateDisplay}**`
        )

        // Publisher Auto-fill
        text = text.replace(
            /\*\*Editore \(stAItuned \/ Daniele Moltisanti\)\*\*: _{5,} Data: _{5,}/g,
            `**Editore (stAItuned / Daniele Moltisanti)**: Daniele Moltisanti Data: **${dateDisplay}**`
        )
        text = text.replace(
            /\*\*Publisher \(stAItuned \/ Daniele Moltisanti\)\*\*: _{5,} Date: _{5,}/g,
            `**Publisher (stAItuned / Daniele Moltisanti)**: Daniele Moltisanti Date: **${dateDisplay}**`
        )

        return text
    }, [agreementText, legalName, fiscalCode, user, language])

    const handleAgreeAndContinue = async () => {
        if (!user) return
        if (!legalName.trim()) {
            setError('Per favor inserisci il tuo nome legale completo.')
            return
        }
        setIsSaving(true)
        setError('')

        try {
            // Create Contribution in DB
            const res = await fetch('/api/contributor/save-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    contributionId: existingId,
                    data: {
                        brief,
                        language,
                        path: path || 'autonomy',
                        currentStep: 'agreement',
                        status: path === 'autonomy' ? 'draft' : 'pitch',
                        agreement: {
                            checkbox_general: agreed,
                            checkbox_1341: specificApproval,
                            accepted_at: new Date().toISOString(),
                            author_name: legalName,
                            author_email: user.email || '',
                            fiscal_code: fiscalCode,
                            agreement_version: '1.1'
                        }
                    }
                })
            })

            const json = await res.json()

            if (json.success) {
                const contribution: any = {
                    id: json.contributionId,
                    contributorId: user.uid,
                    status: path === 'autonomy' ? 'draft' : 'pitch',
                    currentStep: 'agreement',
                    path: path || 'autonomy',
                    brief,
                    language,
                    agreement: {
                        agreed: true,
                        legalName: legalName,
                        fiscalCode: fiscalCode,
                        specificApproval: true
                    }
                }
                onNext(contribution)
            } else {
                setError(json.error || 'Failed to save contribution.')
            }

        } catch (err) {
            console.error(err)
            setError('Connection error.')
        } finally {
            setIsSaving(false)
        }
    }

    // 1. Auth Gate
    if (loading) return <div className="p-10 text-center animate-pulse">Loading auth...</div>

    if (!user) {
        return (
            <div className="max-w-md mx-auto text-center space-y-6 py-10">
                <h2 className="text-2xl font-bold">Autenticazione Richiesta</h2>
                <p className="text-slate-600">Per salvare la tua idea e procedere, accedi o registrati.</p>
                <Link
                    href={`/signin?redirect=/contribute/wizard`}
                    className="inline-block w-full py-3 rounded-xl bg-primary-600 text-white font-bold"
                >
                    Accedi con Google
                </Link>
            </div>
        )
    }

    // 2. Agreement UI
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto pb-32">
            <div className="space-y-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {translations.title}
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        {translations.desc}
                    </p>
                </div>
                <div className="h-1 w-20 bg-primary-500 rounded-full" />
            </div>

            {/* Agreement Content (Full Flow) */}
            <div className="relative">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    {renderedAgreement ? (
                        <ReactMarkdown>{renderedAgreement}</ReactMarkdown>
                    ) : (
                        <div className="animate-pulse space-y-6">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" style={{ width: `${Math.random() * 30 + 70}%` }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Compact Action Bar - Floating at Bottom */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-50">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl p-4 md:py-4 md:px-8 rounded-[2rem] border border-white/20 dark:border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] space-y-3 ring-1 ring-slate-900/5 dark:ring-white/5">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 flex-grow">
                            {/* General Consent */}
                            <label className="flex items-center gap-2 cursor-pointer group/label">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 dark:border-slate-700 checked:bg-amber-500 checked:border-amber-500 transition-all"
                                    />
                                    <svg className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 select-none group-hover/label:text-amber-600 transition-colors leading-tight">
                                    {translations.checkbox}
                                </span>
                            </label>

                            {/* Specific Approval (Art. 1341) */}
                            <label className="flex items-center gap-2 cursor-pointer group/label">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={specificApproval}
                                        onChange={(e) => setSpecificApproval(e.target.checked)}
                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 dark:border-slate-700 checked:bg-amber-500 checked:border-amber-500 transition-all"
                                    />
                                    <svg className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 select-none group-hover/label:text-amber-600 transition-colors leading-tight">
                                    {language === 'it'
                                        ? "Approvazione clausole (art. 1341 c.c.)"
                                        : "Approval of clauses (art. 1341 Civil Code)"}
                                </span>
                            </label>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                            {error && (
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight max-w-[120px] leading-tight text-right">
                                    {error}
                                </p>
                            )}
                            <button
                                onClick={handleAgreeAndContinue}
                                disabled={!agreed || !specificApproval || isSaving}
                                className="px-6 py-2.5 rounded-xl stai-btn-gradient text-[11px] font-bold shadow-lg shadow-amber-500/10 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {isSaving ? 'Salvataggio...' : translations.cta}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
