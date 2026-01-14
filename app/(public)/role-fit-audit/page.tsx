import { Metadata } from 'next'
import RoleFitAuditForm from './components/RoleFitAuditForm'

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
    title: 'Role Fit Audit | Scopri il tuo profilo GenAI | stAItuned',
    description:
        'Scopri in 5 minuti quale ruolo GenAI è più adatto a te. Valuta le tue skill su Code, Data, Product e GenAI Systems, e ottieni un piano d\'azione personalizzato.',
    openGraph: {
        title: 'Role Fit Audit | Scopri il tuo profilo GenAI',
        description:
            'Scopri in 5 minuti quale ruolo GenAI è più adatto a te. Valuta le tue skill e ottieni un piano d\'azione.',
        type: 'website',
    },
}

// =============================================================================
// Page Component
// =============================================================================

export default function RoleFitAuditPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F1117]">
            {/* Hero Header */}
            <section className="bg-gradient-to-b from-[#1A1E3B] to-[#2A3050] text-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF272]/20 px-4 py-1 text-sm font-medium text-[#FFF272] mb-6">
                        🎯 Lead Magnet Gratuito
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6">
                        Role Fit Audit
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                        Scopri in <strong className="text-white">5 minuti</strong> quale ruolo GenAI è più adatto al tuo profilo.
                        Ottieni uno score su 4 dimensioni, il tuo archetipo, e un piano d'azione personalizzato.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-2">
                            <span className="text-[#FFF272]">⏱</span> 5 minuti
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-[#FFF272]">📊</span> 20 domande
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-[#FFF272]">🎯</span> Report immediato
                        </span>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-12 md:py-20 px-4">
                <RoleFitAuditForm />
            </section>
        </main>
    )
}
