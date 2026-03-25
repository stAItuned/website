'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { isAdmin } from '@/lib/firebase/admin-emails'
import { getSafeInternalRedirect } from '@/lib/auth/session'

interface AdminGuardProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const isAuthorized = !!user && isAdmin(user.email)

    useEffect(() => {
        if (loading) return

        if (!user) {
            const redirectTarget = getSafeInternalRedirect(
                window.location.pathname + window.location.search,
                '/admin',
            )
            router.replace('/signin?redirect=' + encodeURIComponent(redirectTarget))
            return
        }

        if (!isAdmin(user.email)) {
            router.replace('/403')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            )
        )
    }

    if (!isAuthorized) {
        return null
    }

    return <>{children}</>
}
