'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
    trackRoleFitAuditCTAClicked,
    trackRoleFitAuditCTAView,
    trackRoleFitAuditCTADismiss
} from '@/lib/analytics/trackEvent'

interface RoleFitAuditCTAProps {
    variant?: 'box' | 'sticky'
    className?: string
}

export function RoleFitAuditCTA({ variant = 'box', className = '' }: RoleFitAuditCTAProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [isMounted, setIsMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setIsMounted(true)
        // Track view
        trackRoleFitAuditCTAView(variant)
    }, [variant])

    if (!isMounted) return null

    const handleCTAClick = () => {
        trackRoleFitAuditCTAClicked('audit_start', variant)
    }

    const handleDismiss = () => {
        setIsVisible(false)
        trackRoleFitAuditCTADismiss()
    }

    if (variant === 'box') {
        return (
            <div className={`relative overflow-hidden rounded-2xl border-2 border-primary-200 dark:border-primary-800/50 bg-white dark:bg-slate-900 shadow-xl ${className}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="relative p-6 sm:p-8 flex flex-col items-center text-center">
                    {/* Icon/Badge */}
                    <div className="mb-4 p-3 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Se vuoi ruoli GenAI, fai l'audit
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-lg">
                        Scopri il tuo livello attuale e ricevi un **piano personalizzato di 7 giorni** per colmare il gap.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Link
                            href="/role-fit-audit"
                            onClick={handleCTAClick}
                            className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 shadow-lg shadow-primary-500/25 transition-all transform hover:scale-[1.02]"
                        >
                            <span>Fai l'Audit (5 min)</span>
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                    <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-500">
                        Gratuito • Nessuna carta richiesta • Report Immediato
                    </p>
                </div>
            </div>
        )
    }

    if (variant === 'sticky') {
        if (!isVisible) return null;

        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-lg ${className}`}
                    >
                        <div className="relative flex items-center justify-between p-4 rounded-xl shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-primary-100 dark:border-primary-900/50 ring-1 ring-black/5">
                            {/* Close Button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute -top-2 -right-2 p-1 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shadow-sm transition-colors"
                                aria-label="Dismiss"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="flex-1 mr-4">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                                    Vuoi ruoli GenAI?
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                    Fai l'audit (5 min) → report + piano 7 giorni
                                </p>
                            </div>

                            <Link
                                href="/role-fit-audit"
                                onClick={handleCTAClick}
                                className="shrink-0 px-4 py-2 text-sm font-bold text-white rounded-lg bg-primary-600 hover:bg-primary-500 transition-colors shadow-md shadow-primary-500/20"
                            >
                                Fai l'Audit
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        )
    }

    return null
}
