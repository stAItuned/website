'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'

interface RoleFitSubmission {
    id: string
    email: string
    name?: string
    linkedinUrl?: string
    createdAt: string
    result?: {
        readinessLabel?: string
        roleNow?: string
        archetypeName?: string
        scores?: Record<string, number>
    }
    answers?: Record<string, unknown> | unknown[] | string | null
    report?: Record<string, unknown> | string | null
}

export function AdminRoleFitSubmissions() {
    const { user } = useAuth()
    const [submissions, setSubmissions] = useState<RoleFitSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSubmission, setSelectedSubmission] = useState<RoleFitSubmission | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!user) return

            setLoading(true)
            setError('')
            try {
                const token = await user.getIdToken()
                const res = await fetch('/api/admin/role-fit-submissions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await res.json()

                if (!data.success) throw new Error(data.error)
                setSubmissions(data.submissions)

            } catch (err) {
                console.error('Failed to fetch role fit submissions:', err)
                setError('Failed to load submissions')
            } finally {
                setLoading(false)
            }
        }

        fetchSubmissions()
    }, [user])

    if (loading) {
        return <div className="animate-pulse h-64 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
    }

    if (error) {
        return <div className="text-red-500 p-4 border border-red-200 rounded-xl bg-red-50">{error}</div>
    }

    const formatDate = (value: string) => {
        if (!value) return 'N/A'
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString()
    }

    const formatDateTime = (value: string) => {
        if (!value) return 'N/A'
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Role Fit Audits</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total: {submissions.length}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">User</th>
                                <th className="px-4 py-3 font-medium">Role Fit</th>
                                <th className="px-4 py-3 font-medium">Archetype</th>
                                <th className="px-4 py-3 font-medium">LinkedIn</th>
                                <th className="px-4 py-3 font-medium text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                                        <div className="font-medium">{sub.name || 'Anonymous'}</div>
                                        <div className="text-xs text-gray-500">{sub.email}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                        <div className="font-medium text-primary-600 dark:text-primary-400">
                                            {sub.result?.roleNow || 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {sub.result?.readinessLabel || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                            {sub.result?.archetypeName || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                        {sub.linkedinUrl ? (
                                            <a
                                                href={sub.linkedinUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline flex items-center gap-1"
                                            >
                                                LinkedIn
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 font-mono text-xs">
                                        <div className="flex flex-col items-end gap-1">
                                            <span>{formatDate(sub.createdAt)}</span>
                                            <button
                                                onClick={() => setSelectedSubmission(sub)}
                                                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium text-xs underline"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {submissions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                        No role fit audits found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {
                selectedSubmission && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedSubmission(null)}
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start sticky top-0 bg-white dark:bg-slate-900 z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Audit Details</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {selectedSubmission.name || 'Anonymous'} • {formatDateTime(selectedSubmission.createdAt)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                        <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Result Overview</h4>
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Current Role:</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white">{selectedSubmission.result?.roleNow || 'N/A'}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Readiness:</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white">{selectedSubmission.result?.readinessLabel || 'N/A'}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Archetype:</dt>
                                                <dd className="font-medium text-purple-600 dark:text-purple-400">{selectedSubmission.result?.archetypeName || 'N/A'}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                        <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Scores</h4>
                                        <div className="space-y-2">
                                            {Object.entries(selectedSubmission.result?.scores || {}).map(([key, value]) => (
                                                <div key={key} className="flex items-center text-sm">
                                                    <span className="w-32 capitalize text-slate-500 truncate">{key.replace(/_/g, ' ')}</span>
                                                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mx-2">
                                                        <div className="h-full bg-purple-500" style={{ width: `${(value / 10) * 100}%` }}></div>
                                                    </div>
                                                    <span className="w-8 text-right font-medium text-slate-900 dark:text-white">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Q&A / Answers */}
                                <div>
                                    <h4 className="font-semibold mb-4 text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                                        Submission Answers
                                    </h4>
                                    <div className="space-y-4">
                                        {selectedSubmission.answers ? (
                                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 overflow-x-auto">
                                                <pre className="text-xs whitespace-pre-wrap font-mono text-slate-700 dark:text-slate-300">
                                                    {JSON.stringify(selectedSubmission.answers, null, 2)}
                                                </pre>
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 italic">No detailed answers available.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Full Report */}
                                <div>
                                    <h4 className="font-semibold mb-4 text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                                        Generated Report
                                    </h4>
                                    {selectedSubmission.report ? (
                                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 prose dark:prose-invert max-w-none text-sm">
                                            {/* Simple rendering for now, could be marked down if report is MD */}
                                            <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300">
                                                {typeof selectedSubmission.report === 'string'
                                                    ? selectedSubmission.report
                                                    : JSON.stringify(selectedSubmission.report, null, 2)}
                                            </pre>
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 italic">No report generated.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
