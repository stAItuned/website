'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name?: string
  family_name?: string
}

interface StandardAuthContextType {
  user: GoogleUser | null
  signIn: (user: GoogleUser) => void
  signOut: () => void
  isAuthenticated: boolean
}

const StandardAuthContext = createContext<StandardAuthContextType | undefined>(undefined)

interface StandardAuthProviderProps {
  children: ReactNode
}

export function StandardAuthProvider({ children }: StandardAuthProviderProps) {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    if (typeof window === 'undefined') return null
    const savedUser = localStorage.getItem('google_user')
    if (!savedUser) return null

    try {
      return JSON.parse(savedUser) as GoogleUser
    } catch (error) {
      console.error('Failed to parse saved user:', error)
      localStorage.removeItem('google_user')
      return null
    }
  })

  const signIn = (user: GoogleUser) => {
    setUser(user)
    localStorage.setItem('google_user', JSON.stringify(user))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('google_user')
  }

  const value = {
    user,
    signIn,
    signOut,
    isAuthenticated: !!user
  }

  return (
    <StandardAuthContext.Provider value={value}>
      {children}
    </StandardAuthContext.Provider>
  )
}

export function useStandardAuth() {
  const context = useContext(StandardAuthContext)
  if (context === undefined) {
    throw new Error('useStandardAuth must be used within a StandardAuthProvider')
  }
  return context
}
