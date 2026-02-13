'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';

interface CostData {
    period: string;
    summary: {
        totalCost: number;
        totalTokens: number;
        requests: number;
    };
    byModel: Record<string, {
        cost: number;
        requests: number;
        tokens: number;
    }>;
    daily: { date: string; cost: number; tokens: number; requests: number }[];
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState<CostData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const res = await fetch('/api/admin/cost', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    setData(json);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex animate-pulse flex-col space-y-4">
                <div className="h-32 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-64 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
        );
    }

    const dailyData = data?.daily ?? [];
    const maxDailyCost = dailyData.reduce((max, item) => Math.max(max, item.cost), 0);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                    Overview
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Current month estimated costs and usage.
                </p>
            </div>

            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-slate-800 sm:p-6">
                    <dt className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">Total Cost</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        ${data?.summary.totalCost.toFixed(4)}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-slate-800 sm:p-6">
                    <dt className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">Total Requests</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {data?.summary.requests}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-slate-800 sm:p-6">
                    <dt className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">Total Tokens</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {data?.summary.totalTokens.toLocaleString()}
                    </dd>
                </div>
            </dl>

            <div className="overflow-hidden bg-white shadow dark:bg-slate-800 sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-white">Usage by Model</h3>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700">
                    <div className="md:hidden">
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                            {Object.entries(data?.byModel || {}).map(([model, stats]) => (
                                <li key={model} className="space-y-3 px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{model}</p>
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <div>
                                            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Requests</dt>
                                            <dd className="font-medium text-slate-800 dark:text-slate-100">{stats.requests}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Tokens</dt>
                                            <dd className="font-medium text-slate-800 dark:text-slate-100">{stats.tokens.toLocaleString()}</dd>
                                        </div>
                                        <div className="col-span-2">
                                            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Cost</dt>
                                            <dd className="font-semibold text-primary-600 dark:text-primary-400">${stats.cost.toFixed(4)}</dd>
                                        </div>
                                    </dl>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="hidden md:block">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Model</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Requests</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Tokens</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
                                {Object.entries(data?.byModel || {}).map(([model, stats]) => (
                                    <tr key={model}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{model}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500 dark:text-slate-400">{stats.requests}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500 dark:text-slate-400">{stats.tokens.toLocaleString()}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500 dark:text-slate-400">${stats.cost.toFixed(4)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden bg-white shadow dark:bg-slate-800 sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                    <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-white">Daily Cost</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {dailyData.length} days
                    </span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700">
                    {dailyData.length === 0 ? (
                        <div className="px-6 py-8 text-sm text-slate-500 dark:text-slate-400">
                            No usage data for this period yet.
                        </div>
                    ) : (
                        <div>
                            <div className="md:hidden">
                                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {dailyData.map((day) => {
                                        const barWidth = maxDailyCost > 0 ? Math.max((day.cost / maxDailyCost) * 100, 4) : 0;
                                        return (
                                            <li key={day.date} className="space-y-3 px-4 py-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {new Date(day.date).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                                        ${day.cost.toFixed(4)}
                                                    </p>
                                                </div>
                                                <div className="relative h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                                                    <div
                                                        className="h-2 rounded-full bg-primary-500"
                                                        style={{ width: `${barWidth}%` }}
                                                    />
                                                </div>
                                                <dl className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Requests</dt>
                                                        <dd className="font-medium text-slate-800 dark:text-slate-100">{day.requests}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Tokens</dt>
                                                        <dd className="font-medium text-slate-800 dark:text-slate-100">{day.tokens.toLocaleString()}</dd>
                                                    </div>
                                                </dl>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                    <thead className="bg-slate-50 dark:bg-slate-900">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                Cost
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                Requests
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                Tokens
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
                                        {dailyData.map((day) => {
                                            const barWidth = maxDailyCost > 0 ? Math.max((day.cost / maxDailyCost) * 100, 4) : 0;
                                            return (
                                                <tr key={day.date}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                                        {new Date(day.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                                                        <div className="flex items-center gap-3">
                                                            <span className="min-w-[72px]">${day.cost.toFixed(4)}</span>
                                                            <div className="relative h-2 w-full max-w-xs rounded-full bg-slate-100 dark:bg-slate-700">
                                                                <div
                                                                    className="h-2 rounded-full bg-primary-500"
                                                                    style={{ width: `${barWidth}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500 dark:text-slate-400">
                                                        {day.requests}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500 dark:text-slate-400">
                                                        {day.tokens.toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
