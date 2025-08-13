'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Draft {
  id: string
  title: string
  excerpt: string
  lastEdited: string
  wordCount: number
  status: 'draft' | 'review' | 'scheduled'
  category: string
}

type FilterType = 'all' | 'draft' | 'review' | 'scheduled'

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

  // Mock data - this would come from your backend/Firebase
  useEffect(() => {
    setTimeout(() => {
      setDrafts([
        {
          id: '1',
          title: 'Understanding Neural Networks in 2024',
          excerpt: 'Neural networks have evolved significantly over the past few years, with new architectures and training methods emerging...',
          lastEdited: '2 hours ago',
          wordCount: 1247,
          status: 'draft',
          category: 'Machine Learning'
        },
        {
          id: '2',
          title: 'The Future of AI in Healthcare',
          excerpt: 'Artificial intelligence is revolutionizing healthcare by enabling more accurate diagnoses, personalized treatments...',
          lastEdited: '1 day ago',
          wordCount: 856,
          status: 'review',
          category: 'Healthcare AI'
        },
        {
          id: '3',
          title: 'Machine Learning Best Practices',
          excerpt: 'When building machine learning models, following best practices is crucial for creating robust and reliable systems...',
          lastEdited: '3 days ago',
          wordCount: 2103,
          status: 'draft',
          category: 'Best Practices'
        },
        {
          id: '4',
          title: 'Introduction to Deep Learning',
          excerpt: 'Deep learning has become one of the most powerful tools in artificial intelligence, enabling breakthrough achievements...',
          lastEdited: '1 week ago',
          wordCount: 1456,
          status: 'scheduled',
          category: 'Deep Learning'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredDrafts = filter === 'all' 
    ? drafts 
    : drafts.filter(draft => draft.status === filter)

  const getStatusBadge = (status: Draft['status']) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      review: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-green-100 text-green-800'
    }
    
    const labels = {
      draft: 'Draft',
      review: 'In Review',
      scheduled: 'Scheduled'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const deleteDraft = (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      setDrafts(drafts.filter(draft => draft.id !== id))
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 pt-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Drafts</h1>
          <p className="text-gray-600 mt-2">
            {filteredDrafts.length} {filteredDrafts.length === 1 ? 'draft' : 'drafts'} found
          </p>
        </div>
        <Link
          href="/writer/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Draft</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[
            { key: 'all', label: 'All Drafts', count: drafts.length },
            { key: 'draft', label: 'Drafts', count: drafts.filter(d => d.status === 'draft').length },
            { key: 'review', label: 'In Review', count: drafts.filter(d => d.status === 'review').length },
            { key: 'scheduled', label: 'Scheduled', count: drafts.filter(d => d.status === 'scheduled').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as FilterType)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Drafts Grid */}
      {filteredDrafts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No drafts</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new article.</p>
          <div className="mt-6">
            <Link
              href="/writer/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Article
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDrafts.map((draft) => (
            <div key={draft.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{draft.title}</h3>
                    {getStatusBadge(draft.status)}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{draft.excerpt}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{draft.category}</span>
                    <span>Last edited {draft.lastEdited}</span>
                    <span>•</span>
                    <span>{draft.wordCount} words</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    href={`/writer/new?edit=${draft.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm px-3 py-1 rounded hover:bg-primary-50"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteDraft(draft.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
