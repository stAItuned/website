'use client'

import Link from 'next/link'
import { CheckCircle2, FilePenLine, LayoutDashboard } from 'lucide-react'
import { BecomeWriterForm, BecomeWriterSuccessPayload } from '@/components/contribute/BecomeWriterForm'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useWriterStatus } from '@/components/auth/WriterStatusContext'
import { useLearnLocale } from '@/lib/i18n'
import { contributeTranslations, ContributeLanguage } from '@/lib/i18n/contribute-translations'

type OnboardingStep = 1 | 2 | 3 | 4

function BecomeWriterContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { isWriter, loading } = useWriterStatus()
    const { locale } = useLearnLocale()
    const lang = locale as ContributeLanguage
    const t = contributeTranslations[lang].becomeWriter.onboarding
    const [step, setStep] = useState<OnboardingStep>(1)
    const [activation, setActivation] = useState<BecomeWriterSuccessPayload | null>(null)

    const nextUrl = useMemo(() => {
        const next = searchParams.get('next')
        if (!next) return '/account/settings'
        return next.startsWith('/') ? next : '/account/settings'
    }, [searchParams])

    useEffect(() => {
        if (!loading && isWriter && !activation) {
            router.replace(nextUrl)
        }
    }, [isWriter, loading, activation, nextUrl, router])

    const handleActivationSuccess = (payload: BecomeWriterSuccessPayload) => {
        setActivation(payload)
        setStep(4)
    }

    const progress = step === 4 ? 100 : Math.round((step / 4) * 100)

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                <header className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-primary-600">{t.badge}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t.stepCounter.replace('{current}', String(step))}</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {t.title}
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-400">
                            {t.subtitle}
                        </p>
                    </div>
                </header>

                {step === 1 && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 animate-slide-up">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.step1Title}</h2>
                        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                            {t.step1Items.map((item) => (
                                <li key={item} className="rounded-xl bg-slate-50 dark:bg-slate-900/60 px-4 py-3">{item}</li>
                            ))}
                        </ul>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all duration-300"
                            >
                                {t.continue}
                            </button>
                        </div>
                    </section>
                )}

                {step === 2 && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 animate-slide-up">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t.step2Title}</h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-4">
                                <p className="text-xs font-bold text-primary-600 mb-2">1</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{t.step2Cards[0]}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-4">
                                <p className="text-xs font-bold text-primary-600 mb-2">2</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{t.step2Cards[1]}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-4">
                                <p className="text-xs font-bold text-primary-600 mb-2">3</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{t.step2Cards[2]}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
                            >
                                {t.back}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all duration-300"
                            >
                                {t.startSetup}
                            </button>
                        </div>
                    </section>
                )}

                {step === 3 && (
                    <section className="animate-slide-up">
                        <BecomeWriterForm onSuccess={handleActivationSuccess} submitLabel={t.activateProfile} />
                    </section>
                )}

                {step === 4 && activation && (
                    <section className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm dark:border-emerald-800 dark:bg-slate-800 animate-fade-in">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-300" />
                        </div>
                        <div className="text-center space-y-3">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.successTitle}</h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                {t.successMessage}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {t.authorPage} <Link href={activation.profilePath} className="text-primary-600 hover:underline">{activation.profilePath}</Link>
                            </p>
                        </div>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                href="/contribute/wizard"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-primary-500"
                            >
                                <FilePenLine className="h-4 w-4" />
                                {t.firstIdeaCta}
                            </Link>
                            <Link
                                href={nextUrl}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                {t.dashboardCta}
                            </Link>
                        </div>
                    </section>
                )}
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
