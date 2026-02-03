'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ContributorDashboardRedirect() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/account/settings?tab=in_progress')
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-500 animate-pulse font-medium">Redirecting to your dashboard...</p>
            </div>
        </div>
    )
}
