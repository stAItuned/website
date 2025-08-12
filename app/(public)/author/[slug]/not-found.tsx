import Link from 'next/link'
import { PageTransition } from '@/components/ui/PageTransition'

export default function AuthorNotFound() {
  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Author Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the author you&apos;re looking for. They might not exist or have any published articles yet.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/learn"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Articles
          </Link>
          
          <div>
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
