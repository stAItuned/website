'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Search, Filter, ChevronLeft, ChevronRight, RefreshCw, Mail, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface BadgeEmailItem {
  authorSlug: string
  authorName: string
  authorEmail: string
  badgeId: string
  badgeName: string
  badgeTier: string
  credentialId: string
  earnedAt: string
  emailStatus: string
  emailSentAt: string | null
  emailLastError: string | null
}

/**
 * Admin queue for approving and sending badge award emails.
 */
export function AdminBadgeEmailQueue() {
  const { user } = useAuth()
  const [items, setItems] = useState<BadgeEmailItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sending, setSending] = useState<Record<string, boolean>>({})

  // Filtering, Sorting and Pagination State
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'authorName' | 'earnedAt'>('earnedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [emailStatusFilter, setEmailStatusFilter] = useState<'pending' | 'sent' | 'all'>('pending')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredItems = useMemo(() => {
    let result = [...items]

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      result = result.filter(item =>
        item.authorName.toLowerCase().includes(lowerSearch) ||
        item.authorEmail.toLowerCase().includes(lowerSearch) ||
        item.badgeName.toLowerCase().includes(lowerSearch) ||
        item.credentialId.toLowerCase().includes(lowerSearch)
      )
    }

    if (tierFilter !== 'all') {
      result = result.filter(item => item.badgeTier === tierFilter)
    }

    // Dynamic Sort
    return result.sort((a, b) => {
      if (sortBy === 'authorName') {
        const nameA = a.authorName.toLowerCase()
        const nameB = b.authorName.toLowerCase()
        if (sortOrder === 'asc') return nameA.localeCompare(nameB)
        return nameB.localeCompare(nameA)
      } else {
        const dateA = new Date(a.earnedAt).getTime()
        const dateB = new Date(b.earnedAt).getTime()
        if (sortOrder === 'asc') return dateA - dateB
        return dateB - dateA
      }
    })
  }, [items, searchTerm, tierFilter, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredItems.slice(start, start + itemsPerPage)
  }, [filteredItems, currentPage])

  // Reset to first page when filters or sort change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, tierFilter, sortBy, sortOrder, emailStatusFilter])

  const fetchQueue = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const token = await user.getIdToken()
      const res = await fetch(`/api/admin/badge-emails?status=${emailStatusFilter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.success) {
        const detail = data.details ? ` (${data.details})` : ''
        throw new Error(`${data.error || 'Failed to load queue'}${detail}`)
      }
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (err) {
      console.error('Failed to load badge email queue:', err)
      setError('Failed to load badge email queue')
    } finally {
      setLoading(false)
    }
  }, [user, emailStatusFilter])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  const handleSend = async (item: BadgeEmailItem) => {
    if (!user) return
    const key = `${item.authorSlug}:${item.badgeId}`
    setSending((prev) => ({ ...prev, [key]: true }))
    setError('')
    try {
      const token = await user.getIdToken()
      const res = await fetch('/api/admin/badge-emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorSlug: item.authorSlug, badgeId: item.badgeId }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        if (res.status === 409 && data?.emailSentAt) {
          const sentAt = new Date(data.emailSentAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          setError(`Email already sent on ${sentAt}.`)
          setItems((prev) =>
            prev.filter((entry) => !(entry.authorSlug === item.authorSlug && entry.badgeId === item.badgeId))
          )
          return
        }
        throw new Error(data.error || 'Failed to send email')
      }
      setItems((prev) => prev.filter((entry) => !(entry.authorSlug === item.authorSlug && entry.badgeId === item.badgeId)))
    } catch (err) {
      console.error('Failed to send badge email:', err)
      setError('Failed to send badge email. Check logs for details.')
    } finally {
      setSending((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleSort = (field: 'authorName' | 'earnedAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder(field === 'earnedAt' ? 'desc' : 'asc')
    }
  }

  const tiers = useMemo(() => {
    const uniqueTiers = Array.from(new Set(items.map(i => i.badgeTier)))
    return uniqueTiers.sort()
  }, [items])

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white/50 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/40">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary-100 p-2 dark:bg-primary-900/30">
              <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Badge Email Queue</h3>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {items.length} {emailStatusFilter === 'pending' ? 'pending' : emailStatusFilter} awards.
            {' '}Filter and {emailStatusFilter === 'pending' ? 'approve to send emails' : 'review delivery history'}.
          </p>
        </div>
        <button
          onClick={fetchQueue}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by author, email, badge name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-slate-400 shadow-sm transition-all focus:border-primary-500 focus:ring-primary-500 dark:border-slate-800 dark:bg-slate-900 dark:placeholder-slate-500"
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative min-w-[170px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <select
              value={emailStatusFilter}
              onChange={(e) => setEmailStatusFilter(e.target.value as 'pending' | 'sent' | 'all')}
              className="block w-full rounded-xl border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm shadow-sm transition-all focus:border-primary-500 focus:ring-primary-500 dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="pending">Pending Emails</option>
              <option value="sent">Sent Emails</option>
              <option value="all">All Emails</option>
            </select>
          </div>
          <div className="relative min-w-[160px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="block w-full rounded-xl border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm shadow-sm transition-all focus:border-primary-500 focus:ring-primary-500 dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="all">All Tiers</option>
              {tiers.map(tier => (
                <option key={tier} value={tier}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="relative min-w-[200px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
            </div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as ['authorName' | 'earnedAt', 'asc' | 'desc']
                setSortBy(field)
                setSortOrder(order)
              }}
              className="block w-full rounded-xl border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm shadow-sm transition-all focus:border-primary-500 focus:ring-primary-500 dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="earnedAt-desc">Newest First</option>
              <option value="earnedAt-asc">Oldest First</option>
              <option value="authorName-asc">Name (A-Z)</option>
              <option value="authorName-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 p-4 text-sm text-red-600 dark:border-red-900/20 dark:bg-red-900/10">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          {error}
        </div>
      ) : null}

      {loading && items.length === 0 ? (
        <div className="mt-6 flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </div>
      ) : (
        <>
          {filteredItems.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
              <div className="rounded-full bg-slate-50 p-4 dark:bg-slate-900/50">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h4 className="mt-4 font-bold text-slate-900 dark:text-white">No badge emails found</h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile List View */}
              <div className="mt-6 space-y-4 md:hidden">
                {paginatedItems.map((item) => {
                  const key = `${item.authorSlug}:${item.badgeId}`
                  const isSending = Boolean(sending[key])
                  return (
                    <div
                      key={key}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-base font-bold text-slate-900 dark:text-white">{item.authorName}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.authorEmail || 'Missing email'}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                          {item.badgeTier}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-y-3 rounded-xl bg-slate-50/50 p-3 text-xs dark:bg-slate-800/30">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Badge</p>
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{item.badgeName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Earned</p>
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{new Date(item.earnedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Credential ID</p>
                          <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{item.credentialId}</p>
                        </div>
                        {item.emailSentAt && (
                          <div className="col-span-2">
                            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Email Sent</p>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">
                              {new Date(item.emailSentAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        )}
                      </div>

                      {item.emailLastError && (
                        <div className="mt-3 rounded-lg bg-red-50 p-2 text-[11px] text-red-600 dark:bg-red-900/20 dark:text-red-400">
                          {item.emailLastError}
                        </div>
                      )}

                      {item.emailStatus === 'sent' ? (
                        <div className="mt-5 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-center text-sm font-bold text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-300">
                          Already Sent
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSend(item)}
                          disabled={isSending}
                          className="mt-5 w-full rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-700 hover:shadow-primary-500/30 disabled:opacity-50"
                        >
                          {isSending ? (
                            <RefreshCw className="mx-auto h-4 w-4 animate-spin" />
                          ) : 'Send Approval Email'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Desktop Table View */}
              <div className="mt-8 hidden overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th
                        className="cursor-pointer px-6 py-4 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                        onClick={() => handleSort('authorName')}
                      >
                        <div className="flex items-center gap-1">
                          Author
                          {sortBy === 'authorName' && (
                            sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4">Badge</th>
                      <th
                        className="cursor-pointer px-6 py-4 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                        onClick={() => handleSort('earnedAt')}
                      >
                        <div className="flex items-center gap-1">
                          Earned
                          {sortBy === 'earnedAt' && (
                            sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white/30 dark:divide-slate-800 dark:bg-slate-900/10">
                    {paginatedItems.map((item) => {
                      const key = `${item.authorSlug}:${item.badgeId}`
                      const isSending = Boolean(sending[key])
                      return (
                        <tr key={key} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 dark:text-white">{item.authorName}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{item.authorEmail || 'No email'}</span>
                              <span className="mt-1 font-mono text-[10px] text-slate-400">{item.credentialId}</span>
                              {item.emailSentAt && (
                                <span className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                                  Sent: {new Date(item.emailSentAt).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              )}
                              {item.emailLastError && (
                                <span className="mt-1 text-[10px] font-medium text-red-500">{item.emailLastError}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{item.badgeName}</span>
                              <span className="mt-1 inline-flex w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                {item.badgeTier}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              {new Date(item.earnedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {item.emailStatus === 'sent' ? (
                              <span className="inline-flex h-9 items-center justify-center rounded-lg border border-emerald-300 bg-emerald-50 px-4 text-xs font-bold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                                Sent
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSend(item)}
                                disabled={isSending}
                                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary-600 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md disabled:opacity-50 active:scale-95"
                              >
                                {isSending ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Send'}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30 sm:flex-row">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Showing <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredItems.length}</span> entries
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1
                        const isCurrent = page === currentPage
                        // Simple logic for page numbers
                        if (totalPages > 5 && Math.abs(page - currentPage) > 1 && page !== 1 && page !== totalPages) {
                          if (page === 2 || page === totalPages - 1) return <span key={page} className="px-1 text-slate-400">...</span>
                          return null
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={clsx(
                              "h-8 w-8 rounded-lg text-xs font-bold transition-all",
                              isCurrent
                                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
