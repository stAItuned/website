'use client'

import { useEffect, useState } from 'react'
import type { FirebaseOptions } from 'firebase/app'
import type { User } from 'firebase/auth'
import { app, initFirebaseAnalytics } from '@/lib/firebase/client'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'

export default function TestFirebasePage() {
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Checking...')
  const [analyticsStatus, setAnalyticsStatus] = useState<string>('Checking...')
  const [authStatus, setAuthStatus] = useState<string>('Ready')
  const [config, setConfig] = useState<FirebaseOptions | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const { hasConsentedToAnalytics } = useCookieConsent()

  useEffect(() => {
    try {
      // Test Firebase app initialization
      if (app) {
        setFirebaseStatus('✅ Firebase app initialized successfully')
        setConfig(app.options)
      } else {
        setFirebaseStatus('❌ Firebase app failed to initialize')
      }
    } catch (error) {
      setFirebaseStatus(`❌ Error: ${error}`)
      setAnalyticsStatus(`❌ Error: ${error}`)
    }
  }, [])

  useEffect(() => {
    if (!hasConsentedToAnalytics) {
      setAnalyticsStatus('⛔ Analytics disabled (no consent)')
      return
    }

    initFirebaseAnalytics()
      .then((instance) => {
        if (instance) {
          setAnalyticsStatus('✅ Analytics initialized successfully (consent granted)')
        } else {
          setAnalyticsStatus('⚠️ Analytics not initialized')
        }
      })
      .catch((error) => {
        setAnalyticsStatus(`❌ Error: ${error}`)
      })
  }, [hasConsentedToAnalytics])

  const handleSignInSuccess = (user: User) => {
    setUser(user)
    setAuthStatus('✅ User signed in successfully')
  }

  const handleSignInError = (error: { code: string; message: string }) => {
    setAuthStatus(`❌ Sign in failed: ${error.message}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Firebase Integration Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Firebase App Status</h2>
          <p className="text-lg">{firebaseStatus}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Analytics Status</h2>
          <p className="text-lg">{analyticsStatus}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Test</h2>
          <p className="text-lg mb-4">{authStatus}</p>
          <GoogleSignInButton 
            onSignInSuccess={handleSignInSuccess}
            onSignInError={handleSignInError}
            className="mb-4"
          />
          {user && (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">User Info:</h3>
              <p><strong>Name:</strong> {user.displayName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>UID:</strong> {user.uid}</p>
            </div>
          )}
        </div>

        {config && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Firebase Configuration</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>Storage Bucket:</strong> {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>Messaging Sender ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>App ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>Measurement ID:</strong> {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? '✅ Set' : '❌ Missing'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
