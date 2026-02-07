'use client'

import { useState } from 'react'
import { usePWADetection } from '@/hooks/usePWADetection'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { useScreenSize } from '@/lib/hooks/useScreenSize'
import { useLearnLocale, homeTranslations } from '@/lib/i18n'

// Inline SVG Icons
const SmartphoneIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
)

const WifiOffIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
    </svg>
)

const ZapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
)

const DownloadIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
)

const BookOpenIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
)

interface PWAInstallInlineProps {
    className?: string
    /** Variant style */
    variant?: 'default' | 'compact' | 'hero'
}

/**
 * Inline CTA for PWA installation within page content
 * 
 * A beautiful card that can be placed anywhere in the content.
 * Multiple variants for different contexts.
 */
export function PWAInstallInline({ className = '', variant = 'default' }: PWAInstallInlineProps) {
    const isLarge = useScreenSize()
    const { isInBrowser } = usePWADetection()
    const { isPromptReady, promptInstall, isInstalled } = usePWAInstall()
    const { locale } = useLearnLocale()
    const t = homeTranslations[locale].pwa

    const [isHidden, setIsHidden] = useState(false)

    // Don't render if already installed, in PWA mode, hidden, or prompt not ready (e.g. Safari/Firefox)
    if (!isInBrowser || isInstalled || isHidden || !isPromptReady) return null

    const handleInstall = async () => {
        const success = await promptInstall()
        if (success) {
            setIsHidden(true)
        }
    }

    const benefits = [
        { Icon: WifiOffIcon, label: t.offline, description: t.offline_desc },
        { Icon: ZapIcon, label: t.fast, description: t.fast_desc },
        { Icon: BookOpenIcon, label: t.native, description: t.native_desc },
    ]

    // Compact variant - for sidebars or smaller spaces
    if (variant === 'compact') {
        return (
            <div
                className={`
          flex items-center justify-between gap-4 p-4
          bg-gradient-to-r from-slate-50 to-blue-50 
          dark:from-slate-800/50 dark:to-blue-900/20
          rounded-xl border border-slate-200 dark:border-slate-700
          ${className}
        `}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <SmartphoneIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                            {isLarge ? t.title_desktop : t.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleInstall}
                    disabled={!isPromptReady}
                    className={`
              px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors
              ${isPromptReady
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 cursor-default'}
            `}
                >
                    {t.install}
                </button>
            </div>
        )
    }

    // Hero variant - prominent, for strategic placement
    if (variant === 'hero') {
        return (
            <div
                className={`
          relative overflow-hidden
          bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900
          dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950
          rounded-3xl shadow-2xl
          ${className}
        `}
            >
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl" />
                </div>

                <div className="relative p-8 lg:p-10">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                                <SmartphoneIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                                        {t.free_app}
                                    </span>
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-white">
                                    stAItuned Learn
                                </h3>
                                <p className="text-blue-200 text-sm lg:text-base mt-1">
                                    {t.app_label}
                                </p>
                            </div>
                        </div>

                        {isPromptReady && (
                            <button
                                onClick={handleInstall}
                                className="
                  group flex items-center justify-center gap-2 
                  px-8 py-4 font-bold text-base
                  bg-white text-slate-900 rounded-2xl
                  hover:bg-blue-50 transition-all
                  shadow-xl hover:shadow-2xl hover:scale-[1.02]
                  lg:self-start
                "
                            >
                                <DownloadIcon className="w-5 h-5 group-hover:animate-bounce" />
                                {t.install}
                            </button>
                        )}
                    </div>

                    {/* Benefits grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="
                  flex items-start gap-3 p-4
                  bg-white/5 backdrop-blur-sm rounded-xl
                  border border-white/10
                "
                            >
                                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                                    <benefit.Icon className="w-5 h-5 text-blue-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">
                                        {benefit.label}
                                    </p>
                                    <p className="text-blue-200/70 text-xs mt-0.5">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!isPromptReady && (
                        <p className="text-center text-xs text-blue-200/60 mt-6">
                            {t.browser_hint}
                        </p>
                    )}
                </div>
            </div>
        )
    }

    // Default variant - balanced card
    return (
        <div
            className={`
        p-6 bg-white dark:bg-slate-800
        rounded-2xl shadow-lg
        border border-slate-100 dark:border-slate-700
        ${className}
      `}
        >
            <div className="flex items-start gap-4 mb-5">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                    <SmartphoneIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">
                        {isLarge ? t.title_desktop : t.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {t.subtitle}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
                    >
                        <benefit.Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {benefit.label}
                        </p>
                    </div>
                ))}
            </div>

            {isPromptReady && (
                <button
                    onClick={handleInstall}
                    className="
            w-full py-3 font-semibold text-sm
            bg-gradient-to-r from-blue-600 to-indigo-600
            text-white rounded-xl
            hover:from-blue-700 hover:to-indigo-700
            transition-all shadow-md hover:shadow-lg
          "
                >
                    {t.install}
                </button>
            )}

            {!isPromptReady && (
                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                    {t.browser_hint}
                </p>
            )}
        </div>
    )
}

export default PWAInstallInline
