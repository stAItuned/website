'use client'

import { Suspense } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { DraftEditor } from '@/components/contribute/draft/DraftEditor'

export default function DraftPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="min-h-screen pt-32 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        }
      >
        <DraftEditor />
      </Suspense>
    </AuthGuard>
  )
}

