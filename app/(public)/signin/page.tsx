import { Metadata } from 'next'
import { Suspense } from 'react'
import SignInClient from './SignInClient'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to stAItuned to access exclusive AI playbooks, tools, and community.',
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
      <SignInClient />
    </Suspense>
  )
}
