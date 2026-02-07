'use client'

import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { AuthContext } from './AuthContext'

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Start with loading=true to initialize auth
  const [initialized, setInitialized] = useState(false)

  // Initialize auth on mount with a delay to unblock main thread
  useEffect(() => {
    if (initialized) return

    const timer = setTimeout(() => {
      const initializeAuth = async () => {
        try {
          // Dynamic import Firebase only when needed
          const { onAuthStateChange } = await import('@/lib/firebase/auth')

          const unsubscribe = onAuthStateChange((user) => {
            setUser(user)
            setLoading(false)
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
      signIn: async () => { await signIn() },
      signOut: async () => { await signOut() }
    }}>
      {children}
    </AuthContext.Provider>
  )
}
