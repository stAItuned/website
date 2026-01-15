'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import RoleFitAuditForm from './RoleFitAuditForm'

// =============================================================================
// Configuration
// =============================================================================

/**
 * Valid promo codes that unlock the free audit
 * All codes are case-insensitive
 */
const VALID_PROMO_CODES = ['GENAI0', 'GENAI2026', 'STAITUNED', 'FREE100']

/**
 * Default promo code to pre-apply
 */
const DEFAULT_PROMO_CODE = 'GENAI0'

/**
 * Stripe payment link for Role Fit Audit
 * Configure in .env as NEXT_PUBLIC_STRIPE_ROLE_FIT_AUDIT_LINK
 */
const STRIPE_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_ROLE_FIT_AUDIT_LINK || ''

// =============================================================================
// Component
// =============================================================================

export default function PromoCodeGate() {
    // ---------------------------------------------------------------------------
    // State
    // ---------------------------------------------------------------------------
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [promoCode, setPromoCode] = useState(DEFAULT_PROMO_CODE)
    const [promoApplied, setPromoApplied] = useState(true) // Pre-applied by default
    const [showPromoInput, setShowPromoInput] = useState(false)
    const [error, setError] = useState('')

    const searchParams = useSearchParams()

    // ---------------------------------------------------------------------------
    // Auto-apply promo from URL parameter
    // ---------------------------------------------------------------------------
    useEffect(() => {
        const urlCoupon = searchParams.get('coupon') || searchParams.get('promo')
        if (urlCoupon) {
            const normalizedCode = urlCoupon.trim().toUpperCase()
            if (VALID_PROMO_CODES.includes(normalizedCode)) {
                setPromoCode(normalizedCode)
                setPromoApplied(true)
            }
        }
    }, [searchParams])

    // ---------------------------------------------------------------------------
    // Handlers
    // ---------------------------------------------------------------------------
    const handleApplyPromo = () => {
        const normalizedCode = promoCode.trim().toUpperCase()

        if (VALID_PROMO_CODES.includes(normalizedCode)) {
            setError('')
            setPromoApplied(true)
            setShowPromoInput(false)
        } else {
            setError('Codice non valido. Riprova.')
            setPromoApplied(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && promoCode.trim()) {
            handleApplyPromo()
        }
    }

    const handleStart = () => {
        if (promoApplied) {
            setIsUnlocked(true)
        } else {
            if (STRIPE_PAYMENT_LINK) {
                window.location.href = STRIPE_PAYMENT_LINK
            } else {
                setError('Link di pagamento non disponibile. Usa il codice GENAI0.')
            }
        }
    }

    // ---------------------------------------------------------------------------
    // Render: Unlocked - Show the form
    // ---------------------------------------------------------------------------
    if (isUnlocked) {
        return (
            <>
                {/* Compact Success Banner */}
                <div className="max-w-xl mx-auto -mt-8 mb-10 relative z-10">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-4 text-center">
                        <div className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
                            <span>✓</span>
                            <span>Accesso sbloccato · €0 oggi</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <RoleFitAuditForm />
            </>
        )
    }

    // ---------------------------------------------------------------------------
    // Render: Main View
    // ---------------------------------------------------------------------------
    return (
        <div className="max-w-2xl mx-auto -mt-10 relative z-10">
            {/* Main Card */}
            <div className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">

                {/* Price Header - Free Today */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-5xl font-bold">€0</span>
                        <div className="text-left">
                            <span className="block text-green-200 line-through text-lg">€19,90</span>
                            <span className="text-xs text-green-100">oggi</span>
                        </div>
                    </div>
                    {promoApplied && (
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                            <span>🎟️</span>
                            <span>Codice applicato: <strong>{promoCode}</strong></span>
                        </div>
                    )}
                    {!promoApplied && (
                        <button
                            onClick={() => setShowPromoInput(true)}
                            className="text-sm text-green-100 hover:text-white underline underline-offset-2"
                        >
                            Hai un codice?
                        </button>
                    )}
                </div>

                {/* Promo Input (hidden by default) */}
                {showPromoInput && !promoApplied && (
                    <div className="p-4 bg-slate-50 dark:bg-[#0F1117] border-b border-slate-200 dark:border-slate-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => {
                                    setPromoCode(e.target.value)
                                    setError('')
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Inserisci codice"
                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#151925] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition uppercase"
                                autoFocus
                            />
                            <button
                                onClick={handleApplyPromo}
                                disabled={!promoCode.trim()}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                            >
                                Applica
                            </button>
                        </div>
                        {error && (
                            <p className="text-xs text-red-500 mt-2">{error}</p>
                        )}
                    </div>
                )}

                {/* Pain → Solution Grid */}
                <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 text-center">
                        Dal problema alla soluzione
                    </p>

                    <div className="space-y-3">
                        {/* Pain 1 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50/50 to-green-50/50 dark:from-red-900/5 dark:to-green-900/10 border border-slate-100 dark:border-slate-800">
                            <div className="flex-1">
                                <span className="text-sm text-red-500/80 dark:text-red-400/60 line-through">"Il mio profilo sembra AI generico"</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-600 text-sm">→</span>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">✅ Ruolo consigliato + alternativa</span>
                            </div>
                        </div>

                        {/* Pain 2 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50/50 to-green-50/50 dark:from-red-900/5 dark:to-green-900/10 border border-slate-100 dark:border-slate-800">
                            <div className="flex-1">
                                <span className="text-sm text-red-500/80 dark:text-red-400/60 line-through">"Non so quale ruolo puntare"</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-600 text-sm">→</span>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">✅ Score su 4 assi + spiegazione</span>
                            </div>
                        </div>

                        {/* Pain 3 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50/50 to-green-50/50 dark:from-red-900/5 dark:to-green-900/10 border border-slate-100 dark:border-slate-800">
                            <div className="flex-1">
                                <span className="text-sm text-red-500/80 dark:text-red-400/60 line-through">"Mando CV, niente colloqui"</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-600 text-sm">→</span>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">✅ Gap analysis + piano 7 giorni</span>
                            </div>
                        </div>

                        {/* Pain 4 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50/50 to-green-50/50 dark:from-red-900/5 dark:to-green-900/10 border border-slate-100 dark:border-slate-800">
                            <div className="flex-1">
                                <span className="text-sm text-red-500/80 dark:text-red-400/60 line-through">"Non ho proof credibili"</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-600 text-sm">→</span>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">✅ Report PDF salvabile</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="p-6 pt-0">
                    <button
                        onClick={handleStart}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                        {promoApplied ? 'Fai l\'audit gratis →' : 'Comincia a €19,90 →'}
                    </button>
                    {promoApplied && (
                        <p className="text-center text-xs text-slate-400 mt-3">
                            €0 oggi · Nessun pagamento richiesto
                        </p>
                    )}
                    {error && !showPromoInput && (
                        <p className="text-center text-xs text-red-500 mt-3">{error}</p>
                    )}
                </div>
            </div>

            {/* How It Works */}
            <div className="mt-10 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
                    Come funziona
                </p>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-lg">
                            1️⃣
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Rispondi</p>
                        <p className="text-xs text-slate-400">20 domande · 5 min</p>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-lg">
                            2️⃣
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Ottieni</p>
                        <p className="text-xs text-slate-400">Score + archetype</p>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-lg">
                            3️⃣
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Agisci</p>
                        <p className="text-xs text-slate-400">Piano 7 giorni</p>
                    </div>
                </div>
            </div>

            {/* What You Get */}
            <div className="mt-10 p-6 bg-white dark:bg-[#151925] rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center gap-4">
                    <span className="text-3xl">📄</span>
                    <div className="text-left">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Report PDF completo via email</p>
                        <p className="text-xs text-slate-400">Score su 4 dimensioni · Archetipo · Gap analysis · Piano 7 giorni</p>
                    </div>
                </div>
            </div>

            {/* Trust Footer */}
            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400">
                    Creato da chi valuta CV e progetti GenAI in contesti reali.
                </p>
            </div>
        </div>
    )
}
