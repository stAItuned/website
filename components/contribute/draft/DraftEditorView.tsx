'use client'

import { ArrowLeft, Code2, Save, Send, Type } from 'lucide-react'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { DraftEditorMode } from '@/lib/markdown/draftTransforms'
import { MarkdownEditor } from './MarkdownEditor'

interface DraftEditorViewProps {
  topic: string
  onTopicChange: (next: string) => void
  content: string
  onContentChange: (next: string) => void
  mode: DraftEditorMode
  onModeChange: (mode: DraftEditorMode) => void
  onBack: () => void
  onSave: () => void
  onSubmit: () => void
  saving: boolean
  canSubmit: boolean
  authToken: string
  onMarkdownImageSelected: (file: File) => void
  markdownTextareaRef: React.RefObject<HTMLTextAreaElement>
  reviewStatus?: 'approved' | 'rejected' | 'changes_requested'
  reviewNote?: string
  reviewAnnotations?: {
    start: number
    end: number
    note: string
    createdAt: string
    authorEmail: string
  }[]
}

/**
 * Presentational layout for the standalone draft editor.
 */
export function DraftEditorView({
  topic,
  onTopicChange,
  content,
  onContentChange,
  mode,
  onModeChange,
  onBack,
  onSave,
  onSubmit,
  saving,
  canSubmit,
  authToken,
  onMarkdownImageSelected,
  markdownTextareaRef,
  reviewStatus,
  reviewNote,
  reviewAnnotations,
}: DraftEditorViewProps) {
  const showReviewNote = Boolean(reviewNote && reviewNote.trim().length > 0)
  const showReviewStatus = reviewStatus === 'changes_requested' || reviewStatus === 'rejected'
  const hasInlineNotes = Boolean(reviewAnnotations && reviewAnnotations.length > 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {(showReviewNote || showReviewStatus) && (
          <div className="mb-6 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 p-4">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-semibold text-sm">
              {reviewStatus === 'changes_requested' ? 'Modifiche richieste' : 'Revisione'}
            </div>
            {showReviewNote && (
              <p className="mt-2 text-sm text-amber-800/90 dark:text-amber-200/90 whitespace-pre-wrap">
                {reviewNote}
              </p>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{saving ? 'Salvando...' : ''}</span>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={onSubmit}
              disabled={saving || !canSubmit}
              className="flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-t-2xl border border-b-0 border-slate-200 dark:border-slate-700 px-6 md:px-10 pt-6 md:pt-10">
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="Article Title..."
            className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
          />
          <div className="h-px bg-slate-100 dark:bg-slate-700 w-full mt-4" />
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border-x border-slate-200 dark:border-slate-700 px-6 md:px-10 py-3">
          <button
            onClick={() => onModeChange('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'visual'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Type className="w-4 h-4" />
            Visual
          </button>
          <button
            onClick={() => onModeChange('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'markdown'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Markdown
          </button>
        </div>

        {mode === 'visual' ? (
          <div className="rounded-b-2xl overflow-hidden">
            <RichTextEditor
              content={content}
              onChange={onContentChange}
              placeholder="Start writing your draft here..."
              authToken={authToken}
            />
          </div>
        ) : (
          <MarkdownEditor
            content={content}
            onChange={onContentChange}
            onImageSelected={onMarkdownImageSelected}
            textareaRef={markdownTextareaRef}
          />
        )}

        {hasInlineNotes && (
          <div className="mt-6 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 p-4">
            <div className="text-sm font-semibold text-amber-800 dark:text-amber-200">
              Note inline
            </div>
            <ul className="mt-3 space-y-2 text-sm text-amber-800/90 dark:text-amber-200/90">
              {reviewAnnotations!.map((ann, idx) => (
                <li key={`${ann.start}-${ann.end}-${idx}`} className="flex flex-col gap-1">
                  <span className="text-xs text-amber-700/70 dark:text-amber-200/70">
                    {ann.authorEmail} • {new Date(ann.createdAt).toLocaleString()}
                  </span>
                  <span>{ann.note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
