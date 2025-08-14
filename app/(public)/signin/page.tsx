"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"
import GoogleSignInButton from "@/components/auth/GoogleSignInButton"
import { User } from "firebase/auth"

export default function SignInPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect if already signed in
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSignInSuccess = (user: User) => {
    console.log('Sign in successful:', user.email)
    router.push('/')
  }

  const handleSignInError = (error: { code: string; message: string }) => {
    console.error('Sign in failed:', error)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </main>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to stAItuned
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our community of AI enthusiasts
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <GoogleSignInButton
              onSignInSuccess={handleSignInSuccess}
              onSignInError={handleSignInError}
              className="w-full justify-center"
            />
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
