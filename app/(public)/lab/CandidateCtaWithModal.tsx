"use client"

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export function CandidateCtaWithModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = (formData.get('name') as string) || ''
    const email = (formData.get('email') as string) || ''
    const github = (formData.get('github') as string) || ''
    const experience = (formData.get('experience') as string) || ''
    const hours = (formData.get('hours') as string) || ''
    const message = (formData.get('message') as string) || ''
    const website = (formData.get('website') as string) || '' // honeypot
    const consent = (formData.get('consent') as string) === 'on'
    const marketingConsent = (formData.get('marketingConsent') as string) === 'on'

    if (!consent) {
      alert('Per procedere è necessario acconsentire al trattamento dei dati.')
      return
    }

    setIsSending(true)

    let ok = false
    try {
      const res = await fetch('/api/lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          github,
          experience,
          hours,
          message,
          website,
          consent,
          marketingConsent,
          page: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      })

      ok = res.ok
      if (!ok) {
        const text = await res.text().catch(() => '')
        console.error('Lab submit failed:', res.status, text)
      }
    } catch (err) {
      console.error('Lab submit failed:', err)
    } finally {
      setIsSending(false)
    }

    if (ok) {
      alert('Candidatura inviata — ti contatteremo via email se c\'è interesse.')
    } else {
      alert('Si è verificato un problema nell\'invio della candidatura. Riprova più tardi.')
    }

    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-purple-700 font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:scale-105"
      >
        <span>Candidati al Lab</span>
        <span>→</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Candidati al Lab</h3>
                <p className="mt-2 text-sm text-slate-500">Raccontaci la tua esperienza e quanto tempo puoi dedicare. Ti risponderemo se c\'è interesse.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Chiudi la finestra di candidatura"
              >
                <span className="block h-5 w-5">✕</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input type="hidden" name="website" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-slate-400">Nome e cognome</label>
                  <input id="name" name="name" type="text" required className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-amber-300/50" />
                </div>
                <div>
                  <label htmlFor="github" className="text-xs font-medium uppercase tracking-wide text-slate-400">GitHub / profilo</label>
                  <input id="github" name="github" type="text" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-amber-300/50" placeholder="https://github.com/tuoutente" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-slate-400">Email di contatto</label>
                  <input id="email" name="email" type="email" required className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-amber-300/50" />
                </div>
                <div>
                  <label htmlFor="hours" className="text-xs font-medium uppercase tracking-wide text-slate-400">Ore a settimana</label>
                  <input id="hours" name="hours" type="text" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-amber-300/50" placeholder="Es. 5-10" />
                </div>
              </div>

              <div>
                <label htmlFor="experience" className="text-xs font-medium uppercase tracking-wide text-slate-400">Breve esperienza tecnica</label>
                <input id="experience" name="experience" type="text" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-amber-300/50" placeholder="Es. Python, ML, data engineering" />
              </div>

              <div>
                <label htmlFor="message" className="text-xs font-medium uppercase tracking-wide text-slate-400">Perché vuoi entrare nel Lab?</label>
                <textarea id="message" name="message" rows={4} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-amber-300/50" placeholder="Raccontaci cosa vuoi imparare o cosa vorresti costruire." />
              </div>

              <div className="mt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <input id="consent" name="consent" type="checkbox" className="mt-1 h-4 w-4 rounded" />
                  <label htmlFor="consent" className="text-xs text-slate-400">Acconsento al trattamento dei dati secondo la <Link className="text-amber-500 underline" href="/privacy">privacy policy</Link>.</label>
                </div>
                <div className="flex items-start gap-3">
                  <input id="marketingConsent" name="marketingConsent" type="checkbox" className="mt-1 h-4 w-4 rounded" />
                  <label htmlFor="marketingConsent" className="text-xs text-slate-400">Desidero ricevere aggiornamenti e inviti (marketing).</label>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button type="button" onClick={() => setIsOpen(false)} className="rounded-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">Annulla</button>
                  <button type="submit" disabled={isSending} className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-slate-900/30 transition hover:bg-slate-800 disabled:opacity-60">{isSending ? 'Invio...' : 'Invia candidatura'}</button>
                </div>
              </div>
            </form>
            <p className="mt-4 text-xs text-slate-500">Consulta la <Link className="text-amber-500 underline" href="/privacy">privacy policy</Link> per capire come utilizziamo le informazioni.</p>
          </div>
        </div>
      )}
    </>
  )
}
