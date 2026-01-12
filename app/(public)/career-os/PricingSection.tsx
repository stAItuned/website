'use client'

import { useCareerOS } from './context/CareerOSContext'

type PricingMode = 'classe' | '1to1'

const pricingData = {
    classe: {
        label: 'Classe',
        sublabel: '8-10 persone • Prossima classe al raggiungimento',
        tiers: [
            {
                name: 'Starter',
                duration: '4 settimane',
                description: 'Candidabile + Proof-lite',
                price: 299,
                originalPrice: 450,
                features: [
                    'Role-Fit Audit completo',
                    'CV + LinkedIn ottimizzati',
                    '3 JD pack (tailoring + cover)',
                    '1 Articolo su stAItuned (con QA)',
                ],
                popular: false,
            },
            {
                name: 'Pro',
                duration: '8 settimane',
                description: 'Proof seria + Interview',
                price: 599,
                originalPrice: 890,
                features: [
                    'Tutto in Starter',
                    '10 JD pack',
                    'Progetto GenAI standard (demo+repo+eval)',
                    '1 Mock Interview con Senior AI',
                    'Job Targeting Kit (20-40 aziende)',
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
                duration: '4 settimane',
                description: 'Candidabile + Proof-lite',
                price: 590,
                originalPrice: 790,
                features: [
                    'Role-Fit Audit completo',
                    'CV + LinkedIn ottimizzati',
                    '3 JD pack (tailoring + cover)',
                    '1 Articolo su stAItuned (con QA)',
                    'Sessioni 1:1 dedicate',
                ],
                popular: false,
            },
            {
                name: 'Pro',
                duration: '8 settimane',
                description: 'Proof seria + Interview',
                price: 1190,
                originalPrice: 1490,
                features: [
                    'Tutto in Starter',
                    '10 JD pack',
                    'Progetto GenAI standard (demo+repo+eval)',
                    '2 Mock Interview con Senior AI',
                    'Job Targeting Kit (20-40 aziende)',
                    'Supporto prioritario async',
                ],
                popular: true,
            },
            {
                name: 'Elite',
                duration: '8 settimane + 12 mesi',
                description: 'Supporto fino all\'offerta (cap)',
                price: 1990,
                originalPrice: 2490,
                features: [
                    'Tutto in Pro',
                    'Tool Career OS per 12 mesi',
                    '1 call/mese (45 min) per 12 mesi',
                    '2 review prioritarie/mese (asset)',
                    'Supporto async con SLA 72h',
                    '+1 mock interview (totale 2)',
                ],
                popular: false,
                note: 'Posti limitati (max 8 attivi). Nessuna "job guarantee".',
            },
        ],
    },
}

export default function PricingSection() {
    const { mode, setMode, objective } = useCareerOS()
    const current = pricingData[mode]

    // Determine which plan to highlight based on objective
    // If objective is 'start', highlight Starter.
    // If objective is 'pro', highlight Pro (or Elite, but Pro is safer default).
    // If null, keep default 'popular' flag from data.
    const tiersWithHighlight = current.tiers.map(tier => {
        if (!objective) return tier

        let isPopular = tier.popular

        if (objective === 'start') {
            isPopular = tier.name === 'Starter'
        } else if (objective === 'pro') {
            // For Pro objective, we highlight Pro. 
            // If they are in 1to1, Elite is also an option but Pro is the direct match.
            isPopular = tier.name === 'Pro'
        }

        return {
            ...tier,
            popular: isPopular
        }
    })

    return (
        <section id="pricing" className="py-24 bg-[#1A1E3B] text-white">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                    Investi nel tuo <span className="text-[#FFF272]">ROI</span>
                </h2>

                {/* Bootcamp Comparison */}
                <div className="max-w-3xl mx-auto mb-10">
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20 mb-4">
                        <p className="text-center text-base text-rose-300 font-medium">
                            ❌ Bootcamp tradizionali: <strong className="text-white">€4.000+</strong> • <strong className="text-white">6 mesi</strong> • ore di video
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                        <p className="text-center text-base text-emerald-300 font-medium">
                            ✅ Career OS: da <strong className="text-white">€299</strong> • <strong className="text-white">4-8 settimane</strong> • proof concreta
                        </p>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-xl text-slate-200 font-medium">
                            Non vendiamo ore. Vendiamo <span className="text-[#FFF272] font-bold">OUTCOME</span>:
                            <br />
                            <span className="text-white font-bold">CV, Proof Pubblica, Interview Readiness.</span>
                        </p>
                    </div>
                </div>

                {/* Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex rounded-full bg-white/10 p-1">
                        <button
                            onClick={() => setMode('1to1')}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${mode === '1to1'
                                ? 'bg-[#FFF272] text-[#1A1E3B]'
                                : 'text-white/70 hover:text-white'
                                }`}
                        >
                            👤 1:1 Premium
                        </button>
                        <button
                            onClick={() => setMode('classe')}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${mode === 'classe'
                                ? 'bg-[#FFF272] text-[#1A1E3B]'
                                : 'text-white/70 hover:text-white'
                                }`}
                        >
                            🎓 Classe (Cohort)
                        </button>
                    </div>
                </div>

                {/* Sublabel */}
                <p className="text-center text-slate-400 text-sm mb-6">
                    {current.sublabel}
                </p>

                {/* Urgency Badge */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium">
                        <span className="animate-pulse">●</span>
                        Prossima cohort: inizio 20 Gennaio • 4 posti rimasti
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className={`grid gap-8 max-w-5xl mx-auto ${current.tiers.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-4xl'}`}>
                    {tiersWithHighlight.map((tier, i) => (
                        <div
                            key={i}
                            className={`relative p-8 rounded-3xl transition-all ${tier.popular
                                ? 'bg-gradient-to-b from-[#383F74] to-[#1A1E3B] border-2 border-[#FFF272] shadow-[0_0_30px_rgba(255,242,114,0.15)] transform scale-105 z-10'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFF272] text-[#1A1E3B] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
                                    {objective ? 'Selezionato per te' : 'Consigliato'}
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                            <p className="text-slate-400 text-sm mb-4">
                                {tier.duration} • {tier.description}
                            </p>
                            <div className="mb-6">
                                <span className="text-sm line-through text-slate-500">
                                    €{tier.originalPrice}
                                </span>
                                <div className="text-4xl font-bold">
                                    €{tier.price}{' '}
                                    <span className="text-lg font-normal text-[#FFF272]">Beta</span>
                                </div>
                            </div>
                            <ul className={`space-y-3 mb-6 text-sm ${tier.popular ? 'text-white font-medium' : 'text-slate-300'}`}>
                                {tier.features.map((f, j) => (
                                    <li key={j}>✓ {f}</li>
                                ))}
                            </ul>
                            {'note' in tier && tier.note && (
                                <p className="text-xs text-white/50 leading-relaxed mb-6 border-t border-white/10 pt-4">
                                    <strong>Nota:</strong> {tier.note}
                                </p>
                            )}
                            <a
                                href="#candidati"
                                className={`block w-full py-3 rounded-xl text-center font-semibold transition-all ${tier.popular
                                    ? 'bg-[#FFF272] text-[#1A1E3B] hover:bg-[#F59E0B] shadow-lg'
                                    : 'border border-white/20 hover:bg-white hover:text-[#1A1E3B]'
                                    }`}
                            >
                                Candidati Ora →
                            </a>
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

                {/* Audit Escape Valve - for users with questions */}
                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm mb-3">
                        Hai dubbi? Parliamone.
                    </p>
                    <a
                        href="/audit"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/80 font-medium hover:bg-white/5 hover:text-white transition-all"
                    >
                        📞 Prenota Audit gratuito (15 min)
                    </a>
                </div>
            </div>
        </section>
    )
}
