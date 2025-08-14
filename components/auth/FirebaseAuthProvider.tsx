'use client'

import { useState } from 'react'
import { User } from 'firebase/auth'
import { AuthContext } from './AuthContext'

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false) // Don't load Firebase by default

  const initializeAuth = async () => {
    if (loading) return // Already initialized or initializing
    
    setLoading(true)
    try {
      // Dynamic import Firebase only when needed
      const { onAuthStateChange } = await import('@/lib/firebase/auth')
      
      const unsubscribe = onAuthStateChange((user) => {
        setUser(user)
        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error('Failed to initialize Firebase Auth:', error)
      setLoading(false)
    }
  }

  const signIn = async () => {
    await initializeAuth()
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
