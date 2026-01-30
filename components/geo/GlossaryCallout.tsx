"use client"

import { BookOpen } from 'lucide-react'

interface GlossaryCalloutProps {
    term: string
    definition: string
    className?: string
}

export function GlossaryCallout({
    term,
    definition,
    className = ""
}: GlossaryCalloutProps) {
    if (!term || !definition) return null

    return (
        <div className={`p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 ${className}`}>
            <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-1 shrink-0" />
                <div>
                    <span className="block text-sm font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide mb-1">
                        Definition: {term}
                    </span>
                    <p className="text-base font-medium text-amber-900 dark:text-amber-100 leading-relaxed">
                        {definition}
                    </p>
                </div>
            </div>
        </div>
    )
}
