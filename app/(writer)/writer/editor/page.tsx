"use client"

import { useState, useTransition } from "react"
import { saveDraft } from "../../actions"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export default function EditorPage() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [tags, setTags] = useState("")
  const [isPending, startTransition] = useTransition()
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your article...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px]",
      },
    },
  })

  const handleSave = () => {
    if (!editor) return

    startTransition(async () => {
      try {
        await saveDraft({
          title,
          slug,
          content: editor.getHTML(),
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
        })
        alert('Draft saved successfully!')
      } catch (error) {
        console.error('Error saving draft:', error)
        alert('Error saving draft')
      }
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(generateSlug(value))
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-6 mb-8">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter article title..."
              className="w-full text-2xl font-bold border-none outline-none placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-slug"
              className="w-full text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ai, machine-learning, python"
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Content
          </label>
          <div className="border border-gray-300 rounded-md p-4 min-h-[400px]">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="flex justify-end mt-8 space-x-4">
          <button
            onClick={handleSave}
            disabled={isPending || !title || !slug}
            className="px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </div>
    </main>
  )
}
