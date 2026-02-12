'use client'

import { BecomeWriterForm } from '@/components/contribute/BecomeWriterForm'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useMemo } from 'react'
import { useWriterStatus } from '@/components/auth/WriterStatusContext'

function BecomeWriterContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { isWriter, loading } = useWriterStatus()

    const nextUrl = useMemo(() => {
        const next = searchParams.get('next')
        if (!next) return '/account/settings'
        return next.startsWith('/') ? next : '/account/settings'
    }, [searchParams])

    useEffect(() => {
        if (!loading && isWriter) {
            router.replace(nextUrl)
        }
    }, [isWriter, loading, nextUrl, router])

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-20 px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Diventa un Writer di stAI tuned
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Entra a far parte della nostra community di autori. Crea il tuo profilo pubblico e inizia a condividere le tue conoscenze.
                    </p>
                </div>

                <BecomeWriterForm onSuccess={() => { }} redirectUrl={nextUrl} />
            </div>
        </main>
    )
}

export default function BecomeWriterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-20 px-6 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
            <BecomeWriterContent />
        </Suspense>
    )
}
