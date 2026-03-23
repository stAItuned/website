'use client'

import { FormEvent, useState } from 'react'
import { useCareerOS } from './context/CareerOSContext'
import { careerOSTranslations, type CareerOSLocale } from '@/lib/i18n/career-os-translations'

type PricingMode = 'classe' | '1to1'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

import { trackSelectContent, trackSelectItem } from '@/lib/analytics/trackEvent'

const pricingData = {
    classe: {
        label: 'Classe',
        sublabel: '8-10 persone • Prossima classe al raggiungimento',
        tiers: [
            {
                name: 'Starter',
                outcome: 'Outcome: Candidati con metodo',
                duration: '4 settimane',
                description: 'Candidabile + Proof-lite',
                price: 299,
                originalPrice: 450,
                features: [
                    'Role-Fit Audit & Positioning (W1)',
                    'Target List (W2)',
                    'CV Master + LinkedIn (ATS-Proof) (W3)',
                    'Technical Article (Proof Pubblica) (W4)',
                    'Accesso community Career OS',
                ],
                popular: false,
            },
            {
                name: 'Pro',
                outcome: 'Outcome: Offer-Ready',
                duration: '8 settimane',
                description: 'Proof seria + Interview',
                price: 599,
                originalPrice: 890,
                features: [
                    'Tutto in Starter',
                    'WebApp + Project AI Live (W6)',
                    '10 Candidature Personalizzate (W7)',
                    '10 JD Intelligence Reports (W8)',
                    'Simulazione Colloquio (W8)',
                    'Supporto prioritario',
                ],
                popular: true,
            },
        ],
    },
    '1to1': {
        label: '1:1 Premium',
        sublabel: 'Sessioni individuali • Inizio immediato',
        tiers: [
            {
                name: 'Starter',
                outcome: 'Outcome: Candidati con metodo',
                duration: '4 settimane',
                description: 'Candidabile + Proof-lite',
                price: 590,
                originalPrice: 790,
                features: [
                    'Role-Fit Audit & Positioning (W1)',
                    'Target List (W2)',
                    'CV Master + LinkedIn (ATS-Proof) (W3)',
                    'Technical Article (Proof Pubblica) (W4)',
                    '4 Sessioni 1:1 dedicate (Strategy & Review)',
                ],
                popular: false,
            },
            {
                name: 'Pro',
                outcome: 'Outcome: Offer-Ready',
                duration: '8 settimane',
                description: 'Proof seria + Interview',
                price: 1190,
                originalPrice: 1490,
                features: [
                    'Tutto in Starter',
                    'WebApp + Project AI Live (W6)',
                    '10 Candidature Personalizzate (W7)',
                    '10 JD Intelligence Reports (W8)',
                    '2 Simulazioni Colloquio (Tecnico + Soft)',
                    'Supporto prioritario',
                ],
                popular: true,
            },
            {
                name: 'Elite',
                outcome: 'Outcome: Career Partner',
                duration: '8 settimane + 12 mesi',
                description: 'Supporto fino all\'offerta (cap)',
                price: 1990,
                originalPrice: 2490,
                features: [
                    'Tutto in Pro',
                    'Tool Career OS per 12 mesi',
                    'Tool Editorial Planner per 12 mesi',
                    '1 call/mese (45 min) per 12 mesi',
                    '2 review prioritarie/mese (asset)',
                    'Supporto async con SLA 72h',
                    '+1 mock interview (totale 3)',
                ],
                popular: false,
                note: 'Posti limitati (max 8 attivi). Nessuna "job guarantee".',
            },
        ],
    },
}

/** Career OS pricing section with dynamic deadline label. */
export default function PricingSection({ locale }: { locale: CareerOSLocale }) {
    const { mode, setMode, objective, openAuditModal } = useCareerOS()
    const t = careerOSTranslations[locale].pricing
    const waitlistErrors = careerOSTranslations[locale].apiErrors.waitlist
    const current = pricingData[mode]

    // Selected tier state - default based on objective or 'Pro'
    const getDefaultTier = () => {
        if (objective === 'start') return 'Starter'
        return 'Pro' // Default to Pro
    }
    const [selectedTier, setSelectedTier] = useState<string>(getDefaultTier())
    const [isPriceGateOpen, setIsPriceGateOpen] = useState(false)
    const [priceGateTier, setPriceGateTier] = useState<string | null>(null)
    const [priceGateEmail, setPriceGateEmail] = useState('')
    const [priceGateError, setPriceGateError] = useState('')
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [marketingConsent, setMarketingConsent] = useState(false)
    const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false)
    const [waitlistSuccess, setWaitlistSuccess] = useState(false)

    // The recommended tier (for badge) - always Pro
    const recommendedTier = 'Pro'

    // Determine which plan to highlight based on selection
    const tiersWithHighlight = current.tiers.map(tier => {
        return {
            ...tier,
            isSelected: tier.name === selectedTier,
            isRecommended: tier.name === recommendedTier,
        }
    })

    const handleOpenPriceGate = (tierName: string) => {
        setPriceGateTier(tierName)
        setPriceGateEmail('')
        setPriceGateError('')
        setAcceptedPrivacy(false)
        setAcceptedTerms(false)
        setMarketingConsent(false)
        setWaitlistSuccess(false)
        setIsPriceGateOpen(true)
    }

    const handleRevealPrice = async (event: FormEvent) => {
        event.preventDefault()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(priceGateEmail.trim())) {
            setPriceGateError(t.revealError)
            return
        }
        if (!acceptedPrivacy) {
            setPriceGateError(waitlistErrors.privacyRequired)
            return
        }
        if (!acceptedTerms) {
            setPriceGateError(waitlistErrors.termsRequired)
            return
        }

        setIsSubmittingWaitlist(true)
        setPriceGateError('')
        try {
            const response = await fetch('/api/career-os/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: priceGateEmail.trim(),
                    acceptedPrivacy,
                    acceptedTerms,
                    marketingConsent,
                    intent: {
                        pricingTier: priceGateTier,
                        pricingMode: mode,
                        objective,
                    },
                    source: 'pricing_waitlist_modal',
                    page: '/career-os#pricing',
                    locale,
                    website: '',
                }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => ({ error: t.revealSubmitError }))
                setPriceGateError(typeof payload?.error === 'string' ? payload.error : t.revealSubmitError)
                return
            }

            setWaitlistSuccess(true)
        } catch {
            setPriceGateError(t.revealSubmitError)
        } finally {
            setIsSubmittingWaitlist(false)
        }
    }

    return (
        <section id="pricing" className="py-24 bg-[#1A1E3B] text-white">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl md:text-3xl font-bold text-center mb-6">
                    {t.title} <span className="text-[#FFF272]">{t.titleAccent}</span>
                </h2>

                {/* Compact "ROI" Comparison */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Old Way */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                            <span className="text-rose-400 font-bold text-sm mb-1 uppercase tracking-wider">🚫 {t.roiOldLabel}</span>
                            <p className="text-slate-300 text-sm">
                                €4.000+ • 6 mesi • <span className="underline decoration-rose-500/50">Ore di video</span>
                            </p>
                        </div>

                        {/* New Way */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-[#1A1E3B] to-[#FCD34D]/10 border border-[#FCD34D]/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#FCD34D]/5 animate-pulse" />
                            <span className="text-[#FCD34D] font-bold text-sm mb-1 uppercase tracking-wider relative z-10">✅ {t.roiNewLabel}</span>
                            <p className="text-slate-200 text-sm relative z-10">
                                {t.priceOnRequest} • 4-8 settimane • <span className="font-bold text-white">Solo OUTCOME</span>
                            </p>
                        </div>
                    </div>
                    {/* Tagline integrated compactly */}
                    <p className="text-center text-xs text-slate-400 mt-3">
                        {t.roiTagline}
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex justify-center mb-4">
                    <div className="inline-flex rounded-full bg-white/10 p-1">
                        <button
                            onClick={() => {
                                setMode('1to1')
                                trackSelectContent('pricing_mode', '1to1')
                            }}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${mode === '1to1'
                                ? 'bg-[#FCD34D] text-[#1A1E3B]'
                                : 'text-white/70 hover:text-white'
                                }`}
                        >
                            👤 1:1 Premium
                        </button>
                        <button
                            disabled
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all relative
                                text-white/40 cursor-not-allowed`}
                        >
                            🎓 {t.classComingSoon}
                        </button>
                    </div>
                </div>

                {/* Sublabel */}
                <p className="text-center text-slate-400 text-xs mb-8">
                    {current.sublabel}
                </p>

                {/* Urgency Badge */}
                {/* <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium">
                        <span className="animate-pulse">●</span>
                        Prossima cohort: inizio 20 Gennaio • 4 posti rimasti
                    </div>
                </div> */}

                {/* Pricing Cards */}
                <div className={`grid gap-8 max-w-5xl mx-auto ${current.tiers.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-4xl'}`}>
                    {tiersWithHighlight.map((tier, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedTier(tier.name)}
                            className={`relative flex flex-col p-6 rounded-3xl transition-all duration-300 group cursor-pointer ${tier.isSelected
                                ? 'bg-gradient-to-br from-[#FFF9C4] via-[#FCD34D] to-[#F59E0B] border-[3px] border-[#FDE047] shadow-[0_20px_50px_-10px_rgba(251,191,36,0.5)] transform scale-105 z-10 hover:shadow-[0_25px_60px_-10px_rgba(251,191,36,0.6)]'
                                : 'bg-white/5 border-2 border-white/10 hover:border-[#FCD34D]/50 hover:bg-white/10'
                                }`}
                        >
                            {tier.isRecommended && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-[#B45309] px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-xl border-2 border-[#FDE047] whitespace-nowrap z-20 flex items-center gap-2">
                                    <span className="text-lg">✨</span> {t.recommended}
                                </div>
                            )}

                            {/* Outcome Badge */}
                            <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-4 uppercase tracking-wider ${tier.isSelected ? 'bg-white/40 text-[#713F12] border border-white/20' : 'bg-white/10 text-white/70'
                                }`}>
                                {tier.outcome || 'Outcome Garaito'}
                            </div>

                            <h3 className={`text-2xl font-bold mb-1 ${tier.isSelected ? 'text-[#451a03]' : 'text-white'}`}>{tier.name}</h3>
                            <p className={`text-xs mb-4 ${tier.isSelected ? 'text-[#78350F]' : 'text-slate-400'}`}>
                                {tier.duration} • {tier.description}
                            </p>

                            <div className="mb-6">
                                <div className="space-y-2">
                                    <div className={`text-2xl font-bold ${tier.isSelected ? 'text-[#451a03]' : 'text-white'}`}>
                                        {t.priceOnRequest}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            handleOpenPriceGate(tier.name)
                                        }}
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 border text-[11px] font-black uppercase tracking-wide transition-all duration-300 hover:scale-105 ${
                                            tier.isSelected
                                                ? 'border-[#92400E]/30 bg-white/60 text-[#78350F] shadow-[0_0_0_1px_rgba(146,64,14,0.08)]'
                                                : 'border-amber-300/30 bg-gradient-to-r from-amber-400/20 to-rose-400/10 text-amber-100 shadow-[0_0_20px_-8px_rgba(251,191,36,0.55)]'
                                        }`}
                                    >
                                        <span aria-hidden>🔓</span>
                                        <span className="underline decoration-dashed underline-offset-2">{t.unlockPriceCta}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8 text-sm font-medium flex-grow">
                                {tier.features.map((f: string, j: number) => (
                                    <li key={j} className={`flex items-start gap-3 ${tier.isSelected ? 'text-[#422006]' : 'text-slate-300'}`}>
                                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.isSelected ? 'text-[#B45309] fill-white' : 'text-emerald-400'}`} />
                                        <span className="leading-snug">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            {'note' in tier && tier.note && (
                                <p className={`text-xs leading-relaxed mb-6 border-t pt-4 ${tier.isSelected ? 'border-[#713F12]/10 text-[#713F12]/80' : 'border-white/10 text-white/50'}`}>
                                    <strong>Nota:</strong> {tier.note}
                                </p>
                            )}

                            <div className="mt-auto">
                                <button
                                    onClick={() => {
                                        handleOpenPriceGate(tier.name)
                                        trackSelectItem({
                                            items: [{
                                                item_id: `${tier.name.toLowerCase().replace(/\s+/g, '_')}_price_unlock`,
                                                item_name: `${tier.name} price unlock`,
                                                item_category: current.label,
                                            }],
                                            itemListName: 'career_os_pricing',
                                            itemListId: 'pricing_table',
                                        })
                                    }}
                                    className={`block w-full py-4 rounded-xl text-center font-bold text-lg transition-all shadow-xl active:scale-95 active:shadow-sm ${tier.isSelected
                                        ? 'bg-white text-[#B45309] hover:bg-[#FFFBEB] hover:text-[#92400E] hover:shadow-2xl hover:-translate-y-0.5'
                                        : 'bg-white/10 border border-white/10 text-white hover:bg-white hover:text-indigo-950'
                                        }`}
                                >
                                    {t.unlockPriceCta} →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Guarantee + Payment */}
                <div className="mt-10 text-center space-y-2">
                    <p className="text-slate-300 text-sm">{t.guaranteeLine}</p>
                    <p className="text-slate-400 text-sm">
                        {t.paymentLine}
                    </p>
                </div>

                {/* Audit Escape Valve - Redesigned for impact */}
                <div className="mt-16 max-w-2xl mx-auto">
                    <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden group">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 -transtale-y-1/2 translate-x-1/2 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 transtale-y-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h4 className="text-xl font-bold text-white mb-2">
                                    {t.auditCardTitle}
                                </h4>
                                <p className="text-slate-400 text-sm max-w-sm">
                                    {t.auditCardBody}
                                </p>
                            </div>

                            <button
                                onClick={openAuditModal}
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#1A1E3B] font-bold text-base hover:bg-[#FCD34D] hover:scale-105 transition-all shadow-xl hover:shadow-[#FCD34D]/20 group-hover:-rotate-1"
                            >
                                <span className="text-xl">📞</span>
                                <span>{t.auditCardCta}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isPriceGateOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4" aria-modal="true" role="dialog">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsPriceGateOpen(false)} />
                    <form
                        onSubmit={handleRevealPrice}
                        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-[#0F1117]"
                    >
                        <h3 className="text-xl font-bold text-[#1A1E3B] dark:text-white">{t.revealTitle}</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t.revealSubtitle}</p>
                        {waitlistSuccess ? (
                            <div className="mt-5 space-y-4">
                                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                    {t.revealSuccess}
                                </p>
                                {marketingConsent ? (
                                    <p className="text-xs text-slate-600 dark:text-slate-300">
                                        {t.revealMarketingConfirmHint}
                                    </p>
                                ) : null}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsPriceGateOpen(false)}
                                        className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                                    >
                                        {locale === 'en' ? 'Close' : 'Chiudi'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {priceGateTier ? (
                                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                                        {priceGateTier}
                                    </p>
                                ) : null}
                                <label className="mt-4 block text-xs font-semibold text-slate-500">{t.revealEmailLabel}</label>
                                <input
                                    type="email"
                                    value={priceGateEmail}
                                    onChange={(event) => setPriceGateEmail(event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                    required
                                />
                                <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                    <label className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            checked={acceptedPrivacy}
                                            onChange={(event) => setAcceptedPrivacy(event.target.checked)}
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 dark:border-slate-600"
                                            required
                                        />
                                        <span>
                                            {t.revealPrivacyLabelPrefix}{' '}
                                            <a href="/privacy" className="underline hover:text-amber-500" target="_blank" rel="noopener noreferrer">{t.revealPrivacyPolicy}</a>{' '}
                                            {locale === 'en' ? 'and the' : 'e i'}{' '}
                                            <a href="/terms" className="underline hover:text-amber-500" target="_blank" rel="noopener noreferrer">{t.revealTerms}</a>.
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={(event) => setAcceptedTerms(event.target.checked)}
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 dark:border-slate-600"
                                            required
                                        />
                                        <span>
                                            {t.revealTermsConsentLabel}{' '}
                                            <a href="/terms" className="underline hover:text-amber-500" target="_blank" rel="noopener noreferrer">{t.revealTerms}</a>.
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            checked={marketingConsent}
                                            onChange={(event) => setMarketingConsent(event.target.checked)}
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 dark:border-slate-600"
                                        />
                                        <span>{t.revealMarketingLabel}</span>
                                    </label>
                                    <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] leading-5 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        {t.revealComplianceNotice}
                                    </p>
                                </div>
                                {priceGateError ? (
                                    <p className="mt-2 text-xs text-red-500">{priceGateError}</p>
                                ) : null}
                                <div className="mt-5 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsPriceGateOpen(false)}
                                        className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        disabled={isSubmittingWaitlist}
                                    >
                                        {locale === 'en' ? 'Cancel' : 'Annulla'}
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        disabled={isSubmittingWaitlist}
                                    >
                                        {isSubmittingWaitlist ? (locale === 'en' ? 'Sending...' : 'Invio...') : t.revealButton}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            )}
        </section>
    )
}
