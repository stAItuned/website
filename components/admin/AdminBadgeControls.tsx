'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminBadgeControls({ authorSlug }: { authorSlug?: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const router = useRouter()

    const handleCalculate = async () => {
        setIsLoading(true)
        setResult(null)
        try {
            // In a real app, the secret should be handled securely or via auth session
            // For this dev/personal context, we'll use the default dev secret provided in the API route
            const url = authorSlug
                ? `/api/badges/calculate?author=${authorSlug}`
                : '/api/badges/calculate';

            const res = await fetch(url, {
                headers: {
                    'Authorization': 'Bearer dev-secret-key'
                }
            })

            const data = await res.json()

            if (res.ok) {
                const awardCount = data.awards ? data.awards.length : 0;
                const authorCount = data.processed || 0;
                setResult(authorSlug
                    ? `Success! ${awardCount} new badges awarded.`
                    : `Success! Processed ${authorCount} authors. ${awardCount} new badges awarded.`);

                router.refresh(); // Refresh page to show new badges
            } else {
                setResult(`Error: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            setResult('Error: Failed to connect to API')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mt-8 pt-8 border-t-2 border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {authorSlug ? 'Admin Controls' : 'Global Admin Controls'}
                </h4>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCalculate}
                        disabled={isLoading}
                        className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Calculating...' : authorSlug ? 'Recalculate Badges' : 'Recalculate ALL Badges'}
                    </button>
                    {result && (
                        <span className={`text-sm ${result.startsWith('Error') ? 'text-red-500' : 'text-emerald-600'}`}>
                            {result}
                        </span>
                    )}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                    {authorSlug
                        ? 'Triggers the rule engine to check for new badge eligibility based on current metrics.'
                        : 'Triggers rule engine for ALL authors in the system. May take a few seconds.'}
                </p>
            </div>
        </div>
    )
}
