'use client'

import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '@/components/auth/AuthContext'
import { useLearnLocale } from '@/lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'

interface AgreementModalProps {
    isOpen: boolean
    onClose: () => void
    agreementData?: {
        legalName: string
        agreedAt: string
        version: string
    }
}

export function AgreementModal({ isOpen, onClose, agreementData }: AgreementModalProps) {
    const { user } = useAuth()
    const { locale } = useLearnLocale()
    const [agreementText, setAgreementText] = useState('')
    const [sendingEmail, setSendingEmail] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const language = (locale as 'it' | 'en') || 'it'

    const handleSendCopy = async () => {
        if (!user || sendingEmail) return
        setSendingEmail(true)
        try {
            const res = await fetch('/api/account/send-agreement-copy', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`
                }
            })
            if (res.ok) {
                setEmailSent(true)
                setTimeout(() => setEmailSent(false), 5000)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSendingEmail(false)
        }
    }

    useEffect(() => {
        if (!isOpen) return

        const fetchAgreement = async () => {
            try {
                // Determine which version to fetch. If agreementData provides a version (e.g. 1.0), we might want that.
                // For now, we fetch current, but use historical names/dates.
                const filename = language === 'it' ? 'contributor-agreement.md' : 'contributor-agreement.en.md'
                const res = await fetch(`/assets/staituned/contributors/article-writing/${filename}`)
                if (res.ok) {
                    const text = await res.text()
                    setAgreementText(text)
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchAgreement()
    }, [isOpen, language])

    const renderedAgreement = useMemo(() => {
        if (!agreementText) return ''
        let text = agreementText

        const nameDisplay = agreementData?.legalName || (user?.displayName ? `**${user.displayName}**` : '____(Nome Cognome)____')
        const emailDisplay = user?.email ? `**${user.email}**` : '____(Email)____'
        const dateDisplay = agreementData?.agreedAt
            ? new Date(agreementData.agreedAt).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US')
            : new Date().toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US')

        // Replace placeholders common in the body
        text = text.replace(/{Nome Cognome}/g, nameDisplay)
        text = text.replace(/CF {…}/g, `CF ____`) // Don't show sensitive CF in public view or fallback
        text = text.replace(/email {…}/g, `email ${emailDisplay}`)
        text = text.replace(/{…}/g, `____`)

        // Signatures Auto-fill
        text = text.replace(
            /\*\*Autore\*\*: _{5,} Data: _{5,}/g,
            `**Autore**: ${nameDisplay} Data: **${dateDisplay}**`
        )

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
            /\*\*Publisher \(stAItuned \/ Daniele Moltisanti\)\*\*: _{5,} Data: _{5,}/g,
            `**Publisher (stAItuned / Daniele Moltisanti)**: Daniele Moltisanti Data: **${dateDisplay}**`
        )

        return text
    }, [agreementText, user, language, agreementData])

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col pointer-events-auto overflow-hidden">
                            {/* Header */}
                            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                                <h3 className="text-xl font-bold dark:text-white">Contributor Agreement</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                                <div className="prose prose-slate dark:prose-invert max-w-none prose-sm md:prose-base">
                                    {renderedAgreement ? (
                                        <ReactMarkdown>{renderedAgreement}</ReactMarkdown>
                                    ) : (
                                        <div className="flex justify-center py-20">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                {agreementData && (
                                    <button
                                        onClick={handleSendCopy}
                                        disabled={sendingEmail}
                                        className="text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 disabled:opacity-50 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                                    >
                                        <svg className={`w-4 h-4 ${sendingEmail ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {sendingEmail ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            )}
                                        </svg>
                                        {sendingEmail
                                            ? (language === 'it' ? 'Invio in corso...' : 'Sending...')
                                            : (emailSent
                                                ? (language === 'it' ? 'Copia Inviata!' : 'Copy Sent!')
                                                : (language === 'it' ? 'Invia copia via email' : 'Send copy via email'))}
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-8 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-slate-900/10"
                                >
                                    {language === 'it' ? 'Chiudi' : 'Close'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
