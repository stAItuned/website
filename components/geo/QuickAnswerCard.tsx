"use client"

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface QuickAnswerCardProps {
    title?: string
    bullets: string[]
    oneThing?: string
    className?: string
}

export function QuickAnswerCard({
    title = "Answer in 30 seconds",
    bullets = [],
    oneThing,
    className = ""
}: QuickAnswerCardProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        const text = `${title}\n\n${bullets.map(b => `• ${b}`).join('\n')}${oneThing ? `\n\nIf you do only one thing: ${oneThing}` : ''}`
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`rounded-xl border border-primary-100 dark:border-primary-900/50 bg-primary-50/50 dark:bg-primary-900/10 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-primary-100 dark:border-primary-900/50 bg-primary-100/30 dark:bg-primary-900/20">
                <h3 className="text-sm font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wide flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {title}
                </h3>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800/50 text-primary-600 dark:text-primary-400 transition-colors"
                    title="Copy to clipboard"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                <ul className="space-y-3 mb-0">
                    {bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                            <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-primary-500" />
                            <span>{bullet}</span>
                        </li>
                    ))}
                </ul>

                {/* Micro-pattern: One Thing */}
                {oneThing && (
                    <div className="mt-6 pt-4 border-t border-primary-100 dark:border-primary-900/30">
                        <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                            <span className="font-bold">If you do only one thing:</span> {oneThing}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
