'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useCareerOS } from '../../context/CareerOSContext'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

import { trackAuditModalOpen, trackAuditModalAbandon, trackAuditModalSubmit, trackEvent } from '@/lib/analytics/trackEvent'

export default function AuditModal() {
    const { isAuditModalOpen, closeAuditModal } = useCareerOS()
    const [status, setStatus] = useState<FormStatus>('idle')
    const [message, setMessage] = useState('')

    // Simple form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        doubt: '',
        phone: '', // added
        acceptedPrivacy: false, // added
        availability: '', // added
        website: '' // honeypot
    })

    const [slots, setSlots] = useState<string[]>([])
    const [currentSlot, setCurrentSlot] = useState('')

    const calendlyUrl = process.env.NEXT_PUBLIC_CAREER_OS_CALENDLY_URL || ''

    // Track open
    useEffect(() => {
        if (isAuditModalOpen) {
            setStatus('idle')
            setMessage('')
            setSlots([]) // Reset slots on open
            setCurrentSlot('')
            trackAuditModalOpen(window.location.pathname)
            const saved = localStorage.getItem('careeros_audit_form')
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    setFormData(prev => ({ ...prev, ...parsed }))
                } catch (e) { }
            }
        } else {
            // Track abandon if closed without success
            if (status !== 'success' && status !== 'idle') {
                trackAuditModalAbandon('closed_modal')
            }
        }
    }, [isAuditModalOpen, status])

    if (!isAuditModalOpen) return null

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => {
            const next = { ...prev, [field]: value }
            localStorage.setItem('careeros_audit_form', JSON.stringify(next))
            return next
        })
    }

    const handleAddCurrentSlot = () => {
        if (!currentSlot) return
        const newSlots = [...slots, currentSlot]
        setSlots(newSlots)
        setCurrentSlot('') // Reset input
        // Update availability string automatically
        handleChange('availability', newSlots.map(s =>
            new Date(s).toLocaleString('it-IT', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        ).join('\n'))
    }

    const removeSlot = (idx: number) => {
        const newSlots = slots.filter((_, i) => i !== idx)
        setSlots(newSlots)
        handleChange('availability', newSlots.map(s =>
            new Date(s).toLocaleString('it-IT', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        ).join('\n'))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setStatus('loading')

        try {
            const res = await fetch('/api/career-os/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    availability: formData.availability,
                    phone: formData.phone,
                    acceptedPrivacy: formData.acceptedPrivacy,
                    source: 'audit-modal',
                    userAgent: navigator.userAgent
                })
            })

            if (!res.ok) throw new Error('Errore durante l\'invio')

            setStatus('success')
            trackAuditModalSubmit(window.location.pathname)
            trackEvent('generate_lead', {
                category: 'conversion',
                value: 20, // Estimated value
                currency: 'EUR',
                source: 'audit-modal',
                label: 'audit_call_booking'
            })
        } catch (err) {
            setStatus('error')
            setMessage('Qualcosa è andato storto. Riprova o scrivici direttamente.')
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => {
                if (status !== 'success') trackAuditModalAbandon('backdrop_click')
                closeAuditModal()
            }} />
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-[#0F1117]">

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <span className="inline-block px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                            Parliamone
                        </span>
                        <h3 className="text-xl font-bold text-[#1A1E3B] dark:text-white">
                            Hai ancora dei dubbi? Parliamone.
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Prenota una video-call gratuita di 15 minuti per capire se Career OS è il percorso giusto per i tuoi obiettivi.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            if (status !== 'success') trackAuditModalAbandon('close_button')
                            closeAuditModal()
                        }}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
                    >
                        ✕
                    </button>
                </div>

                {/* Success State */}
                {status === 'success' ? (
                    <div className="text-center py-8">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                            <span className="text-2xl">✓</span>
                        </div>
                        <h4 className="text-lg font-bold text-[#1A1E3B] dark:text-white">Richiesta ricevuta</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                            Un mentor ti contatterà a breve sulla mail indicata.
                        </p>
                        <button
                            onClick={closeAuditModal}
                            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800"
                        >
                            Chiudi
                        </button>
                    </div>
                ) : (
                    /* Form State */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Nome e Cognome</label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900"
                                value={formData.name}
                                onChange={e => handleChange('name', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900"
                                value={formData.email}
                                onChange={e => handleChange('email', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Cosa ti frena?</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900"
                                placeholder="Es: Ho poco tempo / Non so se ho il background giusto..."
                                value={formData.doubt}
                                onChange={e => handleChange('doubt', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-2">
                                Disponibilità per call (Proponi 2-3 orari)
                            </label>

                            {/* Slot List */}
                            <div className="mb-3 flex flex-wrap gap-2">
                                {slots.map((slot, idx) => (
                                    <div key={idx} className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-amber-900 border border-amber-100">
                                        <span>{new Date(slot).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short' })}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSlot(idx)}
                                            className="ml-1 text-amber-900/40 hover:text-amber-900"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Slot Control */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="datetime-local"
                                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900 text-slate-600"
                                    value={currentSlot}
                                    onChange={(e) => setCurrentSlot(e.target.value)}
                                // onClick={(e) => ...} // browser default is usually fine, or keep showPicker if needed
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCurrentSlot}
                                    disabled={!currentSlot}
                                    className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    Aggiungi
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Numero di Telefono (Opzionale)</label>
                            <input
                                type="tel"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900"
                                value={formData.phone}
                                onChange={e => handleChange('phone', e.target.value)}
                            />
                        </div>

                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                required
                                id="privacy-audit"
                                className="mt-1"
                                checked={formData.acceptedPrivacy}
                                onChange={e => setFormData(prev => ({ ...prev, acceptedPrivacy: e.target.checked }))}
                            />
                            <label htmlFor="privacy-audit" className="text-xs text-slate-500">
                                Accetto il trattamento dei dati personali come descritto nella <a href="/privacy" className="underline hover:text-amber-500" target="_blank">Privacy Policy</a> e nei <a href="/terms" className="underline hover:text-amber-500" target="_blank">Termini</a>
                            </label>
                        </div>

                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={e => handleChange('website', e.target.value)}
                            className="hidden"
                            tabIndex={-1}
                            autoComplete="off"
                        />

                        {status === 'error' && (
                            <p className="text-xs text-red-500">{message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Invio...' : 'Prenota Call'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
