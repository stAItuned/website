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
}

export function AdminRoleFitSubmissions() {
    const { user } = useAuth()
    const [submissions, setSubmissions] = useState<RoleFitSubmission[]>([])
    const [loading, setLoading] = useState(true)
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
                                        {new Date(sub.createdAt).toLocaleDateString()}
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
        </div>
    )
}
