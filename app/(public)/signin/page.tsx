"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"
import GoogleSignInButton from "@/components/auth/GoogleSignInButton"
import { User } from "firebase/auth"
import Link from "next/link"
import { useLearnLocale } from "@/lib/i18n"
import {
  contributeTranslations,
  ContributeLanguage,
} from "@/lib/i18n/contribute-translations"

/**
 * SignInPageContent - The actual sign-in page logic and UI.
 * Extracted into a separate component so it can be wrapped in Suspense.
 */
function SignInPageContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get("redirect")
  const { locale } = useLearnLocale()
  const lang: ContributeLanguage = locale === "en" ? "en" : "it"

  const ui = {
    it: {
      title: "Bentornato",
      subtitle: "Accedi per salvare preferenze, bookmark e contributi.",
      memberBenefitsTitle: "Vantaggi account",
      memberBenefits: [
        { icon: "📚", text: "Salva i tuoi articoli preferiti" },
        { icon: "🔄", text: "Sincronizza le preferenze tra dispositivi" },
        { icon: "✨", text: "Suggerimenti personalizzati" },
        { icon: "💬", text: "Partecipa alle discussioni della community" },
      ],
      contributorBenefitsTitle: "Vantaggi per Contributor",
      contributorBenefitsCta: "Scopri il programma",
      privacyNotice:
        "Usiamo Google Sign-In per creare il tuo account. Conserviamo email e informazioni di profilo (nome e immagine, se disponibili) per abilitare funzionalità come bookmark e contributi.",
      legalLinePrefix: "Accedendo, accetti i",
      legalLineJoin: "e prendi visione della",
      legalLineAnd: "e della",
      termsLabel: "Termini",
      privacyLabel: "Privacy Policy",
      cookieLabel: "Cookie Policy",
      backHome: "Torna alla Home",
    },
    en: {
      title: "Welcome Back",
      subtitle: "Sign in to save preferences, bookmarks, and contributions.",
      memberBenefitsTitle: "Member benefits",
      memberBenefits: [
        { icon: "📚", text: "Bookmark your favorite articles" },
        { icon: "🔄", text: "Sync preferences across devices" },
        { icon: "✨", text: "Personalized content recommendations" },
        { icon: "💬", text: "Join the AI community discussions" },
      ],
      contributorBenefitsTitle: "Contributor benefits",
      contributorBenefitsCta: "Explore the program",
      privacyNotice:
        "We use Google Sign-In to create your account. We store your email and profile info (name and photo, if available) to enable features like bookmarks and contributions.",
      legalLinePrefix: "By signing in, you agree to the",
      legalLineJoin: "and acknowledge the",
      legalLineAnd: "and",
      termsLabel: "Terms",
      privacyLabel: "Privacy Policy",
      cookieLabel: "Cookie Policy",
      backHome: "Back to Home",
    },
  }[lang]

  const contributorBenefits = [
    {
      icon: "👔",
      ...contributeTranslations[lang].landing.value.authority,
    },
    {
      icon: "🚀",
      ...contributeTranslations[lang].landing.value.distribution,
    },
    {
      icon: "🛡️",
      ...contributeTranslations[lang].landing.value.ownership,
    },
  ]

  // Redirect if already signed in
  useEffect(() => {
    if (!loading && user) {
      // Check if there's a redirect query param or stored URL
      const redirectUrl =
        redirectParam || localStorage.getItem("redirectAfterLogin")

      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin")
        router.push(redirectUrl)
      } else {
        router.push("/")
      }
    }
  }, [user, loading, router, redirectParam])

  const handleSignInSuccess = (user: User) => {
    console.log("Sign in successful:", user.email)

    // Check if there's a redirect query param or stored URL
    const redirectUrl = redirectParam || localStorage.getItem("redirectAfterLogin")

    if (redirectUrl) {
      localStorage.removeItem("redirectAfterLogin")
      router.push(redirectUrl)
    } else {
      router.push("/")
    }
  }

  const handleSignInError = (error: { code: string; message: string }) => {
    console.error("Sign in failed:", error)
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
            {ui.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {ui.subtitle}
          </p>
        </div>
      </div>

      {/* Sign-in Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-800 py-10 px-6 shadow-2xl rounded-2xl border border-gray-100 dark:border-slate-700 backdrop-blur-sm sm:px-12">
          <div className="space-y-6">
            {/* Member Benefits */}
            <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                {ui.memberBenefitsTitle}
              </h2>
              <ul className="space-y-3">
                {ui.memberBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{benefit.icon}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 pt-1">
                      {benefit.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contributor Benefits (from /contribute) */}
            <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  {ui.contributorBenefitsTitle}
                </h2>
                <Link
                  href="/contribute"
                  className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
                >
                  {ui.contributorBenefitsCta}
                </Link>
              </div>
              <ul className="space-y-3">
                {contributorBenefits.map((benefit) => (
                  <li key={benefit.title} className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{benefit.icon}</span>
                    <div className="space-y-0.5 pt-1">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {benefit.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {benefit.desc}
                      </div>
                    </div>
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
                  {ui.privacyNotice}
                </p>
              </div>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {ui.legalLinePrefix}{" "}
                <Link
                  href="/terms"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-medium"
                >
                  {ui.termsLabel}
                </Link>{" "}
                {ui.legalLineJoin}{" "}
                <Link
                  href="/privacy"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-medium"
                >
                  {ui.privacyLabel}
                </Link>{" "}
                {ui.legalLineAnd}{" "}
                <Link
                  href="/cookie-policy"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-medium"
                >
                  {ui.cookieLabel}
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
            {ui.backHome}
          </Link>
        </div>
      </div>
    </main>
  )
}

/**
 * SignInPage - Google sign-in page with a clear value proposition and links to legal documents.
 */
export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
            </div>
          </div>
        </main>
      }
    >
      <SignInPageContent />
    </Suspense>
  )
}

