'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { isAdmin as checkIsAdmin } from '@/lib/firebase/admin-emails'

export function AdminBadgeControls({ authorSlug }: { authorSlug?: string }) {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const router = useRouter()

    if (!user?.email || !checkIsAdmin(user.email)) {
        return null
    }

    const handleCalculate = async () => {
        setIsLoading(true)
        setResult(null)
        try {
            if (!user) {
                setResult('Error: Missing authenticated user');
                return;
            }

            const token = await user.getIdToken();

            const res = await fetch('/api/badges/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ author: authorSlug })
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
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                    onClick={handleCalculate}
                    disabled={isLoading}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
                >
                    {isLoading ? 'Calculating...' : authorSlug ? 'Recalculate Badges' : 'Recalculate ALL Badges'}
                </button>
                {result && (
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${result.startsWith('Error') ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300'}`}>
                        {result}
                    </span>
                )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {authorSlug
                    ? 'Triggers the rule engine to check for new badge eligibility based on current metrics.'
                    : 'Admin: Triggers rule engine for ALL authors in the system. Use this to update achievements globally.'}
            </p>
        </div>
    )
}
