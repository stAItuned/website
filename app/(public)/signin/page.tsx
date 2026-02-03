"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"
import GoogleSignInButton from "@/components/auth/GoogleSignInButton"
import { User } from "firebase/auth"
import Image from "next/image"
import Link from "next/link"

export default function SignInPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')

  // Redirect if already signed in
  useEffect(() => {
    if (!loading && user) {
      // Check if there's a redirect query param or stored URL
      const redirectUrl = redirectParam || localStorage.getItem('redirectAfterLogin')

      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin')
        router.push(redirectUrl)
      } else {
        router.push('/')
      }
    }
  }, [user, loading, router, redirectParam])

  const handleSignInSuccess = (user: User) => {
    console.log('Sign in successful:', user.email)

    // Check if there's a redirect query param or stored URL
    const redirectUrl = redirectParam || localStorage.getItem('redirectAfterLogin')

    if (redirectUrl) {
      localStorage.removeItem('redirectAfterLogin')
      router.push(redirectUrl)
    } else {
      router.push('/')
    }
  }

  const handleSignInError = (error: { code: string; message: string }) => {
    console.error('Sign in failed:', error)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        </div>
      </main>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-32 lg:pt-24">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/30 dark:bg-secondary-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo */}
        {/* <div className="flex flex-col items-center mb-8">
          <Link href="/" className="transform transition-transform hover:scale-105 mb-4">
            <Image
              src="/assets/general/logo-text.png"
              alt="stAItuned Logo"
              width={200}
              height={60}
              className="drop-shadow-lg"
              priority
            />
          </Link>
        </div> */}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sign in to access your personalized experience
          </p>
        </div>
      </div>

      {/* Sign-in Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-800 py-10 px-6 shadow-2xl rounded-2xl border border-gray-100 dark:border-slate-700 backdrop-blur-sm sm:px-12">
          <div className="space-y-6">
            {/* Benefits Section */}
            <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                Member Benefits
              </h2>
              <ul className="space-y-3">
                {[
                  { icon: '📚', text: 'Bookmark your favorite articles' },
                  { icon: '🔄', text: 'Sync preferences across devices' },
                  { icon: '✨', text: 'Personalized content recommendations' },
                  { icon: '💬', text: 'Join the AI community discussions' }
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{benefit.icon}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 pt-1">
                      {benefit.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sign In Button */}
            <div className="space-y-4">
              <GoogleSignInButton
                onSignInSuccess={handleSignInSuccess}
                onSignInError={handleSignInError}
                className="w-full justify-center"
              />
            </div>

            {/* Privacy Notice */}
            <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  We collect your email and profile info to provide personalized features like bookmarks and recommendations.
                </p>
              </div>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                By signing in, you agree to our{' '}
                <Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-medium">
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link href="/cookie-policy" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-medium">
                  Cookie Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
