'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { useWriterStatus } from '@/components/auth/WriterStatusContext'
import { Contribution } from '@/lib/types/contributor'
import { DraftEditorMode, htmlToMarkdown, markdownToHtml } from '@/lib/markdown/draftTransforms'
import { DraftEditorView } from './DraftEditorView'
import { createAutonomyDraft, fetchUserDraft, updateAutonomyDraft, uploadDraftImage } from './draftApi'

/**
 * Standalone draft editor for the "Autonomy" contribution path.
 */
export function DraftEditor() {
  const { user, loading: authLoading } = useAuth()
  const { isWriter, hasAgreement, loading: writerLoading } = useWriterStatus()
  const router = useRouter()
  const searchParams = useSearchParams()
  const contributionId = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contribution, setContribution] = useState<Contribution | null>(null)
  const [topic, setTopic] = useState('')
  const [content, setContent] = useState('')
  const [mode, setMode] = useState<DraftEditorMode>('visual')
  const [authToken, setAuthToken] = useState('')
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      const next = `/contribute/draft${typeof window !== 'undefined' ? window.location.search : ''}`
      router.replace(`/signin?redirect=${encodeURIComponent(next)}`)
      return
    }
    if (isWriter === false) {
      const next = `/contribute/draft${typeof window !== 'undefined' ? window.location.search : ''}`
      router.replace(`/contribute/become-writer?next=${encodeURIComponent(next)}`)
    }
  }, [authLoading, user, isWriter, router])

  useEffect(() => {
    if (!user) return
    user.getIdToken().then(setAuthToken).catch(() => setAuthToken(''))
  }, [user])

  useEffect(() => {
    const load = async () => {
      if (!user || isWriter !== true || hasAgreement !== true) return

      if (!contributionId) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const token = await user.getIdToken()
        const draft = await fetchUserDraft(token, contributionId)
        setContribution(draft)
        setTopic(draft.brief?.topic || '')
        setContent(draft.draftContent || '')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load draft')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [user, isWriter, hasAgreement, contributionId])

  const switchMode = useCallback(
    (nextMode: DraftEditorMode) => {
      if (nextMode === mode) return
      setContent((prev) => (nextMode === 'markdown' ? htmlToMarkdown(prev) : markdownToHtml(prev)))
      setMode(nextMode)
    },
    [mode]
  )

  const uploadMarkdownImage = useCallback(
    async (file: File) => {
      if (!authToken) throw new Error('Missing auth token')
      const url = await uploadDraftImage(authToken, file)
      const imgMd = `![${file.name}](${url})`
      const textarea = markdownTextareaRef.current

      if (!textarea) {
        setContent((prev) => `${prev}\n${imgMd}`)
        return
      }

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      setContent((prev) => prev.substring(0, start) + imgMd + prev.substring(end))
    },
    [authToken]
  )

  const onMarkdownImageSelected = useCallback(
    (file: File) => {
      void uploadMarkdownImage(file).catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed to upload image')
      })
    },
    [uploadMarkdownImage]
  )

  const saveOrSubmit = useCallback(
    async (submit: boolean) => {
      if (!user) return
      setSaving(true)
      setError(null)

      try {
        const token = await user.getIdToken()
        const status = submit ? 'review' : (contribution?.status === 'review' ? 'review' : 'draft')
        const draftContentToStore = mode === 'visual' ? htmlToMarkdown(content) : content

        if (!contribution) {
          const id = await createAutonomyDraft(token, {
            status,
            currentStep: submit ? 'review' : 'draft_submission',
            title: topic || 'Untitled Draft',
            draftContent: draftContentToStore,
          })
          if (!submit) router.replace(`/contribute/draft?id=${id}`)
        } else {
          await updateAutonomyDraft(token, {
            id: contribution.id,
            draftContent: draftContentToStore,
            status,
            currentStep: submit ? 'review' : undefined,
            title: topic,
            existingBriefTopic: contribution.brief.topic,
          })
        }

        if (submit) router.push('/contribute')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to save draft')
      } finally {
        setSaving(false)
      }
    },
    [user, contribution, topic, content, mode, router]
  )

  if (authLoading || writerLoading || loading || isWriter === false) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (hasAgreement === false) {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    params.set('path', 'autonomy')
    const wizardUrl = `/contribute/wizard?${params.toString()}`

    return (
      <div className="min-h-screen pt-32 px-6 flex justify-center">
        <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 text-center space-y-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Agreement richiesto</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Prima di accedere alla scrittura autonoma devi accettare il Contributor Agreement.
          </p>
          <button
            onClick={() => router.push(wizardUrl)}
            className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 transition"
          >
            Vai all’accordo
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button onClick={() => router.push('/contribute')} className="text-primary-600 hover:underline">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <DraftEditorView
      topic={topic}
      onTopicChange={setTopic}
      content={content}
      onContentChange={setContent}
      mode={mode}
      onModeChange={switchMode}
      onBack={() => router.push('/contribute')}
      onSave={() => void saveOrSubmit(false)}
      onSubmit={() => void saveOrSubmit(true)}
      saving={saving}
      canSubmit={Boolean(content.trim() && topic.trim())}
      authToken={authToken}
      onMarkdownImageSelected={onMarkdownImageSelected}
      markdownTextareaRef={markdownTextareaRef}
      reviewStatus={contribution?.review?.status}
      reviewNote={contribution?.review?.note}
      reviewAnnotations={contribution?.review?.annotations}
    />
  )
}
