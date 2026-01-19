'use client'

import { useState } from 'react'
import { useCareerOS } from './context/CareerOSContext'

type PricingMode = 'classe' | '1to1'
import { CheckCircle2 } from 'lucide-react'

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

export default function PricingSection() {
    const { mode, setMode, objective, openAppModal, openAuditModal } = useCareerOS()
    const current = pricingData[mode]

    // Selected tier state - default based on objective or 'Pro'
    const getDefaultTier = () => {
        if (objective === 'start') return 'Starter'
        return 'Pro' // Default to Pro
    }
    const [selectedTier, setSelectedTier] = useState<string>(getDefaultTier())

    // The recommended tier (for badge) - always Pro
    const recommendedTier = 'Pro'

    // Determine which plan to highlight based on selection
    const tiersWithHighlight = current.tiers.map(tier => {
        return {
            ...tier,
            isSelected: tier.name === selectedTier,
            isRecommended: tier.name === recommendedTier
        }
    })

    return (
        <section id="pricing" className="py-24 bg-[#1A1E3B] text-white">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl md:text-3xl font-bold text-center mb-6">
                    Investi nel tuo <span className="text-[#FFF272]">ROI</span>
                </h2>

                {/* Compact "ROI" Comparison */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Old Way */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                            <span className="text-rose-400 font-bold text-sm mb-1 uppercase tracking-wider">🚫 Bootcamp Tradizionali</span>
                            <p className="text-slate-300 text-sm">
                                €4.000+ • 6 mesi • <span className="underline decoration-rose-500/50">Ore di video</span>
                            </p>
                        </div>

                        {/* New Way */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-[#1A1E3B] to-[#FCD34D]/10 border border-[#FCD34D]/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#FCD34D]/5 animate-pulse" />
                            <span className="text-[#FCD34D] font-bold text-sm mb-1 uppercase tracking-wider relative z-10">✅ Career OS (Start / Pro)</span>
                            <p className="text-slate-200 text-sm relative z-10">
                                da €299 • 4-8 settimane • <span className="font-bold text-white">Solo OUTCOME</span>
                            </p>
                        </div>
                    </div>
                    {/* Tagline integrated compactly */}
                    <p className="text-center text-xs text-slate-400 mt-3">
                        Non vendiamo ore. Vendiamo <strong className="text-white">CV, Proof Pubblica, Interview Readiness.</strong>
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
                            🎓 Classe (Coming Soon)
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
                    {tiersWithHighlight.map((tier: any, i) => (
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
                                    <span className="text-lg">✨</span> Consigliato
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
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-lg font-bold line-through ml-1 ${tier.isSelected ? 'text-[#78350F]/50 decoration-[#78350F]/50' : 'text-slate-500 decoration-slate-500'}`}>
                                        €{tier.originalPrice}
                                    </span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${tier.isSelected ? 'bg-rose-500/20 text-rose-700' : 'bg-rose-500/20 text-rose-300'}`}>
                                        -{Math.round(((tier.originalPrice - tier.price) / tier.originalPrice) * 100)}%
                                    </span>
                                </div>

                                <div className={`text-4xl font-bold ${tier.isSelected ? 'text-[#451a03]' : 'text-white'}`}>
                                    €{tier.price}
                                </div>
                                <p className={`text-[10px] uppercase tracking-wide font-bold mt-1 ${tier.isSelected ? 'text-rose-700 animate-pulse' : 'text-rose-400'}`}>
                                    🔥 Scadenza: Fine Gennaio
                                </p>
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
                                        trackSelectItem({
                                            items: [{
                                                item_id: tier.name.toLowerCase().replace(/\s+/g, '_'),
                                                item_name: tier.name,
                                                price: tier.price,
                                                item_category: current.label,
                                            }],
                                            itemListName: 'career_os_pricing',
                                            itemListId: 'pricing_table'
                                        })
                                        openAppModal({
                                            source: 'pricing_card',
                                            tier: `${tier.name} (${current.label})`
                                        })
                                    }}
                                    className={`block w-full py-4 rounded-xl text-center font-bold text-lg transition-all shadow-xl active:scale-95 active:shadow-sm ${tier.isSelected
                                        ? 'bg-white text-[#B45309] hover:bg-[#FFFBEB] hover:text-[#92400E] hover:shadow-2xl hover:-translate-y-0.5'
                                        : 'bg-white/10 border border-white/10 text-white hover:bg-white hover:text-indigo-950'
                                        }`}
                                >
                                    Candidati Ora →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Guarantee + Payment */}
                <div className="mt-10 text-center space-y-2">
                    <p className="text-slate-300 text-sm">
                        🛡️ <strong>Garanzia 15 giorni:</strong> rimborso completo se richiesto entro 15 giorni dall'inizio e prima della consegna del primo deliverable.
                    </p>
                    <p className="text-slate-400 text-sm">
                        💳 Pagamento in rate disponibile • Nessun abbonamento nascosto
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
                                    Hai ancora dei dubbi? Parliamone.
                                </h4>
                                <p className="text-slate-400 text-sm max-w-sm">
                                    Prenota una video-call gratuita di 15 minuti per capire se Career OS è il percorso giusto per i tuoi obiettivi.
                                </p>
                            </div>

                            <button
                                onClick={openAuditModal}
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#1A1E3B] font-bold text-base hover:bg-[#FCD34D] hover:scale-105 transition-all shadow-xl hover:shadow-[#FCD34D]/20 group-hover:-rotate-1"
                            >
                                <span className="text-xl">📞</span>
                                <span>Prenota video-call (15 min)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
