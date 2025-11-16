
"use client"

import Link from 'next/link'
import { useState } from 'react'
import { ContactCtaWithModal } from '../../app/(public)/aziende/ContactCtaWithModal'

export function HomeNextStep() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <section className="max-w-6xl mx-auto my-14 px-4 sm:my-16">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Next step</p>
          <h3 className="mt-3 text-3xl font-semibold">
            Vuoi portare queste idee nella tua azienda?
          </h3>
          <p className="mt-3 text-slate-200">
            Se leggendo questi articoli hai pensato “qui potremmo usarla anche noi”, possiamo parlarne in una mini-call di 30 minuti e disegnare un esperimento concreto.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/aziende"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              Scopri come lavoro con le PMI
            </Link>
            <button
              type="button"
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
              onClick={() => setIsOpen(true)}
            >
              Prenota una mini-call gratuita
            </button>
          </div>
        </div>
      </section>
      <ContactCtaWithModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
