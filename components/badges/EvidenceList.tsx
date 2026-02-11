'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BadgeEvidence } from '@/lib/types/badge'

interface EvidenceItem extends BadgeEvidence {
    title: string
    date: string
}

interface EvidenceListProps {
    evidence: EvidenceItem[]
    pageSize?: number
}

export function EvidenceList({ evidence, pageSize = 5 }: EvidenceListProps) {
    const [currentPage, setCurrentPage] = useState(1)

    if (evidence.length === 0) return null

    const totalPages = Math.ceil(evidence.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedEvidence = evidence.slice(startIndex, startIndex + pageSize)

    const formatMetric = (item: EvidenceItem) => {
        switch (item.type) {
            case 'impact':
                return `${item.value.toLocaleString()} Qualified Reads`
            case 'volume':
                return `${item.value} Contribution`
            case 'quality':
                return `${item.value} Quality Score`
            default:
                return `${item.value}`
        }
    }

    return (
        <div className="text-left border-t border-slate-100 dark:border-slate-800 pt-8">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Evidence ({evidence.length})
            </h3>

            <ul className="space-y-3">
                {paginatedEvidence.map(item => (
                    <li key={item.articleSlug}>
                        <Link
                            href={item.articleUrl || `/${item.articleSlug}`}
                            className="group block p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm leading-tight">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                        Published on {new Date(item.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <span className="text-xs font-bold px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-md">
                                        {formatMetric(item)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous page"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next page"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
