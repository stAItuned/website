"use client"

import { FirebaseAuthProvider } from "@/components/auth/FirebaseAuthProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseAuthProvider>
      {children}
    </FirebaseAuthProvider>
  )
}
