'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { useWriterStatus } from '@/components/auth/WriterStatusContext'
import { useLearnLocale } from '@/lib/i18n'
import { writerProfileFieldsSchema } from '@/lib/validation/writerProfile'
import { getWriterProfileErrorMessage } from '@/lib/validation/writerProfileMessages'
import { readApiResponse } from '@/lib/http/readApiResponse'

interface WriterProfileDto {
  slug: string
  profilePath: string
  imageUrl: string
  name: string
  surname: string
  title: string
  bio: string
  linkedin: string
  website: string
}

/**
 * Allows a logged-in writer to view and update their public writer profile.
 */
export function WriterProfileForm() {
  const { user, loading: authLoading } = useAuth()
  const { isWriter, refresh: refreshWriterStatus } = useWriterStatus()
  const { locale } = useLearnLocale()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [profile, setProfile] = useState<WriterProfileDto | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    title: '',
    bio: '',
    linkedin: '',
    website: '',
    consent: true,
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (!authLoading && !user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', '/account/writer-profile')
      }
      router.push('/signin')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const token = await user.getIdToken()
        const res = await fetch('/api/user/writer-profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const { json, rawText } = await readApiResponse<
          { success: true; profile: WriterProfileDto } | { success: false; error: string }
        >(res)

        if (!res.ok || !json?.success) {
          const fallbackError = rawText.trim() || 'Failed to load profile'
          if (json && 'error' in json && typeof json.error === 'string') {
            throw new Error(json.error)
          }
          throw new Error(fallbackError)
        }

        setProfile(json.profile)
        setFormData({
          name: json.profile.name,
          surname: json.profile.surname,
          title: json.profile.title,
          bio: json.profile.bio,
          linkedin: json.profile.linkedin,
          website: json.profile.website,
          consent: true,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (user) void load()
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    setError(null)

    if (!user) return

    const validation = writerProfileFieldsSchema.safeParse({
      ...formData,
      linkedin: formData.linkedin || '',
      website: formData.website || '',
      consent: Boolean(formData.consent),
    })
    if (!validation.success) {
      const first = validation.error.issues[0]
      setError(getWriterProfileErrorMessage(locale === 'en' ? 'en' : 'it', first))
      return
    }

    setSaving(true)
    try {
      const token = await user.getIdToken()
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('surname', formData.surname)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('bio', formData.bio)
      formDataToSend.append('linkedin', formData.linkedin)
      formDataToSend.append('website', formData.website)
      formDataToSend.append('consent', String(formData.consent))

      const file = fileInputRef.current?.files?.[0]
      if (file) formDataToSend.append('image', file)

      const res = await fetch('/api/user/writer-profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      })
      const { json, rawText } = await readApiResponse<{ success?: boolean; error?: string }>(res)
      if (!res.ok || !json?.success) {
        const fallbackError = rawText.trim() || 'Failed to update profile'
        throw new Error(json?.error || fallbackError)
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('writer-status-changed'))
      }
      await refreshWriterStatus()
      setSuccess('Profilo aggiornato con successo.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading || isWriter === null) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (isWriter === false) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 px-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Writer profile non trovato</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Prima di modificare il profilo autore devi completare l&apos;onboarding.
          </p>
          <Link href="/contribute/become-writer" className="text-primary-600 hover:underline">
            Diventa Writer →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Il tuo Writer Profile</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Modifica le info pubbliche visibili nella pagina autore.
            </p>
          </div>
          {profile?.slug ? (
            <Link
              href={`/author/${profile.slug}`}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Vedi pagina autore
            </Link>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-600 shadow-lg">
              <Image
                src={previewUrl || profile?.imageUrl || '/assets/general/logo.png'}
                alt="Profile preview"
                fill
                className="object-cover"
                sizes="128px"
              />
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
            <p className="text-xs text-slate-500">Se carichi una nuova immagine, verrà convertita in `propic.jpg` (500×500).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">Nome</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">Cognome</label>
              <input
                type="text"
                required
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-white">Titolo / Ruolo</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-white">Bio</label>
            <textarea
              required
              rows={6}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">LinkedIn (opzionale)</label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">Sito Web (opzionale)</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                Confermo che le informazioni inserite sono pubbliche e posso aggiornarle.
              </span>
            </label>
          </div>

          {error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm">
              {success}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/account/settings')}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-500 disabled:opacity-50 transition"
            >
              {saving ? 'Salvataggio...' : 'Salva modifiche'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
