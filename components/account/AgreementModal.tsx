'use client'

import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '@/components/auth/AuthContext'
import { useLearnLocale } from '@/lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'

interface AgreementModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AgreementModal({ isOpen, onClose }: AgreementModalProps) {
    const { user } = useAuth()
    const { locale } = useLearnLocale()
    const [agreementText, setAgreementText] = useState('')
    const language = (locale as 'it' | 'en') || 'it'

    useEffect(() => {
        if (!isOpen) return

        const fetchAgreement = async () => {
            try {
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

        const nameDisplay = user?.displayName ? `**${user.displayName}**` : '____(Nome Cognome)____'
        const emailDisplay = user?.email ? `**${user.email}**` : '____(Email)____'
        const dateDisplay = new Date().toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US')

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
            /\*\*Publisher \(stAItuned \/ Daniele Moltisanti\)\*\*: _{5,} Date: _{5,}/g,
            `**Publisher (stAItuned / Daniele Moltisanti)**: Daniele Moltisanti Date: **${dateDisplay}**`
        )

        return text
    }, [agreementText, user, language])

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
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
