"use client"
import { useScreenSize } from '@/lib/hooks/useScreenSize'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ArticleTOC } from '@/components/ArticleTOC'
import { MarkdownContent } from '@/components/MarkdownContent'
import { LikeButton } from '@/components/LikeButton'
import ArticleAnalyticsStats from '@/components/ArticleAnalyticsStats'
import AuthorAvatar from '@/components/AuthorAvatar'
import { BackToTopButton } from '@/components/BackToTopButton'
import { PageTransition } from '@/components/ui/PageTransition'
import { RelatedArticles } from '@/components/RelatedArticles'
import { ShareOnLinkedIn } from '@/components/ShareOnLinkedIn'
import { ReadingProgress, EstimatedTimeRemaining } from '@/components/ui/ReadingProgress'
import { FloatingShareBar } from '@/components/ui/FloatingShareBar'
import { AuthorBioCard } from '@/components/ui/AuthorBioCard'
import { event } from '@/lib/gtag'
import Link from 'next/link'
import Image from 'next/image'
import type { ArticleAnalytics } from '@/lib/analytics-server'

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
  const [modalActiveSlug, setModalActiveSlug] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showMobileToc, setShowMobileToc] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  // Fix hydration mismatch by only rendering responsive UI after mount
  useEffect(() => {
    setMounted(true)
  }, [])
  
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
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted, isLarge, lastScrollY])
  
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
      <section className="relative">
        {/* Mobile TOC Hamburger Button (below header logo) */}
        {mounted && !isLarge && toc.length > 0 && (
          <button
            className={`fixed left-4 top-20 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 text-primary-600 dark:text-primary-400 focus:outline-none transition-all duration-300 hover:bg-primary-50 dark:hover:bg-slate-700 ${
              showMobileToc ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0 pointer-events-none'
            }`}
            aria-label="Open Table of Contents"
            onClick={() => {
              setModalActiveSlug(null);
              setShowTocModal(true);
              
              // Track mobile TOC open
              event({
                action: 'mobile_toc_open',
                category: 'navigation',
                label: article.slug,
                value: 1
              })
            }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        )}
        {/* Mobile TOC Modal with animation and blur */}
        {mounted && !isLarge && (
          <div
            className={`fixed inset-0 z-50 flex items-start justify-start transition-all duration-300 ${showTocModal ? 'pointer-events-auto bg-black/40 backdrop-blur-sm' : 'pointer-events-none bg-transparent backdrop-blur-0'}`}
            style={{ transitionProperty: 'background,backdrop-filter' }}
            onClick={() => setShowTocModal(false)}
          >
            <div
              className={`w-full max-w-xs h-full bg-white shadow-2xl rounded-t-2xl p-4 overflow-y-auto relative transform transition-all duration-300 ${showTocModal ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
              style={{ transitionProperty: 'transform,opacity' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 p-2 rounded-full hover:bg-primary-50 text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors duration-200 shadow"
                aria-label="Close TOC"
                onClick={() => setShowTocModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="mb-4 text-lg font-bold text-primary-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
                Table of Contents
              </div>
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
                    }, 250);
                  }}
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
        {/* Responsive: Only render one article version at a time */}
        {/* Render desktop by default for SSR, then switch after mount */}
        {!mounted || isLarge ? (
          <div className="grid grid-cols-[5rem_1fr_20rem] gap-8 max-w-8xl mx-auto my-8 px-4 items-start">
            {/* Left: Floating Share Bar (Desktop only) */}
            <FloatingShareBar
              title={article.title}
              articleSlug={article.slug}
              description={article.seoDescription ?? article.meta ?? article.description ?? article.excerpt}
              imageUrl={coverImage}
              likes={analytics.likes || 0}
              views={analytics.views || 0}
              visitors={analytics.visitors || 0}
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
                <div className="flex-shrink-0 w-full sm:w-auto flex justify-end sm:justify-center mt-2 sm:mt-0">
                  <div className="w-full sm:w-auto">
                    <LikeButton articleSlug={article.slug} />
                  </div>
                </div>
              </div>
              {/* Article Title (desktop) */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-300 mb-4">
                  {article.title}
                </h1>
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
                <MarkdownContent 
                  content={article.body.raw}
                  className="prose prose-lg max-w-none"
                  articleSlug={article.slug}
                />
              </div>
            </article>
            {/* Right: TOC Sidebar (Desktop only) */}
            <aside className="self-stretch">
              <div className="sticky top-24">
                <div className="table-of-contents">
                  <ArticleTOC 
                    toc={toc} 
                    enableScrollSpy={true}
                    onLinkClick={handleTOCClick}
                    sticky={false}
                  />
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="flex flex-col gap-10 max-w-2xl mx-auto my-10 px-4 sm:px-6 md:px-8">
            <article className="article-mobile-card prose prose-sm sm:prose-base max-w-2xl w-full mx-auto text-[0.72rem] leading-5 sm:text-[0.8rem] sm:leading-6 md:text-[0.9rem] lg:text-base rounded-[28px] bg-white/90 dark:bg-slate-900/80 shadow-2xl ring-1 ring-primary-100/60 dark:ring-primary-700/40 p-6 sm:p-10 backdrop-blur-xl">
              {/* Article Header */}
              <div className="flex flex-col gap-4 items-center mb-8 not-prose border-b border-gray-200 dark:border-slate-700 pb-4 text-center">
                {/* Author */}
                <div className="flex flex-col items-center gap-1 justify-center">
                  {article.author && (
                    <AuthorAvatar author={article.author} authorData={authorData} />
                  )}
                </div>
                {/* Article Title */}
                <h1 className="text-2xl sm:text-4xl font-bold text-primary-600 dark:text-primary-300 mb-2 mt-2 leading-tight">
                  {article.title}
                </h1>
                {/* Meta Info Group */}
                <div className="flex flex-row flex-wrap items-center justify-center gap-3 text-gray-600 dark:text-gray-300 text-sm divide-x divide-gray-300 dark:divide-slate-700">
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
                {/* Like Button */}
                <div className="flex justify-center mt-2">
                  <LikeButton articleSlug={article.slug} />
                </div>
              </div>
              {/* Article Analytics */}
              <div className="mb-6 flex flex-col gap-1">
                <ArticleAnalyticsStats slug={article.slug} initialAnalytics={analytics} />
              </div>
              {/* Share button below analytics */}
              <div className="flex justify-center mb-6">
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
              </div>
              {/* Article Body */}
              <div id="article-root">
                <MarkdownContent 
                  content={article.body.raw}
                  className="prose prose-sm sm:prose-base md:prose-lg max-w-none article-mobile-markdown"
                  articleSlug={article.slug}
                />
              </div>
            </article>
          </div>
        )}
      </section>
      {/* Author Bio Card */}
      <div className="max-w-6xl mx-auto px-4">
        <AuthorBioCard author={article.author} authorData={authorData} />
      </div>
      {/* Back to Top Button (client component) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <BackToTopButton />
      </div>
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
    </PageTransition>
  )
}
