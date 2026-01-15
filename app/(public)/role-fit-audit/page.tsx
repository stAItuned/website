import { Metadata } from 'next'
import PromoCodeGate from './components/PromoCodeGate'

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
    title: 'Role Fit Audit | Il tuo profilo GenAI è troppo generico | stAItuned',
    description:
        'Il tuo profilo GenAI è indistinguibile. Fai il Role Fit Audit (5 min): ruolo consigliato, score su 4 dimensioni, gap analysis e piano 7 giorni.',
    openGraph: {
        title: 'Role Fit Audit | Il tuo profilo GenAI è troppo generico',
        description:
            'Fai il Role Fit Audit (5 min): ruolo consigliato, score su 4 dimensioni, gap e piano 7 giorni. Gratis oggi.',
        type: 'website',
    },
}

// =============================================================================
// Page Component
// =============================================================================

import { CareerOSProvider } from '../career-os/context/CareerOSContext'
import AuditModal from '../career-os/components/modals/AuditModal'

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
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                            Fai il <strong className="text-white">Role Fit Audit</strong> (5 min):
                            ruolo consigliato + score su 4 dimensioni + gap + piano 7 giorni.
                        </p>

                        {/* Outcome Bullets */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-left max-w-2xl mx-auto mb-8">
                            <div className="flex items-start gap-3">
                                <span className="text-[#FFF272] text-lg mt-0.5">✓</span>
                                <span className="text-slate-200">
                                    <strong className="text-white">Capisci</strong> che ruolo GenAI è realistico per te ora
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-[#FFF272] text-lg mt-0.5">✓</span>
                                <span className="text-slate-200">
                                    <strong className="text-white">Sai</strong> cosa ti manca (gap chiari, non teoria)
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-[#FFF272] text-lg mt-0.5">✓</span>
                                <span className="text-slate-200">
                                    <strong className="text-white">Hai</strong> un piano pratico per i primi colloqui
                                </span>
                            </div>
                        </div>

                        {/* Trust Signals with enhanced styling */}
                        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 border-t border-slate-700/50 pt-6 max-w-xl mx-auto">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <span>⏱</span> 5 minuti
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <span>🔒</span> Nessun spam
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <span>💡</span> AI-Powered Analysis
                            </span>
                        </div>
                    </div>
                </section>

                {/* Main Content with Promo Code Gate */}
                <section className="py-12 md:py-16 px-4">
                    <PromoCodeGate />
                </section>
            </main>
            <AuditModal />
        </CareerOSProvider>
    )
}
