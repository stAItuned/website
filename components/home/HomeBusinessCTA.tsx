/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ContactCtaWithModal } from '@/app/(public)/aziende/ContactCtaWithModal'

export function HomeBusinessCTA() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <section className="max-w-6xl mx-auto my-24 px-4">
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-900/60 dark:border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 sm:p-12 text-white shadow-xl">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
          </div>
          <div className="relative space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200 shadow-sm">
              Porta queste idee nella tua azienda
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Porta queste idee dentro alla tua azienda
            </h2>
            <p className="text-base md:text-lg text-slate-200/90 leading-relaxed max-w-4xl">
              Una mini-call per capire se un prototipo di AI ha senso nel tuo contesto, senza impegno e senza slide infinite.
            </p>
            <p className="text-sm md:text-base text-slate-200/80 leading-relaxed max-w-4xl">
              Se leggendo il sito ti è venuta in mente una situazione concreta – un processo lento, dati che non usi mai, clienti poco ingaggiati – possiamo guardarli insieme. In 30 minuti esploriamo il contesto, ragioniamo su 1–2 possibili casi d’uso di AI e ti aiuto a capire se un prototipo può avere davvero impatto oppure no.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'ci racconti brevemente azienda, team e processo che ti crea più attrito',
                'facciamo 2–3 ipotesi di casi d’uso AI realistici (niente “AI ovunque”, solo dove ha senso)',
                'ti propongo uno schema di esperimento (prototipo, dati richiesti, metriche base)',
                'se alla fine non ha senso fare nulla, lo diciamo chiaramente e ti rimangono comunque le idee'
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-2 rounded-2xl border border-white/20 bg-white/5 p-3 text-sm text-slate-100 shadow-sm backdrop-blur-sm"
                >
                  <span className="text-amber-300 mt-0.5">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-200/80">
              Nessun funnel nascosto: l’obiettivo è aiutarti a prendere una decisione lucida se partire con un prototipo oppure no.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-[13px] font-semibold text-slate-900 shadow-md transition hover:-translate-y-[1px] hover:shadow-lg"
              >
                Prenota una mini-call di 30 minuti ↗
              </button>
              <Link
                href="mailto:info@staituned.com?subject=Contatto%20per%20mini-call%20AI"
                className="text-sm font-semibold text-amber-200 hover:text-white"
              >
                Preferisci prima scrivermi due righe? Contattami via email →
              </Link>
            </div>
          </div>
        </div>
      </section>
      <ContactCtaWithModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
