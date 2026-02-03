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
}

export function StepAgreement({ brief, path, onNext, translations, language }: StepAgreementProps) {
    const { user, loading } = useAuth()
    const [agreementText, setAgreementText] = useState<string>('')
    const [legalName, setLegalName] = useState('')
    const [fiscalCode, setFiscalCode] = useState('')
    const [agreed, setAgreed] = useState(false)
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
        text = text.replace(/CF {…}/g, `CF ${cfDisplay}`)
        text = text.replace(/email {…}/g, `email ${emailDisplay}`)
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
                    data: {
                        brief,
                        language,
                        path: path || 'autonomy',
                        currentStep: 'agreement',
                        status: path === 'autonomy' ? 'draft' : 'pitch',
                        agreement: {
                            agreed: true,
                            agreedAt: new Date().toISOString(),
                            legalName: legalName,
                            fiscalCode: fiscalCode,
                            version: '1.0'
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
                        fiscalCode: fiscalCode
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
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 z-50">
                <div className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl p-4 md:py-4 md:px-8 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] space-y-3">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        {/* Legal Name Input */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                                {translations.legalName}
                            </label>
                            <input
                                type="text"
                                value={legalName}
                                onChange={(e) => setLegalName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition text-sm font-bold"
                                placeholder="Nome Cognome"
                            />
                        </div>

                        {/* Fiscal Code Input */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                                {translations.fiscalCode}
                            </label>
                            <input
                                type="text"
                                value={fiscalCode}
                                onChange={(e) => setFiscalCode(e.target.value.toUpperCase())}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition text-sm font-bold uppercase"
                                placeholder={language === 'it' ? "Codice Fiscale" : "Tax ID"}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-white/5">
                        <label className="flex items-center gap-3 cursor-pointer group/label">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 dark:border-slate-700 checked:bg-primary-600 checked:border-primary-600 transition-all"
                                />
                                <svg className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 select-none group-hover/label:text-primary-600 transition-colors">
                                {translations.checkbox}
                            </span>
                        </label>

                        <div className="flex items-center gap-4">
                            {error && (
                                <p className="text-[10px] text-red-500 font-extrabold uppercase tracking-tight max-w-[150px] leading-tight text-right">
                                    {error}
                                </p>
                            )}
                            <button
                                onClick={handleAgreeAndContinue}
                                disabled={!agreed || !legalName.trim() || isSaving}
                                className="px-10 py-3 rounded-xl bg-primary-600 text-white font-black text-xs uppercase tracking-widest hover:bg-primary-500 shadow-lg shadow-primary-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed whitespace-nowrap"
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
