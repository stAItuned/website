'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import sign-in button to avoid loading Firebase immediately
const GoogleSignInButton = dynamic(
  () => import('@/components/auth/GoogleSignInButton'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }
)

interface AuthButtonProps {
  className?: string
}

export function AuthButton({ className }: AuthButtonProps) {
  const [showSignIn, setShowSignIn] = useState(false)

  if (!showSignIn) {
    return (
      <button
        onClick={() => setShowSignIn(true)}
        className={`px-4 py-2 text-sm font-medium text-primary-600 bg-white rounded-md hover:bg-gray-50 transition-colors ${className}`}
      >
        Sign In
      </button>
    )
  }

  return <GoogleSignInButton className={className} />
}
