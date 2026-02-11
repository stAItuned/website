'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { User } from 'firebase/auth'

interface AuthError {
  code: string
  message: string
  email?: string | null
}

interface GoogleSignInButtonProps {
  onSignInSuccess?: (user: User) => void
  onSignInError?: (error: AuthError) => void
  className?: string
  useRedirect?: boolean
}

export default function GoogleSignInButton({ 
  onSignInSuccess, 
  onSignInError, 
  className = "",
  useRedirect = false 
}: GoogleSignInButtonProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const DISABLE_AUTH =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'
      : false

  useEffect(() => {
    if (DISABLE_AUTH) {
      setInitialLoading(false)
      return
    }
    
    // Dynamically import Firebase auth functions
    const initAuth = async () => {
      const { onAuthStateChange, handleRedirectResult } = await import('@/lib/firebase/auth')
      
      // Handle redirect result on component mount (for redirect flow)
      const handleRedirect = async () => {
        if (useRedirect) {
          const result = await handleRedirectResult()
          if (result.success && result.user) {
            onSignInSuccess?.(result.user)
          } else if (!result.success && result.error) {
            onSignInError?.(result.error)
          }
        }
      }
      await handleRedirect()

      // Listen for auth state changes
      const unsubscribe = onAuthStateChange((user) => {
        setUser(user)
        setInitialLoading(false)
      })

      return unsubscribe
    }
    
    initAuth()
  }, [useRedirect, onSignInSuccess, onSignInError, DISABLE_AUTH])

  const getRedirectFromQuery = () => {
    if (typeof window === 'undefined') return null
    const param = new URLSearchParams(window.location.search).get('redirect')
    if (!param) return null
    return param.startsWith('/') ? param : null
  }

  const handleSignIn = async () => {
    setLoading(true)
    
    try {
      const { signInWithGooglePopup } = await import('@/lib/firebase/auth')
      const result = await signInWithGooglePopup()
      
      if (result.success && result.user) {
        const redirectFromQuery = getRedirectFromQuery()
        const redirectFromStorage = localStorage.getItem('redirectAfterLogin')
        const redirectUrl = redirectFromQuery || redirectFromStorage

        if (redirectFromStorage) {
          localStorage.removeItem('redirectAfterLogin')
        }

        if (redirectUrl) {
          window.location.href = redirectUrl
          return
        }

        onSignInSuccess?.(result.user)
      } else if (!result.success && result.error) {
        onSignInError?.(result.error)
      }
    } catch (error) {
      onSignInError?.({
        code: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    
    try {
      const { signOutUser } = await import('@/lib/firebase/auth')
      await signOutUser()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="flex items-center space-x-2">
          {user.photoURL && (
            <Image 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="text-sm font-medium text-gray-700">
            {user.displayName || user.email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
      ) : (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  )
}
