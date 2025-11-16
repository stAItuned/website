"use client"

import { FormEvent, useState, Dispatch, SetStateAction } from 'react'

type ContactCtaWithModalProps = {
  isOpen?: boolean
  setIsOpen?: Dispatch<SetStateAction<boolean>>
}

export function ContactCtaWithModal({ isOpen: controlledIsOpen, setIsOpen: controlledSetIsOpen }: ContactCtaWithModalProps) {
  const [internalIsOpen, internalSetIsOpen] = useState(false)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = controlledSetIsOpen ?? internalSetIsOpen
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = (formData.get('name') as string) || ''
    const email = (formData.get('email') as string) || ''
    const company = (formData.get('company') as string) || ''
    const message = (formData.get('message') as string) || ''
    const website = (formData.get('website') as string) || '' // honeypot
    const consent = (formData.get('consent') as string) === 'on'

    // Basic client-side validation
    if (!consent) {
      // you could show a toast here; for now, simple alert
      alert('Per procedere è necessario acconsentire al trattamento dei dati.')
      return
    }

    setIsSending(true)

    try {
      // POST to our API to notify Telegram (and other integrations)
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, message, website, consent, page: window.location.pathname, userAgent: navigator.userAgent }),
      })
    } catch (err) {
      console.error('Contact submit failed:', err)
      // continue anyway to open mail client
    } finally {
      setIsSending(false)
    }

    const subject = encodeURIComponent('Richiesta call gratuita – stAItuned')
    const body = encodeURIComponent(
      `Nome: ${name}\nEmail: ${email}\nAzienda: ${company}\n\nMessaggio:\n${message}`
    )

    window.location.href = `mailto:info@staituned.com?subject=${subject}&body=${body}`
    setIsOpen(false)
  }

  return (
    <>
      {/* Optional CTA section, only render if not externally controlled */}
      {controlledIsOpen === undefined && (
        <section id="prenota-call" className="border-t border-amber-200 bg-amber-50 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Pronto a trasformare l&apos;AI in valore concreto per la tua PMI?
            </h2>
            <p className="mt-4 text-sm text-slate-600 sm:text-base">
              La call iniziale è gratuita e serve a mettere sul tavolo{' '}
              <span className="font-semibold text-amber-600">1–2 esperimenti reali</span> con una demo o MVP in circa{' '}
              <span className="font-semibold text-amber-600">2 settimane</span>.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-slate-900/30 transition hover:bg-slate-800"
              >
                Prenota la call gratuita
              </button>
            </div>
          </div>
        </section>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" aria-modal="true" role="dialog">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Prenota la call gratuita</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Lascia qualche dettaglio su di te e sulla tua PMI. Ti risponderò via email per fissare uno slot da 30 minuti.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Chiudi la finestra di contatto"
              >
                <span className="block h-5 w-5">✕</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Honeypot field (bots will fill this) */}
              <input type="hidden" name="website" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="text-xs font-medium uppercase tracking-wide text-slate-400"
                  >
                    Nome e cognome
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-amber-300/50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="text-xs font-medium uppercase tracking-wide text-slate-400"
                  >
                    Azienda / ruolo
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-amber-300/50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Email di contatto
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-amber-300/50"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Cosa vorresti esplorare nella call?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-amber-300/50"
                  placeholder="Esempio: vogliamo capire se ha senso costruire un assistente AI interno per il team commerciale..."
                />
              </div>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <input id="consent" name="consent" type="checkbox" className="h-4 w-4 rounded" />
                  <label htmlFor="consent" className="text-xs text-slate-400">
                    Acconsento al trattamento dei dati e alla privacy policy.
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-slate-900/30 transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {isSending ? 'Invio...' : 'Invia la richiesta'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
  </>
  )
}
