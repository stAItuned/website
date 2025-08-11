import { allPosts } from '@/lib/contentlayer'
import { notFound } from 'next/navigation'

export const dynamicParams = false

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-gray-600 mb-6">
            <div className="flex items-center space-x-4">
              {post.author && <span>by {post.author}</span>}
              <span>{post.date ? new Date(post.date).toLocaleDateString() : ''}</span>
            </div>
          </div>
          {post.topics && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.topics.map((topic: string) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </header>
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body.html }}
        />
      </article>
    </main>
  )
}
