import { Metadata } from 'next'
import PromoCodeGate from './components/PromoCodeGate'

// =============================================================================
// Metadata
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com'

export const metadata: Metadata = {
    title: 'Role Fit Audit | Scopri il tuo ruolo GenAI ideale | stAItuned',
    description:
        'PwC 2025: le skill AI specializzate valgono un +56% di salario. Fai l\'audit (5 min) per scoprire il tuo ranking e colmare i gap tecnici.',
    keywords: [
        'Role Fit Audit',
        'test carriera AI',
        'profilo GenAI',
        'assessment AI Italia',
        'carriera intelligenza artificiale',
        'ruolo AI',
        'GenAI Engineer Italia',
        'cv AI',
        'lavoro AI Italia',
    ],
    openGraph: {
        type: 'website',
        locale: 'it_IT',
        url: `${SITE_URL}/role-fit-audit`,
        siteName: 'stAItuned',
        title: 'Role Fit Audit | Scopri il tuo ruolo GenAI ideale',
        description:
            'PwC 2025: +56% di salario per skill AI specializzate. Scopri il tuo ranking e colma i gap in 5 minuti.',
        images: [
            {
                url: '/assets/role-fit-audit/role-fit-audit-logo.png',
                width: 1200,
                height: 630,
                alt: 'Role Fit Audit - Scopri il tuo ruolo GenAI ideale',
            },
        ],
    },
    alternates: {
        canonical: `${SITE_URL}/role-fit-audit`,
    },
    robots: {
        index: true,
        follow: true,
    },
}

// =============================================================================
// Page Component
// =============================================================================

import { CareerOSProvider } from '../career-os/context/CareerOSContext'
import AuditModal from '../career-os/components/modals/AuditModal'
import { Suspense } from 'react'
import AuditLoading from './components/AuditLoading'

import { RoleFitHowItWorks } from './_components/RoleFitHowItWorks'
import { RoleFitMiniFAQ } from './_components/RoleFitMiniFAQ'
import { MarketEvidence } from './_components/MarketEvidence'

export default function RoleFitAuditPage() {
    return (
        <CareerOSProvider>
            <main className="min-h-screen bg-slate-50 dark:bg-[#0F1117]">
                {/* Hero Header - Enhanced Visual Design */}
                <section className="relative text-white pt-24 md:pt-28 pb-16 md:pb-20 overflow-hidden">
                    {/* ... (existing content) */}
                    {/* Background Layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

                    {/* Glow Orbs */}
                    <div className="absolute top-1/3 left-1/6 w-72 h-72 bg-red-500/15 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-[#FFF272]/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 right-1/6 w-40 h-40 bg-[#F59E0B]/15 rounded-full blur-2xl" />

                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        {/* Pre-headline Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                            <span className="text-sm font-semibold text-red-300">
                                Il tuo CV sembra uguale a tutti gli altri
                            </span>
                        </div>

                        {/* Pain Headline */}
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                            Il tuo profilo GenAI è{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">troppo generico</span>{' '}
                            per essere scelto.
                        </h1>

                        {/* Solution Promise */}
                        <p className="text-lg md:text-xl text-slate-300 mx-auto mb-8" style={{ maxWidth: '45rem' }}>
                            Non è solo una tua impressione: il mercato è diventato <strong className="text-white">iperselettivo</strong>.
                            <br className="hidden md:block" />
                            Smetti di essere generico.
                            <br></br> Scopri il tuo <strong className="text-white">Vero Ranking</strong> e ottieni il piano per colmare i gap.
                        </p>

                        {/* Market Evidence "Triangle of Truth" */}
                        <MarketEvidence />

                        {/* CTA */}
                        <div className="flex justify-center mb-10">
                            <a
                                href="#start-audit"
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-red-400 hover:to-rose-500 active:scale-95 ring-4 ring-red-500/20"
                            >
                                Qual è il mio fit GenAI? →
                            </a>
                        </div>

                        {/* Trust Signals - aligned with CTA promise */}
                        <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 border-t border-slate-700/50 pt-6 max-w-2xl mx-auto">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <span>🎯</span> Score da 0-100
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <span>�</span> Gap chiari
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <span>�</span> Piano 7 giorni
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <span>⏱</span> Solo 5 min
                            </span>
                        </div>
                    </div>
                </section>

                <RoleFitHowItWorks />

                {/* Main Content with Promo Code Gate */}
                <section id="start-audit" className="py-12 md:py-16 px-4">
                    <Suspense fallback={<AuditLoading />}>
                        <PromoCodeGate />
                    </Suspense>
                    <RoleFitMiniFAQ />
                </section>            </main>
            <AuditModal />
        </CareerOSProvider>
    )
}
