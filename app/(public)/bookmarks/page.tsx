'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { app } from '@/lib/firebase/client'
import { allPosts } from '@/lib/contentlayer'
import { ArticleCard } from '@/components/ArticleCard'
import Link from 'next/link'

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!authLoading && !user) {
      // Store current URL for redirect after login
      localStorage.setItem('redirectAfterLogin', '/bookmarks')
      router.push('/signin')
      return
    }

    // Fetch user's bookmarks
    const fetchBookmarks = async () => {
      if (!user) return

      try {
        const db = getFirestore(app)
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const userBookmarks = userDoc.data().bookmarks || []
          setBookmarks(userBookmarks)
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBookmarks()
    }
  }, [user, authLoading, router])

  // Get bookmarked articles
  const bookmarkedArticles = allPosts.filter((article: any) =>
    bookmarks.includes(article.slug)
  )

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                My Bookmarks
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {bookmarkedArticles.length}{' '}
                {bookmarkedArticles.length === 1 ? 'article' : 'articles'} saved
              </p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-primary-600 dark:text-primary-400 font-semibold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <span>{user.displayName || user.email}</span>
            </div>
          )}
        </div>

        {/* Content */}
        {bookmarkedArticles.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No bookmarks yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start saving articles you want to read later by clicking the bookmark
              icon while reading an article.
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Explore Articles
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bookmarkedArticles.map((article: any) => (
              <ArticleCard
                key={article.slug}
                article={article}
              />
            ))}
          </div>
        )}

        {/* Tips */}
        {bookmarkedArticles.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-6 border border-primary-200 dark:border-slate-700">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Pro Tip
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your bookmarks are synced across all your devices. You can remove
                  bookmarks by clicking the bookmark icon again while reading the
                  article.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
