'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { isAdmin } from '@/lib/firebase/admin-emails'

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
            router.push('/signin?redirect=' + encodeURIComponent(window.location.pathname))
            return
        }

        if (!isAdmin(user.email)) {
            // Optional: Redirect to a 403 page or home
            router.push('/')
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
