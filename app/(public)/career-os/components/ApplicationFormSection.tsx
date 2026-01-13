'use client'

import { useCareerOS } from '../context/CareerOSContext'

export default function ApplicationFormSection() {
    const { openAppModal } = useCareerOS()

    return (
        <section className="py-24 bg-white dark:bg-[#0F1117]" id="candidati">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF272]/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#1A1E3B]">
                            Application
                        </span>
                        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#1A1E3B] dark:text-white">
                            Candidati a Career OS in 2 minuti
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                            Bastano poche info per capire se il percorso fa per te. Se c’è fit, ti
                            proponiamo la call di audit.
                        </p>
                        <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="text-[#F59E0B]">●</span>
                                4 step essenziali, zero frizioni
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#F59E0B]">●</span>
                                Nessun pitch aggressivo, solo fit reale
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#F59E0B]">●</span>
                                Risposta personale entro 48h
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => openAppModal({ source: 'footer_form' })}
                            className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] px-8 py-4 text-base font-bold text-[#1A1E3B] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            Inizia Application →
                        </button>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-[#151925]">
                        <h3 className="text-lg font-bold text-[#1A1E3B] dark:text-white">Cosa ti chiediamo</h3>
                        <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0F1117]">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 1</p>
                                <p className="mt-1 font-medium text-[#1A1E3B] dark:text-white">Chi sei</p>
                                <p className="mt-1 text-xs">Nome, email, background.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0F1117]">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 2</p>
                                <p className="mt-1 font-medium text-[#1A1E3B] dark:text-white">Obiettivo</p>
                                <p className="mt-1 text-xs">Ruolo target e timeline.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0F1117]">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 3</p>
                                <p className="mt-1 font-medium text-[#1A1E3B] dark:text-white">Situazione</p>
                                <p className="mt-1 text-xs">Blocco principale e candidature.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0F1117]">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 4</p>
                                <p className="mt-1 font-medium text-[#1A1E3B] dark:text-white">Contatto</p>
                                <p className="mt-1 text-xs">LinkedIn e note opzionali.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
