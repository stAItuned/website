'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ComponentProps } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { useAuth } from '@/components/auth/AuthContext'
import { useWriterStatus } from '@/components/auth/WriterStatusContext'
import { app } from '@/lib/firebase/client'
import { ArticleCard } from '@/components/ArticleCard'
import { resolveProfileIdentity } from '@/lib/auth/profileIdentity'
import { BookMarked, Compass, Home, Sparkles } from 'lucide-react'

type ArticlePreview = ComponentProps<typeof ArticleCard>['article']

const isArticlePreview = (value: unknown): value is ArticlePreview => {
  if (!value || typeof value !== 'object') return false
  const maybe = value as { slug?: unknown; title?: unknown }
  return typeof maybe.slug === 'string' && typeof maybe.title === 'string'
}

/**
 * Displays user bookmark collection with quick navigation actions.
 */
export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth()
  const { writerDisplayName, writerImageUrl } = useWriterStatus()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [articles, setArticles] = useState<ArticlePreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      localStorage.setItem('redirectAfterLogin', '/bookmarks')
      router.push('/signin')
      return
    }

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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles')
        if (!response.ok) return
        const result = await response.json()
        if (!result?.success || !Array.isArray(result.data)) return
        const articleList = result.data.filter(isArticlePreview)
        setArticles(articleList)
      } catch (error) {
        console.error('Error fetching articles for bookmarks:', error)
      }
    }

    fetchArticles()
  }, [])

  const bookmarkedArticles = useMemo(() => {
    return articles.filter((article) => bookmarks.includes(article.slug))
  }, [articles, bookmarks])
  const identity = user
    ? resolveProfileIdentity({
      user,
      writerDisplayName,
      writerImageUrl,
    })
    : null

  if (authLoading || loading || !user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-32 pb-16 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your bookmarks...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-32 pb-16 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-900/30" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-secondary-200/50 blur-3xl dark:bg-secondary-900/20" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <Link
            href="/account/settings"
            className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300"
          >
            <Home className="h-4 w-4" />
            Back to Account
          </Link>

          <div className="mt-5 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                  <BookMarked className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Bookmarks</h1>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {bookmarkedArticles.length} {bookmarkedArticles.length === 1 ? 'article' : 'articles'} saved for later
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/learn"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-600 hover:shadow-md sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Compass className="h-4 w-4" />
                  Explore articles
                </Link>
                <Link
                  href="/account/settings"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  Account settings
                </Link>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                {identity?.imageUrl ? (
                  <Image
                    src={identity.imageUrl}
                    alt={identity.displayName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                    {identity?.initials || user.email?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <span>{identity?.displayName || user.email}</span>
            </div>
          </div>
        </div>

        {bookmarkedArticles.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-12 text-center shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
              <BookMarked className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">No bookmarks yet</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Save articles you want to read later. Just tap the bookmark icon on any article page.
            </p>
            <Link
              href="/learn"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Compass className="h-4 w-4" />
              Discover content
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bookmarkedArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}

        {bookmarkedArticles.length > 0 ? (
          <div className="mt-10 rounded-2xl border border-primary-200/70 bg-primary-50/70 p-6 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Pro tip</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Your bookmarks sync across devices. Remove a bookmark by tapping the icon again while reading the article.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
