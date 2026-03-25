import { createContext, useContext } from 'react'
import { User } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  sessionReady: boolean
  sessionError: string | null
  signIn?: () => Promise<void>
  signOut?: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  sessionReady: false,
  sessionError: null,
})

export function useAuth() {
  return useContext(AuthContext)
}
