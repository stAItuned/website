'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config';

export default function AdminBadgesPage() {
    const { user } = useAuth();
    const [authorSlug, setAuthorSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRecalculate = async (targetSlug?: string) => {
        if (!user) return;

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const token = await user.getIdToken();
            const res = await fetch('/api/badges/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ author: targetSlug })
            });
            const json = await res.json();
            if (json.success || res.ok) {
                const count = json.awards?.length || 0;
                const processed = json.processed || 0;
                setMessage(`Success! Processed ${processed} authors. ${count} new badges awarded.`);
            } else {
                setError(json.error || 'Failed to recalculate badges');
            }

        } catch (err) {
            console.error(err);
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="max-w-xl space-y-8">
            <div>
                <h1 className="text-2xl font-semibold leading-6 text-slate-900 dark:text-white">Badge Management</h1>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
                    Recalculate badges from existing article metrics.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-white">Badge Calculator</h3>
                    <div className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                        <p>Trigger the badge engine to check for new eligibility based on article metrics. Usage cost applies for AI analysis if content is new.</p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Global Recalculate */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                            <h4 className="font-medium text-slate-900 dark:text-white">Global Refresh</h4>
                            <p className="mt-1 text-xs text-slate-500">Check all authors and all badges.</p>
                            <button
                                onClick={() => handleRecalculate()}
                                disabled={loading}
                                className="mt-4 w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:ring-slate-600 dark:hover:bg-slate-700 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Recalculate All'}
                            </button>
                        </div>

                        {/* Specific Author Recalculate */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                            <h4 className="font-medium text-slate-900 dark:text-white">Single Author</h4>
                            <p className="mt-1 text-xs text-slate-500">Recalculate for one author.</p>
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    value={authorSlug}
                                    onChange={(e) => setAuthorSlug(e.target.value)}
                                    placeholder="author-slug"
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:text-white dark:ring-slate-600"
                                />
                                <button
                                    onClick={() => handleRecalculate(authorSlug)}
                                    disabled={loading || !authorSlug}
                                    className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50"
                                >
                                    Go
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        {message && (
                            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/30">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800 dark:text-green-200">{message}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
