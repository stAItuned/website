'use client'

import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { AuthContext } from './AuthContext'

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Start with loading=true to initialize auth
  const [initialized, setInitialized] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  // Initialize auth on mount with a delay to unblock main thread
  useEffect(() => {
    if (initialized) return

    const timer = setTimeout(() => {
      const initializeAuth = async () => {
        try {
          // Dynamic import Firebase only when needed
          const { onAuthStateChange, createServerSession } = await import('@/lib/firebase/auth')

          const unsubscribe = onAuthStateChange(async (user) => {
            setUser(user)

            if (!user) {
              setSessionReady(false)
              setSessionError(null)
              setLoading(false)
              return
            }

            try {
              const token = await user.getIdToken()
              const sessionResult = await createServerSession(token)

              if (!sessionResult.success) {
                setSessionReady(false)
                setSessionError(sessionResult.error || 'Failed to create secure session')
              } else {
                setSessionReady(true)
                setSessionError(null)
              }
            } catch (error) {
              setSessionReady(false)
              setSessionError(error instanceof Error ? error.message : 'Failed to create secure session')
            } finally {
              setLoading(false)
            }
          })

          setInitialized(true)
          return unsubscribe
        } catch (error) {
          console.error('Failed to initialize Firebase Auth:', error)
          setLoading(false)
        }
      }

      initializeAuth()
    }, 2000)

    return () => clearTimeout(timer)
  }, [initialized])

  const signIn = async () => {
    const { signInWithGooglePopup } = await import('@/lib/firebase/auth')
    return signInWithGooglePopup()
  }

  const signOut = async () => {
    const { signOutUser } = await import('@/lib/firebase/auth')
    return signOutUser()
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      sessionReady,
      sessionError,
      signIn: async () => { await signIn() },
      signOut: async () => { await signOut() }
    }}>
      {children}
    </AuthContext.Provider>
  )
}
