import { allPosts } from '@/lib/contentlayer'
import Link from 'next/link'

export default function PostsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Articles</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
              {post.cover && (
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link href={post.url} className="hover:text-primary-500">
                    {post.title}
                  </Link>
                </h2>
                {post.meta && (
                  <p className="text-gray-600 mb-4">{post.meta}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.date ? new Date(post.date).toLocaleDateString() : ''}</span>
                  {post.author && <span>by {post.author}</span>}
                </div>
                {post.topics && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.topics.map((topic: string) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
