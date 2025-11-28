
"use client"

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { ContactCtaWithModal } from '../../app/(public)/aziende/ContactCtaWithModal'

export function HomeNextStep() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <section className="max-w-6xl mx-auto my-24 px-4">
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-900/60 dark:border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 sm:p-12 text-center text-white shadow-xl">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
          </div>
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/assets/general/logo-text.png"
              alt="stAItuned"
              width={180}
              height={45}
              className="h-10 w-auto"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-300">Next step</p>
          </div>
          <h3 className="mt-6 text-3xl md:text-4xl font-bold leading-tight">
            Porta queste idee <span className="text-amber-400">nella tua azienda</span>
          </h3>
          <p className="mt-4 text-base md:text-lg text-slate-200 leading-relaxed max-w-3xl mx-auto">
            Una mini-call per capire se un prototipo di AI ha senso nel tuo contesto, senza impegno e senza slide infinite.
          </p>
          <p className="mt-4 text-base sm:text-sm text-slate-200 leading-relaxed max-w-4xl mx-auto">
            Se leggendo il sito ti è venuta in mente una situazione concreta – un processo lento, dati che non usi mai, clienti poco ingaggiati – possiamo guardarli insieme. In 30 minuti esploriamo il contesto, ragioniamo su 1–2 possibili casi d’uso di AI e ti aiuto a capire se un prototipo può avere davvero impatto oppure no.
          </p>
          <br />
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

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/aziende"
              className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/20 hover:border-white/50 transition"
            >
              Scopri il percorso aziende
            </Link>
            <button
              type="button"
              className="group inline-flex items-center justify-center rounded-full bg-amber-400 px-7 py-3 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-amber-300"
              onClick={() => setIsOpen(true)}
            >
              <span className="mr-1">🚀</span> Prenota mini-call gratuita
            </button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs font-medium text-slate-400">
            <span className="inline-flex items-center gap-1"><span className="text-amber-300">✓</span> Nessun impegno</span>
            <span className="inline-flex items-center gap-1"><span className="text-amber-300">✓</span> Focus su metriche</span>
            <span className="inline-flex items-center gap-1"><span className="text-amber-300">✓</span> Roadmap chiara</span>
          </div>
        </div>
      </section>
      <ContactCtaWithModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
