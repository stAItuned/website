'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Zap, BookOpen } from 'lucide-react'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { type User } from 'firebase/auth'
import { useLearnLocale, LearnLocaleToggle } from '@/lib/i18n'

export default function SignInClient() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useLearnLocale()
    const [error, setError] = useState<string | null>(null)

    const handleSignInSuccess = (user: User) => {
        // Redirect to home or previous page
        const redirectParam = searchParams.get('redirect')
        const redirectUrl = redirectParam || localStorage.getItem('redirectAfterLogin') || '/profile'

        // Clear legacy stored redirect if it exists
        if (localStorage.getItem('redirectAfterLogin')) {
            localStorage.removeItem('redirectAfterLogin')
        }

        router.push(redirectUrl)
    }

    const handleSignInError = (error: { message: string }) => {
        setError(error.message)
    }

    return (
        <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2">
            {/* Left: Content/Branding */}
            <div className="relative flex flex-col justify-center p-8 lg:p-12 bg-gray-900 text-white overflow-hidden min-h-[40vh] lg:min-h-screen">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0" />
                <div className="absolute inset-0 opacity-20 z-0">
                    <Image
                        src="/assets/general/home_bg.webp"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-0" />

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Image
                            src="/assets/general/logo-text.png"
                            alt="stAItuned Logo"
                            width={180}
                            height={40}
                            className="h-10 w-auto text-white mb-6"
                            priority
                        />

                        <h1 className="text-4xl font-bold mb-6 leading-tight">
                            {t.signIn.title}
                        </h1>
                        <p className="text-lg text-gray-300 mb-8">
                            {t.signIn.subtitle}
                        </p>

                        <div className="space-y-4">
                            <FeatureRow icon={<Zap className="w-5 h-5 text-yellow-400" />} text={t.signIn.benefits.save} />
                            <FeatureRow icon={<ShieldCheck className="w-5 h-5 text-green-400" />} text={t.signIn.benefits.sync} />
                            <FeatureRow icon={<BookOpen className="w-5 h-5 text-blue-400" />} text={t.signIn.benefits.contribute} />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right: Sign In Form */}
            <div className="relative flex flex-col items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-950">
                <Link
                    href="/"
                    className="absolute top-8 left-8 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                <div className="absolute top-8 right-8">
                    <LearnLocaleToggle />
                </div>

                <motion.div
                    className="w-full max-w-sm space-y-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-left">
                        {/* Mobile logo hidden since it's now in the top section */}
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {t.signIn.form.welcome}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {t.signIn.form.subtitle}
                        </p>
                    </div>

                    <div className="mt-8 space-y-6">
                        <div className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                                    {error}
                                </div>
                            )}

                            <GoogleSignInButton
                                className="w-full justify-center py-3 text-base shadow-sm hover:shadow-md transition-shadow"
                                onSignInSuccess={handleSignInSuccess}
                                onSignInError={handleSignInError}
                            />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-950 text-gray-500">
                                        {t.signIn.form.secure}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">
                                {t.signIn.form.googleDisclaimer}
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
                        {t.signIn.form.agreement}{' '}
                        <Link href="/terms" className="underline hover:text-gray-900 dark:hover:text-white">
                            {t.signIn.form.terms}
                        </Link>{' '}
                        {t.signIn.form.and}{' '}
                        <Link href="/privacy" className="underline hover:text-gray-900 dark:hover:text-white">
                            {t.signIn.form.privacy}
                        </Link>.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

function FeatureRow({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                {icon}
            </div>
            <span className="text-gray-200 font-medium">{text}</span>
        </div>
    )
}
