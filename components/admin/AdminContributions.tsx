'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Contribution, ContributionStatus, ContributionPath } from '@/lib/types/contributor'
import { AdminContributionDetailsModal } from './AdminContributionDetailsModal'

export function AdminContributions() {
    const { user } = useAuth()
    const [contributions, setContributions] = useState<Contribution[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null)

    const fetchContributions = useCallback(async () => {
        if (!user) return

        setLoading(true)
        setError('')
        try {
            const token = await user.getIdToken()
            const res = await fetch('/api/admin/contributions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await res.json()

            if (!data.success) throw new Error(data.error)
            setContributions(data.contributions)

        } catch (err) {
            console.error('Failed to fetch contributions:', err)
            setError('Failed to load contributions')
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchContributions()
    }, [fetchContributions])

    if (loading && contributions.length === 0) {
        return <div className="animate-pulse h-64 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
    }

    if (error) {
        return <div className="text-red-500 p-4 border border-red-200 rounded-xl bg-red-50">{error}</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contributions</h3>
                    <button
                        onClick={fetchContributions}
                        disabled={loading}
                        className={`p-1 text-gray-500 hover:text-primary-600 transition-colors ${loading ? 'animate-spin' : ''}`}
                        title="Refresh"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total: {contributions.length}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Path</th>
                                <th className="px-4 py-3 font-medium">Contributor</th>
                                <th className="px-4 py-3 font-medium">Topic</th>
                                <th className="px-4 py-3 font-medium">Agreement</th>
                                <th className="px-4 py-3 font-medium text-right">Last Updated</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {contributions.map((contribution) => (
                                <tr
                                    key={contribution.id}
                                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                                    onClick={() => setSelectedContribution(contribution)}
                                >
                                    <td className="px-4 py-3">
                                        <StatusBadge status={contribution.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <PathBadge path={contribution.path} />
                                    </td>
                                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                                        {contribution.contributorEmail}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate" title={contribution.brief?.topic}>
                                        {contribution.brief?.topic || 'No topic'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {contribution.agreement?.agreed ? (
                                            <div className="text-sm">
                                                <div className="font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    {contribution.agreement?.author_name}
                                                </div>
                                                {contribution.agreement?.fiscal_code && (
                                                    <div className="text-xs text-slate-500 font-mono">
                                                        {contribution.agreement?.fiscal_code}
                                                    </div>
                                                )}
                                                <div className="text-[10px] text-slate-400">
                                                    {contribution.agreement?.accepted_at && new Date(contribution.agreement.accepted_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 font-mono text-xs">
                                        {new Date(contribution.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedContribution(contribution)
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {contributions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                        No contributions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminContributionDetailsModal
                contribution={selectedContribution}
                onClose={() => setSelectedContribution(null)}
            />
        </div>
    )
}

function StatusBadge({ status }: { status: ContributionStatus }) {
    const colors = {
        pitch: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        interview: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        outline: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        draft: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
        review: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        scheduled: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
        published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    )
}

function PathBadge({ path }: { path: ContributionPath }) {
    const colors = {
        autonomy: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        guided: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
        interview: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[path] || 'bg-gray-100 text-gray-800'}`}>
            {path}
        </span>
    )
}
