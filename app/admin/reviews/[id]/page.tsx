'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { useAuth } from '@/components/auth/AuthContext'
import { Contribution } from '@/lib/types/contributor'

/**
 * Admin draft review detail page.
 */
export default function AdminReviewDetailPage() {
  return (
    <AdminGuard>
      <AdminReviewDetailContent />
    </AdminGuard>
  )
}

function AdminReviewDetailContent() {
  const { user } = useAuth()
  const params = useParams()
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : ''
  const [contribution, setContribution] = useState<Contribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)
  const [inlineNote, setInlineNote] = useState('')
  const [annotationLoading, setAnnotationLoading] = useState(false)
  const [annotationError, setAnnotationError] = useState<string | null>(null)
  const draftRef = useRef<HTMLPreElement>(null)

  const annotations = contribution?.review?.annotations ?? []

  const highlightedDraft = useMemo(() => {
    const text = contribution?.draftContent || ''
    if (!text || annotations.length === 0) return [{ text, highlight: false, note: '' }]

    const ranges = [...annotations]
      .filter(a => a.end > a.start)
      .sort((a, b) => a.start - b.start)

    const segments: { text: string; highlight: boolean; note: string }[] = []
    let cursor = 0

    for (const range of ranges) {
      const safeStart = Math.max(0, Math.min(text.length, range.start))
      const safeEnd = Math.max(0, Math.min(text.length, range.end))
      if (safeEnd <= cursor) continue
      if (safeStart > cursor) {
        segments.push({ text: text.slice(cursor, safeStart), highlight: false, note: '' })
      }
      segments.push({ text: text.slice(safeStart, safeEnd), highlight: true, note: range.note })
      cursor = safeEnd
    }

    if (cursor < text.length) {
      segments.push({ text: text.slice(cursor), highlight: false, note: '' })
    }

    return segments
  }, [contribution?.draftContent, annotations])

  const resolveSelectionRange = () => {
    const selection = window.getSelection()
    const container = draftRef.current
    if (!selection || selection.rangeCount === 0 || !container) return null
    const range = selection.getRangeAt(0)
    if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) return null

    const startRange = range.cloneRange()
    startRange.selectNodeContents(container)
    startRange.setEnd(range.startContainer, range.startOffset)
    const start = startRange.toString().length

    const endRange = range.cloneRange()
    endRange.selectNodeContents(container)
    endRange.setEnd(range.endContainer, range.endOffset)
    const end = endRange.toString().length

    if (end <= start) return null
    return { start, end }
  }

  const onDraftMouseUp = () => {
    const range = resolveSelectionRange()
    setSelectionRange(range)
    if (!range) {
      setInlineNote('')
      setAnnotationError(null)
    }
  }

  const addAnnotation = async () => {
    if (!user || !selectionRange || !inlineNote.trim() || !contribution) return
    setAnnotationLoading(true)
    setAnnotationError(null)
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/admin/review-annotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: contribution.id,
          start: selectionRange.start,
          end: selectionRange.end,
          note: inlineNote.trim(),
        }),
      })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to add annotation')
      }
      setContribution((prev) =>
        prev
          ? {
              ...prev,
              review: {
                ...(prev.review || {
                  status: 'changes_requested',
                  updatedAt: new Date().toISOString(),
                  reviewerEmail: user.email || 'admin',
                }),
                annotations: json.annotations,
              },
            }
          : prev
      )
      setInlineNote('')
      setSelectionRange(null)
      window.getSelection()?.removeAllRanges()
    } catch (err) {
      setAnnotationError(err instanceof Error ? err.message : 'Failed to add annotation')
    } finally {
      setAnnotationLoading(false)
    }
  }

  const applyAction = async (action: 'approve' | 'reject' | 'changes') => {
    if (!user || !contribution) return
    setActionLoading(true)
    setActionError(null)
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/admin/review-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: contribution.id, action, note }),
      })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to apply review action')
      }
      setContribution((prev) =>
        prev
          ? {
              ...prev,
              status: json.status || prev.status,
              currentStep: json.currentStep || prev.currentStep,
              review: json.review || prev.review,
            }
          : prev
      )
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to apply review action')
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    const fetchContribution = async () => {
      if (!user || !id) return
      setLoading(true)
      setError(null)

      try {
        const token = await user.getIdToken()
        const response = await fetch(`/api/admin/contribution?id=${encodeURIComponent(id)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await response.json()
        if (!response.ok || !json.success) {
          throw new Error(json.error || 'Failed to load contribution')
        }
        const next = json.contribution as Contribution
        setContribution(next)
        setNote(next.review?.note ?? '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contribution')
      } finally {
        setLoading(false)
      }
    }

    void fetchContribution()
  }, [user, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 pt-32 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!contribution) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {contribution.brief?.topic || 'Untitled Draft'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {contribution.contributorEmail} • {contribution.status}
            </p>
          </div>
          <Link
            href="/admin/reviews"
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            Back to queue
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-600 dark:text-slate-300">
            <div><span className="font-semibold text-slate-900 dark:text-white">Path:</span> {contribution.path}</div>
            <div><span className="font-semibold text-slate-900 dark:text-white">Format:</span> {contribution.brief?.format}</div>
            <div><span className="font-semibold text-slate-900 dark:text-white">Target:</span> {contribution.brief?.target}</div>
            <div><span className="font-semibold text-slate-900 dark:text-white">Updated:</span> {contribution.updatedAt ? new Date(contribution.updatedAt).toLocaleString() : 'N/A'}</div>
            <div><span className="font-semibold text-slate-900 dark:text-white">Status:</span> {contribution.status}</div>
            <div><span className="font-semibold text-slate-900 dark:text-white">Review:</span> {contribution.review?.status || 'pending'}</div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Review note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Scrivi note o richieste di modifica..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {actionError && (
              <div className="text-sm text-red-600 dark:text-red-400">{actionError}</div>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => applyAction('approve')}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
              >
                Approva
              </button>
              <button
                onClick={() => applyAction('changes')}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 disabled:opacity-50"
              >
                Proponi modifiche
              </button>
              <button
                onClick={() => applyAction('reject')}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-500 disabled:opacity-50"
              >
                Rifiuta
              </button>
            </div>
          </div>

          {contribution.draftContent ? (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <pre
                  ref={draftRef}
                  onMouseUp={onDraftMouseUp}
                  className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200 font-mono"
                >
                  {highlightedDraft.map((segment, idx) =>
                    segment.highlight ? (
                      <mark
                        key={idx}
                        className="bg-amber-200/70 dark:bg-amber-400/30 rounded px-0.5"
                        title={segment.note}
                      >
                        {segment.text}
                      </mark>
                    ) : (
                      <span key={idx}>{segment.text}</span>
                    )
                  )}
                </pre>
              </div>

              {selectionRange ? (
                <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 p-4 space-y-3">
                  <div className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                    Nota sulla selezione
                  </div>
                  <textarea
                    value={inlineNote}
                    onChange={(e) => setInlineNote(e.target.value)}
                    rows={3}
                    placeholder="Scrivi la nota per il testo selezionato..."
                    className="w-full rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-slate-900/30 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {annotationError && (
                    <div className="text-sm text-red-600 dark:text-red-400">{annotationError}</div>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={addAnnotation}
                      disabled={annotationLoading || !inlineNote.trim()}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 disabled:opacity-50"
                    >
                      Salva nota
                    </button>
                    <button
                      onClick={() => {
                        setSelectionRange(null)
                        setInlineNote('')
                        window.getSelection()?.removeAllRanges()
                      }}
                      className="text-sm text-amber-700 dark:text-amber-200 hover:underline"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              ) : null}

              {annotations.length > 0 ? (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/30 p-4 space-y-3">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Note inline</div>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {annotations.map((ann, idx) => (
                      <li key={`${ann.start}-${ann.end}-${idx}`} className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400">
                          {ann.authorEmail} • {new Date(ann.createdAt).toLocaleString()}
                        </span>
                        <span className="line-clamp-2">“{(contribution.draftContent || '').slice(ann.start, ann.end)}”</span>
                        <span className="text-amber-700 dark:text-amber-200">{ann.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400">No draft content available.</div>
          )}
        </div>
      </div>
    </div>
  )
}
