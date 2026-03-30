'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/auth/AuthContext'

interface AdminFirstPartyPageViewRow {
  id: string
  path: string
  pageUrl: string
  title: string
  pageType: string
  author: string | null
  language: string | null
  target: string | null
  pageViews: number
  updatedAt: string | null
}

interface AdminFirstPartyAnalyticsResponse {
  success: boolean
  rows: AdminFirstPartyPageViewRow[]
  summary: {
    trackedPages: number
    pagesWithViews: number
    totalViews: number
  }
  source: string
  generatedAt: string
  error?: string
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('it-IT').format(value)
}

function formatDate(value: string | null): string {
  if (!value) return 'Not synced'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not synced'

  return date.toLocaleString('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function AdminFirstPartyAnalytics() {
  const { user } = useAuth()
  const [rows, setRows] = useState<AdminFirstPartyPageViewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [source, setSource] = useState<string>('firestore:first-party')
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        const token = await user.getIdToken()
        const response = await fetch('/api/admin/analytics/pages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = (await response.json()) as AdminFirstPartyAnalyticsResponse
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Unable to load first-party analytics')
        }

        setRows(result.rows)
        setSource(result.source)
        setGeneratedAt(result.generatedAt)
      } catch (fetchError) {
        const message =
          fetchError instanceof Error ? fetchError.message : 'Unable to load first-party analytics'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    void fetchAnalytics()
  }, [user])

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return rows

    return rows.filter((row) => {
      return (
        row.title.toLowerCase().includes(normalizedQuery) ||
        row.path.toLowerCase().includes(normalizedQuery) ||
        row.pageType.toLowerCase().includes(normalizedQuery) ||
        (row.author || '').toLowerCase().includes(normalizedQuery)
      )
    })
  }, [query, rows])

  const summary = useMemo(() => {
    const totalViews = filteredRows.reduce((sum, row) => sum + row.pageViews, 0)
    const pagesWithViews = filteredRows.filter((row) => row.pageViews > 0).length

    return {
      trackedPages: filteredRows.length,
      pagesWithViews,
      totalViews,
    }
  }, [filteredRows])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Tracked pages</dt>
          <dd className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
            {formatNumber(summary.trackedPages)}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Pages with views</dt>
          <dd className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
            {formatNumber(summary.pagesWithViews)}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Total first-party views</dt>
          <dd className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
            {formatNumber(summary.totalViews)}
          </dd>
        </div>
      </dl>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Source</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Only persisted first-party counters are included for public pages. Source: <span className="font-medium">{source}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Generated at {formatDate(generatedAt)}
            </p>
          </div>

          <div className="w-full lg:max-w-sm">
            <label htmlFor="admin-analytics-search" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Filter pages
            </label>
            <input
              id="admin-analytics-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, path, type or author"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {filteredRows.map((row, index) => (
          <article
            key={row.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Rank #{index + 1}
                </p>
                <h2 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{row.title}</h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {formatNumber(row.pageViews)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">views</p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Type</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{row.pageType}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Author</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{row.author || '-'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Language</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{row.language || '-'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Updated</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{formatDate(row.updatedAt)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{row.pageUrl}</p>
              <Link
                href={row.pageUrl}
                className="shrink-0 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-500"
              >
                Open page
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Page
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Language
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Updated
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredRows.map((row, index) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="font-medium text-slate-900 dark:text-white">{row.title}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{row.pageUrl}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {row.pageType}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {row.author || '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {row.language || '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">
                    {formatNumber(row.pageViews)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {formatDate(row.updatedAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                    <Link
                      href={row.pageUrl}
                      className="inline-flex rounded-lg bg-primary-600 px-3 py-2 font-semibold text-white transition hover:bg-primary-500"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRows.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          No tracked public pages matched the current filter.
        </div>
      )}
    </div>
  )
}
