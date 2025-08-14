"use client"

import { AuthContext } from "@/components/auth/AuthContext"
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [user] = useState(null)
  const [loading] = useState(false)

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
