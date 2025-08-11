import Link from "next/link"

export default function WriterPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/writer/editor"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">New Article</h2>
          <p className="text-gray-600">Start writing a new article with AI assistance</p>
        </Link>
        
        <Link
          href="/writer/drafts"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">My Drafts</h2>
          <p className="text-gray-600">Continue working on your saved drafts</p>
        </Link>
        
        <Link
          href="/writer/published"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Published</h2>
          <p className="text-gray-600">View your published articles</p>
        </Link>
      </div>
    </main>
  )
}
