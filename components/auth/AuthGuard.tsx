'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'

const DISABLE_AUTH =
  (process.env.NEXT_PUBLIC_DISABLE_AUTH ?? '').toLowerCase() === 'true';

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!DISABLE_AUTH && !loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  if (!DISABLE_AUTH) {
    if (loading) {
      return (
        fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )
      )
    }

    if (!user) {
      return null // Will redirect via useEffect
    }
  }

  return <>{children}</>
}
