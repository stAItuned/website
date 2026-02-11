'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Contribution } from '@/lib/types/contributor'

interface StepDraftSubmissionProps {
    contribution: Contribution
    onNext: (draftContent?: string, isPending?: boolean) => void
    translations: any
}

export function StepDraftSubmission({ contribution, onNext, translations }: StepDraftSubmissionProps) {
    const [hasDraft, setHasDraft] = useState<boolean | null>(null)
    const [draftContent, setDraftContent] = useState(contribution.draftContent || '')

    const handleSubmit = () => {
        if (hasDraft) {
            // Yes flow - submitting content
            onNext(draftContent, false)
        } else {
            // No flow - just saving progress to come back later
            onNext(undefined, true)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-32">
            <div className="text-center space-y-3">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    {translations.title || 'Hai già la bozza?'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    {translations.desc || 'Se hai già scritto il contenuto, puoi incollarlo qui direttamente.'}
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">

                {/* Selection Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setHasDraft(true)}
                        className={`p-4 rounded-xl border-2 transition-all font-bold ${hasDraft === true
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        {translations.yesOption || 'Sì, ho il testo'}
                    </button>
                    <button
                        onClick={() => setHasDraft(false)}
                        className={`p-4 rounded-xl border-2 transition-all font-bold ${hasDraft === false
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        {translations.noOption || 'No, devo scriverlo'}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {hasDraft === true && (
                        <motion.div
                            key="yes-content"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6 text-center"
                        >
                            <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-xl border border-primary-200 dark:border-primary-800">
                                <p className="text-slate-700 dark:text-slate-300 mb-4">
                                    {translations.editorDesc || 'Abbiamo creato un editor dedicato per la tua bozza. Clicca qui sotto per aprirlo a schermo intero.'}
                                </p>
                                <a
                                    href={`/contribute/draft?id=${contribution.id}`}
                                    target="_blank"
                                    className="inline-flex items-center px-8 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 transition shadow-lg gap-2"
                                >
                                    {translations.openEditor || 'Apri Editor'}
                                    <span className="text-xl">↗</span>
                                </a>
                            </div>

                            <p className="text-sm text-slate-500">
                                {translations.afterEditor || 'Dopo aver inviato la bozza dall\'editor, questa pagina si aggiornerà automaticamente.'}
                            </p>
                        </motion.div>
                    )}

                    {hasDraft === false && (
                        <motion.div
                            key="no-content"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-center py-4 space-y-4 overflow-hidden"
                        >
                            <div className="text-4xl">👋</div>
                            <p className="text-slate-600 dark:text-slate-300">
                                {translations.successPending || 'Nessun problema. Quando sei pronto, torna qui.'}
                            </p>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition shadow-lg"
                            >
                                {translations.saveForLater || 'Tornerò più tardi'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
