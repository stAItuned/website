'use client'

import { useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorToolbar } from './EditorToolbar'

// =============================================================================
// Types
// =============================================================================

interface RichTextEditorProps {
    /** HTML content to initialize the editor with */
    content: string
    /** Called whenever the editor content changes (returns HTML) */
    onChange: (html: string) => void
    /** Placeholder text when the editor is empty */
    placeholder?: string
    /** Auth token for image uploads */
    authToken: string
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Rich text editor powered by Tiptap.
 * Supports headings, bold, italic, lists, links, images, and more.
 */
export function RichTextEditor({ content, onChange, placeholder, authToken }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Image.configure({
                inline: false,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full mx-auto my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary-600 dark:text-primary-400 underline',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing...',
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[50vh] p-6 md:p-10',
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    })

    /**
     * Handles image file upload to the server and insertion into the editor.
     */
    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor || !authToken) return

        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await fetch('/api/user/draft-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: formData,
            })

            if (!response.ok) {
                const errData = await response.json()
                alert(errData.error || 'Failed to upload image')
                return
            }

            const data = await response.json()
            editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
        } catch (err) {
            console.error('Image upload error:', err)
            alert('Failed to upload image')
        }
    }, [editor, authToken])

    const onImageButtonClick = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleImageUpload(file)
            // Reset input so the same file can be uploaded again
            e.target.value = ''
        }
    }, [handleImageUpload])

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
            <EditorToolbar editor={editor} onImageUpload={onImageButtonClick} />
            <EditorContent editor={editor} />
            {/* Hidden file input for image uploads */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                className="hidden"
                onChange={onFileChange}
            />
        </div>
    )
}
