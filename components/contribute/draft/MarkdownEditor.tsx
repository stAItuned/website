'use client'

import { ImagePlus } from 'lucide-react'
import { useRef } from 'react'

interface MarkdownEditorProps {
  content: string
  onChange: (next: string) => void
  onImageSelected: (file: File) => void
  textareaRef?: React.RefObject<HTMLTextAreaElement>
}

/**
 * Minimal Markdown editor with inline image insertion.
 */
export function MarkdownEditor({ content, onChange, onImageSelected, textareaRef }: MarkdownEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="flex items-center gap-2 px-6 md:px-10 py-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          title="Insert Image"
        >
          <ImagePlus className="w-4 h-4" />
          Image
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            onImageSelected(file)
            e.target.value = ''
          }}
        />
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing in Markdown..."
        className="w-full min-h-[60vh] resize-none bg-transparent border-none outline-none text-base leading-relaxed text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 font-mono p-6 md:p-10"
      />
    </div>
  )
}
