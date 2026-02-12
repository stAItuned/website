'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthContext'
import { useLearnLocale } from '@/lib/i18n'
import { writerProfileFieldsSchema } from '@/lib/validation/writerProfile'
import { getWriterProfileErrorMessage } from '@/lib/validation/writerProfileMessages'

export interface BecomeWriterSuccessPayload {
    slug: string
    profilePath: string
    writerActivatedAt?: string
}

interface BecomeWriterFormProps {
    onSuccess: (payload: BecomeWriterSuccessPayload) => void | Promise<void>
    submitLabel?: string
}

/**
 * Collects the minimum public author profile info to enable drafting articles.
 */
export function BecomeWriterForm({ onSuccess, submitLabel }: BecomeWriterFormProps) {
    const { user, loading: authLoading } = useAuth()
    const { locale } = useLearnLocale()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    // Form fields
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        title: '',
        bio: '',
        linkedin: '',
        website: '',
        consent: false
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Create object URL for preview
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        if (!user) {
            setError('Devi essere loggato per creare un profilo writer.')
            setIsLoading(false)
            return
        }

        try {
            const validation = writerProfileFieldsSchema.safeParse({
                ...formData,
                consent: formData.consent,
                linkedin: formData.linkedin || '',
                website: formData.website || '',
            })
            if (!validation.success) {
                const first = validation.error.issues[0]
                const message = getWriterProfileErrorMessage(locale === 'en' ? 'en' : 'it', first)
                throw new Error(message)
            }

            const formDataToSend = new FormData()
            formDataToSend.append('name', formData.name)
            formDataToSend.append('surname', formData.surname)
            formDataToSend.append('title', formData.title)
            formDataToSend.append('bio', formData.bio)
            formDataToSend.append('linkedin', formData.linkedin)
            formDataToSend.append('website', formData.website)
            formDataToSend.append('consent', String(formData.consent))

            const file = fileInputRef.current?.files?.[0]
            if (file) {
                formDataToSend.append('image', file)
            }

            const token = await user?.getIdToken()
            const response = await fetch('/api/user/writer-profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create profile')
            }

            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('writer-status-changed'))
            }

            const profile = data.profile as { slug?: string } | undefined
            const slug = typeof profile?.slug === 'string' ? profile.slug : ''
            if (!slug) {
                throw new Error('Profilo creato ma slug non disponibile')
            }

            await onSuccess({
                slug,
                profilePath: `/author/${slug}`,
                writerActivatedAt: typeof data.writerActivatedAt === 'string' ? data.writerActivatedAt : undefined,
            })
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Qualcosa è andato storto. Riprova.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">

            {/* Image Upload */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-600 shadow-lg">
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="Profile preview"
                            fill
                            className="object-cover"
                            sizes="128px"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-4xl text-slate-300">
                            👤
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/jpeg,image/png,image/webp"
                    className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100
                        dark:file:bg-primary-900/20 dark:file:text-primary-300
                    "
                />
                <p className="text-xs text-slate-500">Formato consigliato: JPG quadrato (opzionale, es. 400x400px)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-white">Nome</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-white">Cognome</label>
                    <input
                        type="text"
                        required
                        value={formData.surname}
                        onChange={e => setFormData({ ...formData, surname: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">Titolo / Ruolo</label>
                <input
                    type="text"
                    required
                    placeholder="es. Senior Data Scientist"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">Bio</label>
                <textarea
                    required
                    rows={4}
                    placeholder="Raccontaci chi sei..."
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-white">LinkedIn (opzionale)</label>
                    <input
                        type="url"
                        value={formData.linkedin}
                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-white">Sito Web (opzionale)</label>
                    <input
                        type="url"
                        value={formData.website}
                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
            </div>

            {/* Legal Consent */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        required
                        checked={formData.consent}
                        onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                        Accetto i <Link href="/terms" className="text-primary-600 underline hover:text-primary-700">Termini e Condizioni</Link> e la <Link href="/privacy" className="text-primary-600 underline hover:text-primary-700">Privacy Policy</Link>. Acconsento al trattamento dei miei dati personali per la creazione del profilo autore pubblico.
                    </span>
                </label>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isLoading || authLoading || !user}
                    className="px-8 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                            Salvataggio...
                        </>
                    ) : authLoading ? (
                        'Verifica sessione...'
                    ) : !user ? (
                        'Login richiesto'
                    ) : (
                        submitLabel || 'Crea Profilo Writer'
                    )}
                </button>
            </div>
        </form>
    )
}
