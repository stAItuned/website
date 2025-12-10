'use client'

import { useState, useEffect } from 'react'
import { usePWADetection } from '@/hooks/usePWADetection'
import { usePWAInstall, dismissPWAInstall, isFirstLearnVisit } from '@/hooks/usePWAInstall'

// Inline SVG Icons
const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
)

const SmartphoneIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
)

const WifiIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
    </svg>
)

const ZapIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
)

const HomeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
)

interface PWAInstallCardProps {
    className?: string
    /** Delay before showing the card (ms) */
    delay?: number
}

/**
 * Floating bottom card for PWA installation promotion
 * 
 * Shows on first visit to the learn section with compelling reasons to install.
 * Slides up from the bottom with a beautiful design.
 */
export function PWAInstallCard({ className = '', delay = 3000 }: PWAInstallCardProps) {
    const { isInBrowser } = usePWADetection()
    const { isPromptReady, promptInstall, isInstalled } = usePWAInstall()
    const [isVisible, setIsVisible] = useState(false)
    const [isFirstVisit, setIsFirstVisit] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        // Check if first visit on client side
        const firstVisit = isFirstLearnVisit()
        setIsFirstVisit(firstVisit)
    }, [])

    useEffect(() => {
        // Show card only on first visit when conditions are met
        if (isInBrowser && isPromptReady && !isInstalled && isFirstVisit) {
            const timer = setTimeout(() => {
                setIsAnimating(true)
                setTimeout(() => setIsVisible(true), 50)
            }, delay)
            return () => clearTimeout(timer)
        }
    }, [isInBrowser, isPromptReady, isInstalled, isFirstVisit, delay])

    const handleDismiss = () => {
        setIsVisible(false)
        setTimeout(() => setIsAnimating(false), 300)
        dismissPWAInstall()
    }

    const handleInstall = async () => {
        const success = await promptInstall()
        if (success) {
            handleDismiss()
        }
    }

    if (!isAnimating) return null

    const benefits = [
        { Icon: WifiIcon, text: 'Leggi articoli offline' },
        { Icon: ZapIcon, text: 'Caricamento istantaneo' },
        { Icon: HomeIcon, text: 'Accesso dalla home' },
    ]

    return (
        <>
            {/* Backdrop */}
            <div
                className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-50
          transition-opacity duration-300
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
                onClick={handleDismiss}
            />

            {/* Card */}
            <div
                className={`
          fixed bottom-0 left-0 right-0 z-50
          px-4 pb-6 pt-2
          transform transition-transform duration-300 ease-out
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
          ${className}
        `}
            >
                <div className="
          max-w-md mx-auto
          bg-white dark:bg-slate-800
          rounded-2xl shadow-2xl
          overflow-hidden
          border border-slate-200 dark:border-slate-700
        ">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Chiudi"
                        >
                            <XIcon className="w-5 h-5 text-white" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <SmartphoneIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">stAItuned Learn</h3>
                                <p className="text-blue-100 text-sm">La tua app per imparare l'AI</p>
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="px-5 py-4 space-y-3">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <benefit.Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-slate-700 dark:text-slate-300 text-sm">
                                    {benefit.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="px-5 pb-5 flex gap-3">
                        <button
                            onClick={handleDismiss}
                            className="
                flex-1 py-2.5 text-sm font-medium
                text-slate-600 dark:text-slate-400
                hover:text-slate-800 dark:hover:text-slate-200
                transition-colors
              "
                        >
                            Forse dopo
                        </button>
                        <button
                            onClick={handleInstall}
                            className="
                flex-1 py-2.5 text-sm font-semibold
                bg-gradient-to-r from-blue-600 to-indigo-600
                text-white rounded-xl
                hover:from-blue-700 hover:to-indigo-700
                transition-all shadow-md hover:shadow-lg
              "
                        >
                            Installa ora
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PWAInstallCard
