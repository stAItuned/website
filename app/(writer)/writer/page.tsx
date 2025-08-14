'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/AuthContext"
import { useMultipleAnalytics, formatAnalyticsNumber } from "@/lib/hooks/useAnalytics"
import { useArticles, useArticleStats } from "@/lib/hooks/useArticles"

interface WriterStats {
  drafts: number
  published: number
  views: number
  users: number
  lastActivity: string
}

export default function WriterPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<WriterStats>({
    drafts: 0,
    published: 0,
    views: 0,
    users: 0,
    lastActivity: new Date().toLocaleDateString()
  })

  // Get real analytics data for all articles
  const { data: analyticsData, loading: analyticsLoading } = useMultipleAnalytics({
    startDate: '30daysAgo',
    endDate: 'today'
  })

  // Get real article statistics from CMS
  const { data: articleStats, loading: articleStatsLoading } = useArticleStats()

  // Get recent published articles for the user
  const { data: userArticles } = useArticles({
    author: user?.displayName || undefined,
    published: true,
    limit: 10
  })

  // Calculate total stats from analytics data and CMS data
  useEffect(() => {
    if (analyticsData && analyticsData.length > 0) {
      const totalViews = analyticsData.reduce((sum, article) => sum + article.pageViews, 0)
      const totalUsers = analyticsData.reduce((sum, article) => sum + article.users, 0)
      
      setStats(prev => ({
        ...prev,
        views: totalViews,
        users: totalUsers,
        published: analyticsData.length, // Number of articles with analytics data
      }))
    }

    // Use real article stats from CMS if available
    if (articleStats && !articleStatsLoading) {
      setStats(prev => ({
        ...prev,
        published: articleStats.published,
        drafts: articleStats.drafts,
      }))
    }

    // If no analytics data and no article stats, use fallback
    if (!analyticsData?.length && !analyticsLoading && !articleStats && !articleStatsLoading) {
      setStats(prev => ({
        ...prev,
        drafts: 3,
        published: 7,
        views: 1247,
        users: 892,
        lastActivity: new Date().toLocaleDateString()
      }))
    }
  }, [analyticsData, analyticsLoading, articleStats, articleStatsLoading])

  const quickActions = [
    {
      title: "New Article",
      description: "Start writing a new article with AI assistance",
      href: "/writer/new",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "My Drafts",
      description: "Continue working on your saved drafts",
      href: "/writer/drafts",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "bg-amber-500 hover:bg-amber-600"
    },
    {
      title: "Published",
      description: "View and manage your published articles",
      href: "/writer/published",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Analytics",
      description: "Track your article performance and engagement",
      href: "/writer/analytics",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ]

  // Transform user articles to draft-like format for display
  const recentItems = userArticles?.slice(0, 3).map((article, index) => ({
    id: index + 1,
    title: article.title,
    lastEdited: article.date ? new Date(article.date).toLocaleDateString() : 'No date',
    wordCount: article.readingTime * 250, // Approximate word count from reading time
    isPublished: article.published,
    slug: article.slug,
    target: article.target,
    url: article.url
  })) || [
    // Fallback mock data if no user articles
    {
      id: 1,
      title: "Understanding Neural Networks in 2024",
      lastEdited: "2 hours ago",
      wordCount: 1247,
      isPublished: false,
      slug: "",
      target: "midway",
      url: ""
    },
    {
      id: 2,
      title: "The Future of AI in Healthcare",
      lastEdited: "1 day ago",
      wordCount: 856,
      isPublished: false,
      slug: "",
      target: "newbie",
      url: ""
    },
    {
      id: 3,
      title: "Machine Learning Best Practices",
      lastEdited: "3 days ago",
      wordCount: 2103,
      isPublished: false,
      slug: "",
      target: "expert",
      url: ""
    }
  ]

  return (
    <main className="container mx-auto px-4 py-8 pt-24 space-y-8">{/* Added pt-24 to account for fixed header */}
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.displayName?.split(' ')[0] || 'Writer'}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Ready to create something amazing today?
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              href="/writer/new"
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Article</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.drafts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsLoading ? '...' : formatAnalyticsNumber(stats.views)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Readers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsLoading ? '...' : formatAnalyticsNumber(stats.users)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Articles/Drafts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Articles</h2>
          <Link 
            href="/writer/published"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {recentItems.map((item, index) => (
            <div key={item.id} className={`p-6 hover:bg-gray-50 transition-colors ${index !== recentItems.length - 1 ? 'border-b' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    {item.isPublished && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Published
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Last edited {item.lastEdited}</span>
                    <span>•</span>
                    <span>{item.wordCount} words</span>
                    {item.target && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{item.target}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.isPublished && item.url ? (
                    <Link
                      href={item.url}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View article
                    </Link>
                  ) : (
                    <Link
                      href={`/writer/new?edit=${item.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Continue editing
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Writing Tips */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Writing Tip of the Day</h2>
        <p className="text-gray-700 mb-4">
          &ldquo;Start with a compelling hook in your introduction. Ask a thought-provoking question, share a surprising statistic, or present a bold statement that makes readers want to continue.&rdquo;
        </p>
        <Link 
          href="/writer/tips"
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          More writing tips →
        </Link>
      </div>
    </main>
  )
}
