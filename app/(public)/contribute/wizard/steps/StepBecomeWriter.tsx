'use client'

import { BecomeWriterForm } from '@/components/contribute/BecomeWriterForm'

interface StepBecomeWriterProps {
    onNext: () => void
    translations?: any
}

export function StepBecomeWriter({ onNext, translations }: StepBecomeWriterProps) {
    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
            <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Diventa un Writer
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Per pubblicare articoli su stAItuned, devi prima creare il tuo profilo autore.
                </p>
            </div>

            <BecomeWriterForm onSuccess={onNext} />
        </div>
    )
}
