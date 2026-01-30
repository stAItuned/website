"use client"
import { useScreenSize } from '@/lib/hooks/useScreenSize'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ArticleTOC } from '@/components/ArticleTOC'
import { MarkdownContent } from '@/components/MarkdownContent'
import { LikeButton } from '@/components/LikeButton'
import { ArticleRating } from '@/components/ArticleRating'
import { BookmarkButton } from '@/components/BookmarkButton'
import { ArticleFAQ } from '@/components/ArticleFAQ'
import AuthorAvatar from '@/components/AuthorAvatar'
import { BackToTopButton } from '@/components/BackToTopButton'
import { PageTransition } from '@/components/ui/PageTransition'
import { RelatedArticles } from '@/components/RelatedArticles'
import { ReadingProgress } from '@/components/ui/ReadingProgress'
import { FloatingShareBar } from '@/components/ui/FloatingShareBar'
import { AuthorBioCard } from '@/components/ui/AuthorBioCard'
import { ContributorCTA } from '@/components/ui/ContributorCTA'
import { PWAInstallInline, SaveForOfflineButton } from '@/components/pwa'
import { MobileActionBar } from '@/components/ui/MobileActionBar'
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar'

import { ContinueReadingPrompt } from '@/components/ui/ContinueReadingPrompt'
import { SwipeNavigation } from '@/components/ui/SwipeNavigation'
import { FloatingSectionIndicator } from '@/components/ui/FloatingSectionIndicator'
import { RoleFitAuditCTA } from '@/components/ui/RoleFitAuditCTA'
import { useReadingProgress } from '@/lib/hooks/useReadingProgress'
import { useReadingHistory } from '@/hooks/useReadingHistory'
import { event } from '@/lib/gtag'
import {
  trackArticleScrollDepth,
  trackArticleReadComplete,
  trackArticleTimeOnPage
} from '@/lib/analytics'
import Link from 'next/link'
import Image from 'next/image'
import type { ArticleAnalytics } from '@/lib/analytics-server'
import { getTopicHub } from '@/config/topics'

import { useArticleLikes } from '@/lib/hooks/useArticleLikes'
import { GeoPlaybookRail } from '@/components/geo/GeoPlaybookRail'
import { GeoPlaybookBottomSheet } from '@/components/geo/GeoPlaybookBottomSheet'
import { GeoAnswerLayer } from '@/components/geo/GeoAnswerLayer'
import { GeoStrategicInsights } from '@/components/geo/GeoStrategicInsights'

export default function ArticlePageClient({
  coverImage,
  article,
  toc,
  target,
  targetDisplay,
  relatedArticles,
  authorData,
  analytics
}: any & { analytics: ArticleAnalytics }) {
  const isLarge = useScreenSize()
  const [showTocModal, setShowTocModal] = useState(false)

  // Initialize shared like state
  const { liked, likesCount, loading: likeLoading, handleLike } = useArticleLikes({
    articleSlug: article.slug,
    initialLikes: analytics.likes
  })

  const [modalActiveSlug, setModalActiveSlug] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showMobileToc, setShowMobileToc] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [modalScrollTop, setModalScrollTop] = useState(0)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [textSize, setTextSize] = useState<'small' | 'normal' | 'large'>('small')
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans')
  const [showPlaybookSheet, setShowPlaybookSheet] = useState(false)

  // Live analytics state - starts with SSR/ISR cached values, refreshes on mount
  const [liveAnalytics, setLiveAnalytics] = useState<ArticleAnalytics>(analytics)

  // Reading progress persistence
  const {
    savedProgress,
    showContinuePrompt,
    saveProgress,
    restorePosition,
    dismissPrompt
  } = useReadingProgress(article.slug)

  // Reading history for PWA shortcuts
  const { addToHistory } = useReadingHistory()

  // Fix hydration mismatch by only rendering responsive UI after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Track article in reading history for PWA shortcuts
  useEffect(() => {
    if (mounted && article.slug && article.title) {
      addToHistory({
        slug: article.slug,
        title: article.title,
        target: target
      })
    }
  }, [mounted, article.slug, article.title, target, addToHistory])

  // Refresh analytics on mount to get fresh data when page is cached
  useEffect(() => {
    const refreshAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/fast?slug=${encodeURIComponent(article.slug)}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setLiveAnalytics(result.data)
          }
        }
      } catch (error) {
        // Silently fail - we already have cached analytics from SSR
        console.warn('Failed to refresh analytics:', error)
      }
    }

    refreshAnalytics()
  }, [article.slug])

  // Handle mobile TOC button visibility on scroll
  useEffect(() => {
    if (!mounted || isLarge) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show button when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setShowMobileToc(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowMobileToc(false)
      }

      setLastScrollY(currentScrollY)

      // Calculate scroll percentage
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = Math.round((currentScrollY / docHeight) * 100)
      const newPercent = Math.min(scrolled, 100)
      setScrollPercent(newPercent)

      // Save reading progress
      saveProgress(newPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted, isLarge, lastScrollY, saveProgress])

  // Gesture handlers for TOC modal
  const handleTocTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY)
    const modal = e.currentTarget as HTMLElement
    setModalScrollTop(modal.scrollTop)
  }

  const handleTocTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY
    const diff = touchY - touchStartY

    // Close modal if swiping down from top
    if (diff > 50 && modalScrollTop === 0) {
      setShowTocModal(false)
    }
  }

  // Debug screen size and TOC
  useEffect(() => {
    console.log('[ARTICLE DEBUG] isLarge:', isLarge, 'window.innerWidth:', typeof window !== 'undefined' ? window.innerWidth : 'server')
    console.log('[ARTICLE DEBUG] TOC length:', toc.length)
  }, [isLarge, toc])

  // Tracking refs and state
  const scrollTrackingRef = useRef({
    maxScrolled: 0,
    scrollMilestones: new Set<number>(),
    startTime: Date.now(),
    hasTrackedEngagement: false,
    lastScrollTime: Date.now(),
    totalScrollTime: 0,
    scrollDirection: 'down' as 'up' | 'down',
    lastScrollPosition: 0,
    fastScrollCount: 0,
    slowScrollSections: new Set<string>(),
    readingSpeeds: [] as number[]
  })

  // Track scroll depth
  const trackScrollDepth = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = Math.round((scrollTop / docHeight) * 100)
    const now = Date.now()

    const tracking = scrollTrackingRef.current

    // Calculate scroll speed and direction
    const scrollDelta = scrollTop - tracking.lastScrollPosition
    const timeDelta = now - tracking.lastScrollTime
    const scrollSpeed = Math.abs(scrollDelta) / timeDelta // pixels per ms

    // Detect scroll direction
    const newDirection = scrollDelta > 0 ? 'down' : 'up'
    if (newDirection !== tracking.scrollDirection) {
      tracking.scrollDirection = newDirection
    }

    // Track fast scrolling (potential bounce indicator)
    if (scrollSpeed > 3) { // Fast scroll threshold
      tracking.fastScrollCount++
    }

    // Track reading time in sections
    if (scrollSpeed < 0.5 && timeDelta > 1000) { // Slow scroll = reading
      const section = Math.floor(scrollPercent / 10) * 10 // 10% sections
      tracking.slowScrollSections.add(`section_${section}`)
      tracking.readingSpeeds.push(scrollSpeed)
    }

    tracking.lastScrollPosition = scrollTop
    tracking.lastScrollTime = now
    tracking.totalScrollTime += timeDelta

    // Update max scrolled
    if (scrollPercent > tracking.maxScrolled) {
      tracking.maxScrolled = scrollPercent
    }

    // Track milestones (25%, 50%, 75%, 90%, 100%)
    const milestones = [25, 50, 75, 90, 100]
    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !tracking.scrollMilestones.has(milestone)) {
        tracking.scrollMilestones.add(milestone)

        // Calculate time to reach milestone
        const timeToMilestone = now - tracking.startTime

        event({
          action: 'scroll_depth',
          category: 'engagement',
          label: `${milestone}%`,
          value: milestone
        })

        // Track reading pace
        event({
          action: 'reading_pace',
          category: 'engagement',
          label: `time_to_${milestone}%`,
          value: Math.round(timeToMilestone / 1000)
        })

        // Centralized tracking for GA4 consistency
        if (milestone === 25 || milestone === 50 || milestone === 75 || milestone === 100) {
          trackArticleScrollDepth(milestone as 25 | 50 | 75 | 100, article.slug)
        }

        // Track article completion
        if (milestone === 100) {
          trackArticleReadComplete(article.slug, Math.round(timeToMilestone / 1000))
        }
      }
    })

    // Track engagement after 30 seconds of reading
    const timeSpent = now - tracking.startTime
    if (timeSpent > 30000 && !tracking.hasTrackedEngagement && scrollPercent > 10) {
      tracking.hasTrackedEngagement = true

      // Calculate engagement quality
      const avgReadingSpeed = tracking.readingSpeeds.reduce((a, b) => a + b, 0) / tracking.readingSpeeds.length
      const readingSections = tracking.slowScrollSections.size
      const fastScrollRatio = tracking.fastScrollCount / (timeSpent / 1000)

      event({
        action: 'engaged_reading',
        category: 'engagement',
        label: article.slug,
        value: Math.round(timeSpent / 1000)
      })

      // Detailed engagement metrics
      event({
        action: 'reading_quality',
        category: 'engagement',
        label: `sections_read_${readingSections}`,
        value: readingSections
      })

      if (fastScrollRatio > 2) {
        event({
          action: 'fast_scroll_behavior',
          category: 'bounce_indicator',
          label: article.slug,
          value: Math.round(fastScrollRatio)
        })
      }
    }
  }, [article.slug])

  // Track link clicks
  const trackLinkClick = useCallback((clickEvent: Event) => {
    const target = clickEvent.target as HTMLElement
    const link = target.closest('a')

    if (link) {
      const href = link.getAttribute('href') || ''
      const isExternal = href.startsWith('http') && !href.includes('staituned.com')
      const isInternal = href.startsWith('/') || href.includes('staituned.com')
      const isTOC = link.closest('.table-of-contents') !== null
      const isRelated = link.closest('[data-related-articles]') !== null

      let linkType = 'other'
      if (isTOC) linkType = 'toc'
      else if (isRelated) linkType = 'related_article'
      else if (isExternal) linkType = 'external'
      else if (isInternal) linkType = 'internal'

      event({
        action: 'link_click',
        category: 'engagement',
        label: `${linkType}: ${href}`,
        value: 1
      })

      // Additional tracking for external links
      if (isExternal) {
        event({
          action: 'external_link_click',
          category: 'outbound',
          label: href,
          value: 1
        })
      }
    }
  }, [])

  // Track time on page when user leaves
  const trackTimeOnPage = useCallback(() => {
    const timeSpent = Date.now() - scrollTrackingRef.current.startTime
    const maxScrolled = scrollTrackingRef.current.maxScrolled
    const tracking = scrollTrackingRef.current

    // Basic metrics
    event({
      action: 'time_on_page',
      category: 'engagement',
      label: article.slug,
      value: Math.round(timeSpent / 1000)
    })

    // Centralized tracking for GA4 consistency
    trackArticleTimeOnPage(article.slug, Math.round(timeSpent / 1000))

    event({
      action: 'max_scroll_depth',
      category: 'engagement',
      label: article.slug,
      value: maxScrolled
    })

    // Bounce detection metrics
    const isLikelyBounce = timeSpent < 10000 && maxScrolled < 25
    const isShallowRead = timeSpent < 30000 && maxScrolled < 50
    const isFastScroller = tracking.fastScrollCount > 5 && timeSpent < 60000

    if (isLikelyBounce) {
      event({
        action: 'bounce_likely',
        category: 'bounce_analysis',
        label: `quick_exit_${Math.round(timeSpent / 1000)}s`,
        value: Math.round(timeSpent / 1000)
      })
    }

    if (isShallowRead) {
      event({
        action: 'shallow_read',
        category: 'bounce_analysis',
        label: `shallow_${maxScrolled}%`,
        value: maxScrolled
      })
    }

    if (isFastScroller) {
      event({
        action: 'fast_scanner',
        category: 'bounce_analysis',
        label: `fast_scroll_${tracking.fastScrollCount}`,
        value: tracking.fastScrollCount
      })
    }

    // Content engagement analysis
    const engagementScore = Math.min(100,
      (maxScrolled * 0.4) +
      (Math.min(timeSpent / 1000, 300) * 0.3) +
      (tracking.slowScrollSections.size * 10)
    )

    event({
      action: 'engagement_score',
      category: 'content_analysis',
      label: article.slug,
      value: Math.round(engagementScore)
    })

    // Track most engaging sections
    if (tracking.slowScrollSections.size > 0) {
      event({
        action: 'engaging_sections',
        category: 'content_analysis',
        label: Array.from(tracking.slowScrollSections).join(','),
        value: tracking.slowScrollSections.size
      })
    }
  }, [article.slug])

  // Set up tracking
  useEffect(() => {
    // Track page view start
    event({
      action: 'article_view_start',
      category: 'engagement',
      label: article.slug,
      value: 1
    })

    // Track viewport and device info for bounce analysis
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 768
    }

    event({
      action: 'viewport_info',
      category: 'technical',
      label: `${viewport.width}x${viewport.height}_${viewport.isMobile ? 'mobile' : 'desktop'}`,
      value: viewport.width
    })

    // Track page load performance
    const loadTime = performance.now()
    event({
      action: 'page_load_time',
      category: 'technical',
      label: article.slug,
      value: Math.round(loadTime)
    })

    // Track if user came from search, social, direct, etc.
    const referrer = document.referrer
    let trafficSource = 'direct'
    if (referrer.includes('google')) trafficSource = 'google'
    else if (referrer.includes('linkedin')) trafficSource = 'linkedin'
    else if (referrer.includes('twitter')) trafficSource = 'twitter'
    else if (referrer.includes('facebook')) trafficSource = 'facebook'
    else if (referrer && !referrer.includes('staituned.com')) trafficSource = 'external'
    else if (referrer.includes('staituned.com')) trafficSource = 'internal'

    event({
      action: 'traffic_source',
      category: 'acquisition',
      label: trafficSource,
      value: 1
    })

    // Track early exit intent (mouse leaving viewport quickly)
    let mouseLeaveCount = 0
    const handleMouseLeave = () => {
      mouseLeaveCount++
      const timeOnPage = Date.now() - scrollTrackingRef.current.startTime

      if (timeOnPage < 10000 && mouseLeaveCount === 1) {
        event({
          action: 'early_exit_intent',
          category: 'bounce_indicator',
          label: `mouse_leave_${Math.round(timeOnPage / 1000)}s`,
          value: Math.round(timeOnPage / 1000)
        })
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    // Add scroll listener
    const handleScroll = () => {
      requestAnimationFrame(trackScrollDepth)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Add click listener for link tracking
    document.addEventListener('click', trackLinkClick)

    // Track when user leaves page
    const handleBeforeUnload = () => {
      trackTimeOnPage()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackTimeOnPage()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', trackLinkClick)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      trackTimeOnPage() // Final tracking on unmount
    }
  }, [trackScrollDepth, trackLinkClick, trackTimeOnPage, article.slug])

  const handleTOCClick = useCallback((slug: string) => {
    event({
      action: 'toc_click',
      category: 'navigation',
      label: slug,
      value: 1
    })

    const element = document.getElementById(slug) || document.getElementsByName(slug)[0]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [article.slug])

  return (
    <PageTransition>
      <ReadingProgress />
      <ReadingProgressBar />
      <section className="relative">
        {/* Mobile TOC Modal - Slide up from bottom */}
        {mounted && !isLarge && (
          <div
            className={`fixed inset-0 z-[60] flex items-end justify-center transition-all duration-300 ${showTocModal ? 'pointer-events-auto bg-black/50 backdrop-blur-sm' : 'pointer-events-none bg-transparent backdrop-blur-0'}`}
            onClick={() => setShowTocModal(false)}
            onTouchStart={handleTocTouchStart}
            onTouchMove={handleTocTouchMove}
          >
            <div
              className={`w-full max-w-2xl max-h-[80vh] bg-white dark:bg-slate-900 shadow-2xl rounded-t-3xl p-6 overflow-y-auto transform transition-all duration-300 ease-out ${showTocModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
              onClick={e => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-slate-600 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Table of Contents
                </h2>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors"
                  aria-label="Close"
                  onClick={() => setShowTocModal(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* TOC Content */}
              <div className="table-of-contents">
                <ArticleTOC
                  toc={toc}
                  enableScrollSpy={false}
                  highlightSlug={modalActiveSlug || undefined}
                  onLinkClick={slug => {
                    setModalActiveSlug(slug);
                    setShowTocModal(false);
                    setTimeout(() => {
                      handleTOCClick(slug);
                    }, 100);
                  }}
                  sticky={false}
                />
              </div>
            </div>
          </div>
        )}
        {/* Cover Image */}
        {coverImage && (
          <div className="relative w-full aspect-[16/9] lg:h-[30rem] overflow-hidden">
            <Image
              src={coverImage}
              alt="Article cover"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              unoptimized={coverImage.startsWith('http')}
            />
          </div>
        )}
        {/* Breadcrumb */}
        <div className="lg:absolute lg:top-96 top-32 p-4 z-10">
          <nav className="flex items-center space-x-2 sm:space-x-4 text-gray-900 dark:text-white w-full md:w-fit bg-white/90 dark:bg-slate-950/75 backdrop-blur-3xl shadow-xl dark:shadow-black/60 px-4 sm:px-8 py-3 rounded-2xl font-semibold overflow-x-auto scrollbar-thin scrollbar-thumb-primary-200 dark:scrollbar-thumb-secondary-400 scrollbar-track-transparent whitespace-nowrap text-xs sm:text-sm lg:text-base border border-white/60 dark:border-slate-800/70">
            <Link href="/" className="opacity-80 hover:text-primary-600 transition text-current">
              Home
            </Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <Link href="/learn" className="opacity-80 hover:text-primary-600 transition text-current">
              Learn
            </Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <Link href={`/learn/${target}`} className="opacity-80 hover:text-primary-600 transition text-current">
              {targetDisplay}
            </Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <span className="truncate max-w-[8rem] sm:max-w-xs md:max-w-md lg:max-w-lg inline-block align-bottom text-current" title={article.title}>{article.title}</span>
          </nav>
        </div>
        {/* PWA Install CTA - Top placement, same as bottom */}
        <div className="max-w-2xl mx-auto px-4 my-6">
          <PWAInstallInline variant="compact" />
        </div>
        {/* Responsive: Only render one article version at a time */}
        {/* Render desktop by default for SSR, then switch after mount */}
        {/* Use opacity to prevent flash of broken layout during hydration */}
        {!mounted || isLarge ? (
          <div className={`grid grid-cols-[5rem_1fr_20rem] gap-8 max-w-8xl mx-auto my-8 px-4 items-start transition-opacity duration-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            {/* Left: Floating Share Bar (Desktop only) */}
            <FloatingShareBar
              title={article.title}
              articleSlug={article.slug}
              description={article.seoDescription ?? article.meta ?? article.description ?? article.excerpt}
              imageUrl={coverImage}
              likes={likesCount}
              views={liveAnalytics.pageViews || 0}
              visitors={liveAnalytics.users || 0}
              isLiked={liked}
              onLike={handleLike}
              isLikeLoading={likeLoading}
              currentLikes={likesCount}
            />
            {/* Center: Main Article Content */}
            <article className="prose prose-xl max-w-4xl text-base lg:text-lg mx-auto">
              {/* Article Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 not-prose border-b border-gray-200 dark:border-slate-700 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto gap-2 sm:gap-8">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    {article.author && (
                      <AuthorAvatar author={article.author} authorData={authorData} />
                    )}
                  </div>
                  {/* Meta Info Group */}
                  <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300 text-sm divide-x divide-gray-300 dark:divide-slate-700">
                    {/* Date */}
                    <div className="flex items-center gap-1 px-2 first:pl-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {/* Reading time */}
                    <div className="flex items-center gap-1 px-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{article.readingTime}m</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto flex items-center justify-end sm:justify-center gap-2 mt-2 sm:mt-0">
                  <SaveForOfflineButton articleSlug={article.slug} />
                  <div className="w-full sm:w-auto">
                    <LikeButton
                      articleSlug={article.slug}
                      liked={liked}
                      onLike={handleLike}
                      isLoading={likeLoading}
                    />
                  </div>
                </div>
              </div>
              {/* Article Title (desktop) */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-300">
                    {article.title}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    FREE
                  </span>


                </div>
                {/* Explicit Topic Hierarchy */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-6 border-b border-gray-100 dark:border-slate-800">
                  {/* MAIN TOPIC */}
                  {article.primaryTopic && (
                    <div className="flex flex-col gap-1.5 min-w-[200px]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">
                        Main Topic
                      </span>
                      <Link
                        href={`/topics/${article.primaryTopic}`}
                        className="group flex items-center gap-3 p-2 pr-4 -ml-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-xl group-hover:scale-110 group-hover:border-primary-200 dark:group-hover:border-primary-800 transition-all">
                          {getTopicHub(article.primaryTopic)?.icon || '🧭'}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {getTopicHub(article.primaryTopic)?.name || article.primaryTopic.replace(/-/g, ' ')}
                        </span>
                      </Link>
                    </div>
                  )}

                  {/* Vertical Divider (Desktop) */}
                  <div className="hidden sm:block w-px h-12 bg-gray-100 dark:bg-slate-800" />

                  {/* RELATED CONCEPTS */}
                  {article.topics && article.topics.length > 0 && (
                    <div className="flex flex-col gap-2 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">
                        Related Concepts
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {article.topics.map((topic: string) => {
                          const hub = getTopicHub(topic)
                          const topicSlug = hub ? hub.slug : topic.toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w\-]+/g, '')
                            .replace(/\-\-+/g, '-')
                            .replace(/^-+/, '')
                            .replace(/-+$/, '')

                          const displayName = hub ? hub.name : topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

                          return (
                            <Link
                              key={topic}
                              href={`/topics/${topicSlug}`}
                              className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-primary-200 dark:hover:border-primary-800 transition-all"
                            >
                              <span className="opacity-50 mr-1.5 text-slate-400">#</span>
                              {displayName}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
                {/* Share button below title */}
                {/* <div className="flex justify-start">
                  <ShareOnLinkedIn
                    title={article.title}
                    description={article.seoDescription ?? article.meta ?? article.description ?? article.excerpt}
                    imageUrl={coverImage}
                    onShareClick={() => event({
                      action: 'share_linkedin',
                      category: 'engagement',
                      label: article.slug,
                      value: 1,
                    })}
                    onCopyClick={() => event({
                      action: 'share_copy_link',
                      category: 'engagement',
                      label: article.slug,
                      value: 1,
                    })}
                  />
                </div> */}
              </div>
              {/* Article Body */}
              <div id="article-root">
                {/* GEO Answer Layer - Above the Fold */}
                {article.geo && (
                  <GeoAnswerLayer
                    geo={article.geo}
                    articleSlug={article.slug}
                  />
                )}

                <MarkdownContent
                  content={article.body.raw}
                  className="prose prose-lg max-w-none"
                  articleSlug={article.slug}
                />
              </div>

              {/* GEO Strategic Insights - End of Article Action Plan */}
              {article.geo && (
                <GeoStrategicInsights
                  geo={article.geo}
                  articleSlug={article.slug}
                />
              )}

              {/* End of Article Engagement */}
              {/* Article FAQs */}
              <ArticleFAQ faqs={article.faq} />

              {/* End of Article Engagement - Minimalist Redesign */}
              <div className="not-prose flex flex-col items-center gap-6 my-12 py-8 border-t border-gray-100 dark:border-slate-800/50">
                <div className="flex flex-col items-center gap-2">
                  <ArticleRating articleSlug={article.slug} />
                </div>

                <div className="flex items-center gap-3">
                  <LikeButton
                    articleSlug={article.slug}
                    liked={liked}
                    onLike={handleLike}
                    isLoading={likeLoading}
                  />
                  <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 mx-1" />
                  <BookmarkButton articleSlug={article.slug} />
                </div>
              </div>
            </article>
            {/* Right: TOC Sidebar (Desktop only) */}
            <aside className="self-stretch">
              <div className="sticky top-24">
                {article.geo ? (
                  <GeoPlaybookRail
                    geo={article.geo}
                    articleSlug={article.slug}
                    toc={toc}
                    onTOCClick={handleTOCClick}
                  />
                ) : (
                  <div className="table-of-contents">
                    <ArticleTOC
                      toc={toc}
                      enableScrollSpy={true}
                      onLinkClick={handleTOCClick}
                      sticky={false}
                    />
                  </div>
                )}
              </div>
            </aside>
          </div>
        ) : (
          <>
            <SwipeNavigation
              prevArticle={relatedArticles[0] ? {
                slug: relatedArticles[0].slug,
                title: relatedArticles[0].title,
                target: relatedArticles[0].target?.toLowerCase()
              } : null}
              nextArticle={relatedArticles[1] ? {
                slug: relatedArticles[1].slug,
                title: relatedArticles[1].title,
                target: relatedArticles[1].target?.toLowerCase()
              } : null}
            >
              <div className="flex flex-col gap-6 max-w-2xl mx-auto my-6 px-4 sm:px-6 pb-24">
                {/* Floating Section Indicator */}
                <FloatingSectionIndicator toc={toc} />

                <article className="prose prose-sm max-w-2xl w-full mx-auto rounded-2xl bg-white/95 dark:bg-slate-900/90 shadow-lg ring-1 ring-gray-200/50 dark:ring-slate-700/50 p-5 sm:p-8 backdrop-blur-sm article-mobile-card">
                  {/* Article Header */}
                  <div className="flex flex-col gap-3 items-center mb-6 not-prose border-b border-gray-200 dark:border-slate-700 pb-5 text-center">
                    {/* Article Title */}
                    <h1 className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-300 mb-1 leading-tight">
                      {article.title}
                    </h1>
                    {/* FREE Badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      FREE
                    </span>
                    {/* Author */}
                    <div className="flex flex-col items-center gap-2">
                      {article.author && (
                        <AuthorAvatar author={article.author} authorData={authorData} />
                      )}
                    </div>
                    {/* Meta Info Group */}
                    <div className="flex flex-row flex-wrap items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      {/* Date */}
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      {/* Reading time */}
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{article.readingTime} min read</span>
                      </div>
                    </div>

                    {/* Topics / Hubs Links (Mobile) */}
                    {article.topics && article.topics.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mt-3 mb-1">
                        {article.topics.map((topic: string) => {
                          const topicSlug = topic.toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w\-]+/g, '')
                            .replace(/\-\-+/g, '-')
                            .replace(/^-+/, '')
                            .replace(/-+$/, '')

                          return (
                            <Link
                              key={topic}
                              href={`/topics/${topicSlug}`}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-700"
                            >
                              {topic}
                            </Link>
                          )
                        })}
                      </div>
                    )}

                    {/* KPI Stats Row */}
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-600 dark:text-gray-400">
                      {/* Views */}
                      {(liveAnalytics.pageViews || 0) >= 10 && (
                        <div className="flex items-center gap-1.5" title="Total views">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="font-medium">{liveAnalytics.pageViews}</span>
                        </div>
                      )}

                      {(liveAnalytics.pageViews || 0) >= 10 && (liveAnalytics.users || 0) >= 5 && <span className="text-gray-300 dark:text-gray-600">|</span>}

                      {/* Visitors */}
                      {(liveAnalytics.users || 0) >= 5 && (
                        <div className="flex items-center gap-1.5" title="Unique visitors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-medium">{liveAnalytics.users}</span>
                        </div>
                      )}

                      {((liveAnalytics.pageViews || 0) >= 10 || (liveAnalytics.users || 0) >= 5) && (liveAnalytics.likes || 0) >= 2 && <span className="text-gray-300 dark:text-gray-600">|</span>}

                      {/* Likes */}
                      {(liveAnalytics.likes || 0) >= 2 && (
                        <div className="flex items-center gap-1.5" title="Total likes">
                          <svg className="w-4 h-4 text-red-500 fill-red-500" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span className="font-medium">{liveAnalytics.likes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Article Body */}
                  <div
                    id="article-root"
                    className="article-mobile-markdown"
                    data-text-size={textSize}
                    data-font-family={fontFamily}
                  >
                    <MarkdownContent
                      content={article.body.raw}
                      className="prose max-w-none text-gray-800 dark:text-gray-200"
                      articleSlug={article.slug}
                    />
                  </div>

                  {/* GEO Strategic Insights - End of Article Action Plan (Mobile) */}
                  {article.geo && (
                    <GeoStrategicInsights
                      geo={article.geo}
                      articleSlug={article.slug}
                    />
                  )}

                  {/* Article FAQs (Mobile) */}
                  <div className="not-prose mt-8 border-t border-gray-100 dark:border-slate-800 pt-8">
                    <ArticleFAQ faqs={article.faq} />
                  </div>

                  {/* End of Article Engagement (Mobile) */}
                  <div className="not-prose flex flex-col items-center gap-5 mt-10 mb-8 pt-8 border-t border-gray-100 dark:border-slate-800">
                    <ArticleRating articleSlug={article.slug} />
                    <div className="flex items-center gap-3 w-full justify-center">
                      <LikeButton articleSlug={article.slug} />
                      <BookmarkButton articleSlug={article.slug} />
                    </div>
                  </div>
                </article>
              </div>
            </SwipeNavigation>

            {/* Quick Feedback Button - Outside SwipeNavigation to preserve fixed positioning */}


            {/* Continue Reading Prompt */}
            <ContinueReadingPrompt
              show={showContinuePrompt}
              scrollPercent={savedProgress?.scrollPercent || 0}
              onContinue={restorePosition}
              onDismiss={dismissPrompt}
            />

            {/* Mobile Action Bar - Outside SwipeNavigation to preserve fixed positioning */}
            <MobileActionBar
              articleSlug={article.slug}
              title={article.title}
              description={article.seoDescription ?? article.meta ?? article.description ?? article.excerpt}
              imageUrl={coverImage}
              onTocClick={() => setShowTocModal(true)}
              showToc={toc.length > 0}
              readingTime={article.readingTime}
              scrollPercent={scrollPercent}
              onTextSizeChange={setTextSize}
              currentTextSize={textSize}
              onFontFamilyChange={setFontFamily}
              currentFontFamily={fontFamily}
              onPlaybookClick={() => setShowPlaybookSheet(true)}
              hasPlaybook={!!article.geo}
            />
          </>
        )}
      </section>
      {/* Author Bio Card */}
      <div className="max-w-6xl mx-auto px-4">
        <AuthorBioCard author={article.author} authorData={authorData} />
      </div>

      {/* Role Fit Audit CTA - Primary */}
      <div className="max-w-3xl mx-auto px-4 mt-12 mb-8">
        <RoleFitAuditCTA variant="box" />
      </div>

      {/* Contributor CTA - Secondary */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <ContributorCTA source={`article:${article.slug}`} variant="inline" />
      </div>

      {/* PWA Install CTA - Strategic placement after article, before related content */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <PWAInstallInline variant="compact" />
      </div>
      {/* Back to Top Button (client component) - Hidden on mobile to avoid overlap with action bar */}
      <BackToTopButton />
      {/* Related Articles */}
      <div data-related-articles>
        <RelatedArticles relatedArticles={relatedArticles.map((post: any) => ({
          title: post.title,
          slug: post.slug,
          cover: post.cover,
          author: post.author,
          date: post.date,
          meta: post.meta,
          readingTime: post.readingTime,
          target: post.target,
          topics: post.topics
        }))} />
      </div>

      <GeoPlaybookBottomSheet
        geo={article.geo}
        articleSlug={article.slug}
        isOpen={showPlaybookSheet}
        onClose={() => setShowPlaybookSheet(false)}
      />
    </PageTransition>
  )
}
