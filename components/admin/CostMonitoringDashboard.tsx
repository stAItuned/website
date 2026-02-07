
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { AdminModelConfig } from './AdminModelConfig'
import { PRICING } from '@/lib/ai/pricing'

interface CostSummary {
    totalCost: number
    geminiCost: number
    perplexityCost: number
    totalRequests: number
    chartData: Array<{ date: string; cost: number }>
}

interface UserCost {
    email: string
    requests: number
    totalTokens: number
    totalCost: number
    geminiCost: number
    perplexityCost: number
}

export function CostMonitoringDashboard() {
    const { user } = useAuth()
    const [days, setDays] = useState(30)
    const [summary, setSummary] = useState<CostSummary | null>(null)
    const [users, setUsers] = useState<UserCost[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return

            setLoading(true)
            setError('')
            try {
                const token = await user.getIdToken()
                const headers = {
                    'Authorization': `Bearer ${token}`
                }

                // Fetch summary
                const summaryRes = await fetch(`/api/admin/costs?days=${days}`, { headers })
                const summaryData = await summaryRes.json()

                if (!summaryData.success) throw new Error(summaryData.error)
                setSummary(summaryData.data)

                // Fetch user breakdown
                const userRes = await fetch(`/api/admin/costs/by-user?days=${days}`, { headers })
                const userData = await userRes.json()

                if (!userData.success) throw new Error(userData.error)
                setUsers(userData.data)

            } catch (err) {
                console.error('Failed to fetch cost data:', err)
                setError('Failed to load cost data')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [days, user])

    if (loading) {
        return <div className="animate-pulse h-64 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
    }

    if (error) {
        return <div className="text-red-500 p-4 border border-red-200 rounded-xl bg-red-50">{error}</div>
    }

    if (!summary) return null

    return (
        <div className="space-y-6">
            <AdminModelConfig />

            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cost Monitoring</h3>
                <div className="flex gap-2">
                    {[7, 30, 90].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${days === d
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300'
                                }`}
                        >
                            {d}d
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Cost"
                    value={`$${summary.totalCost.toFixed(4)}`}
                    color="text-green-600 dark:text-green-400"
                />
                <SummaryCard
                    title="Gemini Cost"
                    value={`$${summary.geminiCost.toFixed(4)}`}
                    color="text-blue-600 dark:text-blue-400"
                />
                <SummaryCard
                    title="Perplexity Cost"
                    value={`$${summary.perplexityCost.toFixed(4)}`}
                    color="text-purple-600 dark:text-purple-400"
                />
                <SummaryCard
                    title="Total Requests"
                    value={summary.totalRequests.toString()}
                    color="text-gray-900 dark:text-white"
                />
            </div>

            {/* Daily Trend Chart (Simple Bar) */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Daily Cost Trend</h4>
                <div className="h-40 flex items-end gap-1">
                    {summary.chartData.map((d, i) => {
                        const maxCost = Math.max(...summary.chartData.map(c => c.cost), 0.01)
                        const height = (d.cost / maxCost) * 100
                        return (
                            <div key={d.date} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                                <div
                                    className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-sm hover:bg-blue-400 transition-colors"
                                    style={{ height: `${height}%`, minHeight: '4px' }}
                                ></div>
                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs p-2 rounded shadow-lg whitespace-nowrap z-50 font-mono pointer-events-none">
                                    {d.date}: ${d.cost.toFixed(4)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {/* Debug verify last 3 entries */}
                <div className="mt-4 p-2 bg-slate-50 dark:bg-slate-900/50 rounded text-xs text-slate-500 font-mono">
                    Last entry: {summary.chartData[summary.chartData.length - 1]?.date} = ${summary.chartData[summary.chartData.length - 1]?.cost?.toFixed(4)}
                </div>
            </div>

            {/* Cost Reference Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Model Pricing Reference</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">Model Key</th>
                                <th className="px-4 py-3 font-medium text-right">Input ($/1M)</th>
                                <th className="px-4 py-3 font-medium text-right">Output ($/1M)</th>
                                <th className="px-4 py-3 font-medium text-right">Per Request ($)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {Object.entries(PRICING).map(([key, price]) => (
                                <tr key={key} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 font-mono text-xs">{key}</td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">${price.inputPer1M.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">${price.outputPer1M.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{price.perRequest ? `$${price.perRequest}` : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white">User Breakdown</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">User</th>
                                <th className="px-4 py-3 font-medium text-right">Requests</th>
                                <th className="px-4 py-3 font-medium text-right">Tokens</th>
                                <th className="px-4 py-3 font-medium text-right">Gemini</th>
                                <th className="px-4 py-3 font-medium text-right">Perplexity</th>
                                <th className="px-4 py-3 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {users.map((user) => (
                                <tr key={user.email} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                                        {user.requests}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                                        {(user.totalTokens / 1000).toFixed(1)}k
                                    </td>
                                    <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">
                                        ${user.geminiCost.toFixed(4)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-purple-600 dark:text-purple-400">
                                        ${user.perplexityCost.toFixed(4)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                                        ${user.totalCost.toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        No usage data for selected period
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

function SummaryCard({ title, value, color }: { title: string; value: string; color: string }) {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                {title}
            </p>
            <p className={`text-2xl font-bold ${color}`}>
                {value}
            </p>
        </div>
    )
}
