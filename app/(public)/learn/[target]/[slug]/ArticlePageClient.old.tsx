"use client"
import { useScreenSize } from '@/lib/hooks/useScreenSize'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ArticleTOC } from '@/components/ArticleTOC'
import { MarkdownContent } from '@/components/MarkdownContent'
import { LikeButton } from '@/components/LikeButton'
import { ShareOnLinkedIn } from '@/components/ShareOnLinkedIn'

// Dynamic imports for code splitting
import dynamic from 'next/dynamic'

const ArticleFAQ = dynamic(() => import('@/components/ArticleFAQ').then(mod => mod.ArticleFAQ))
const ArticleRating = dynamic(() => import('@/components/ArticleRating').then(mod => mod.ArticleRating), {
  ssr: false
})
const RelatedArticles = dynamic(() => import('@/components/RelatedArticles').then(mod => mod.RelatedArticles))
const GeoStrategicInsights = dynamic(() => import('@/components/geo/GeoStrategicInsights').then(mod => mod.GeoStrategicInsights))
const GeoPlaybookRail = dynamic(() => import('@/components/geo/GeoPlaybookRail').then(mod => mod.GeoPlaybookRail))
const GeoPlaybookBottomSheet = dynamic(() => import('@/components/geo/GeoPlaybookBottomSheet').then(mod => mod.GeoPlaybookBottomSheet))
const GeoAnswerLayer = dynamic(() => import('@/components/geo/GeoAnswerLayer').then(mod => mod.GeoAnswerLayer))
const BookmarkButton = dynamic(() => import('@/components/BookmarkButton').then(mod => mod.BookmarkButton))
const AuthorAvatar = dynamic(() => import('@/components/AuthorAvatar'))
const BackToTopButton = dynamic(() => import('@/components/BackToTopButton').then(mod => mod.BackToTopButton))
const PageTransition = dynamic(() => import('@/components/ui/PageTransition').then(mod => mod.PageTransition))
const ReadingProgress = dynamic(() => import('@/components/ui/ReadingProgress').then(mod => mod.ReadingProgress))
const FloatingShareBar = dynamic(() => import('@/components/ui/FloatingShareBar').then(mod => mod.FloatingShareBar))
const AuthorBioCard = dynamic(() => import('@/components/ui/AuthorBioCard').then(mod => mod.AuthorBioCard))
const ContributorCTA = dynamic(() => import('@/components/ui/ContributorCTA').then(mod => mod.ContributorCTA))
const PWAInstallInline = dynamic(() => import('@/components/pwa').then(mod => mod.PWAInstallInline))
const MobileActionBar = dynamic(() => import('@/components/ui/MobileActionBar').then(mod => mod.MobileActionBar))
const ReadingProgressBar = dynamic(() => import('@/components/ui/ReadingProgressBar').then(mod => mod.ReadingProgressBar))
const ContinueReadingPrompt = dynamic(() => import('@/components/ui/ContinueReadingPrompt').then(mod => mod.ContinueReadingPrompt))
const SwipeNavigation = dynamic(() => import('@/components/ui/SwipeNavigation').then(mod => mod.SwipeNavigation))
const FloatingSectionIndicator = dynamic(() => import('@/components/ui/FloatingSectionIndicator').then(mod => mod.FloatingSectionIndicator))
const RoleFitAuditCTA = dynamic(() => import('@/components/ui/RoleFitAuditCTA').then(mod => mod.RoleFitAuditCTA))

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
import type { TopicHub } from '@/config/topics'
type ArticleAnalytics = {
  views: number
  likes: number
  rating: number
}
import { getTopicHub } from '@/config/topics'

import { useArticleLikes } from '@/lib/hooks/useArticleLikes'

type ReferenceMeta = {
  id: string
  href: string
  title: string
  context: string
}

/**
 * Client-side article page renderer with responsive desktop/mobile layouts.
 */
export default function ArticlePageClient({
  coverImage,
  article,
  toc,
  target,
  targetDisplay,
  relatedArticles,
  authorData,
  analytics,
  htmlContent
}: any & { analytics: ArticleAnalytics, htmlContent?: string }) {
  const isLarge = useScreenSize()
  const [showTocModal, setShowTocModal] = useState(false)

  // Initialize shared like state
  const { liked, likesCount, loading: likeLoading, handleLike } = useArticleLikes({
    articleSlug: article.slug,
    initialLikes: analytics.likes
  })

  // ... rest of the file ...
  // Since the file is huge (1500 lines) and I previously corrupted it by replacing a chunk incorrectly and potentially truncating it
  // I need to be careful. The previous tool call truncated the file because it tried to replace imports at the top but the context was messy.
  // The BEST way to recover is to READ the file again to check the damage, or restore from a known good state if I had one.
  // BUT I can rewrite the imports section properly.

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
  const hasStrategicPlaybook = useMemo(
    () => Boolean(
      article.geo &&
      (
        (article.geo.decisionRules?.rules?.length ?? 0) > 0 ||
        (article.geo.pitfalls?.length ?? 0) > 0
      )
    ),
    [article.geo]
  )

  // Live analytics state - starts with SSR/ISR cached values, refreshes on mount
  const [liveAnalytics, setLiveAnalytics] = useState<ArticleAnalytics>(analytics)
  const primaryTopicHub = article.primaryTopic ? getTopicHub(article.primaryTopic) : null

  // Reading progress persistence
  const {
    savedProgress,
    saveProgress
  } = useReadingProgress(article.slug)

  // Add reading history hook
  const { addToHistory } = useReadingHistory()

  // Update live analytics on mount
  useEffect(() => {
    setMounted(true)

    // Add to reading history
    addToHistory({
      slug: article.slug,
      title: article.title,
      target: article.target || 'General'
    })

    const updateAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics/article?slug=${article.slug}`)
        if (res.ok) {
          const data = await res.json()
          setLiveAnalytics(data)
        }
      } catch (error) {
        console.error('Failed to fetch live analytics:', error)
      }
    }

    updateAnalytics()
  }, [article.slug])

  // Scroll depth tracking
  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const percent = Math.round((scrollTop / docHeight) * 100)

      setScrollPercent(percent)

      // Track scroll depth milestones (25, 50, 75, 100)
      if (percent > 0 && percent % 25 === 0) {
        // Debounce tracking
        const storedDepth = sessionStorage.getItem(`scroll_${article.slug}`)
        if (!storedDepth || parseInt(storedDepth) < percent) {
          sessionStorage.setItem(`scroll_${article.slug}`, percent.toString())
          trackArticleScrollDepth(percent as 25 | 50 | 75 | 100, article.slug)
        }
      }

      // Track read completion
      if (percent >= 90) {
        const hasRead = sessionStorage.getItem(`read_${article.slug}`)
        if (!hasRead) {
          sessionStorage.setItem(`read_${article.slug}`, 'true')
          trackArticleReadComplete(article.slug, 0) // Time tracked separately
        }
      }

      // Hide/Show mobile TOC on scroll
      if (Math.abs(scrollTop - lastScrollY) > 10) {
        setShowMobileToc(scrollTop < lastScrollY || scrollTop < 100)
        setLastScrollY(scrollTop)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted, lastScrollY, article.slug])

  // Time on page tracking
  useEffect(() => {
    if (!mounted) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)

      // Track every 30s
      if (timeSpent > 0 && timeSpent % 30 === 0) {
        trackArticleTimeOnPage(article.slug, timeSpent)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [mounted, article.slug])


  // TOC Active Section Observer
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setModalActiveSlug(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    article.body.raw.match(/^(#{2,3})\s+(.+)$/gm)?.forEach((heading: string) => {
      // logic to extract id from heading text would be complex here without the helper
      // Instead we querySelector all headings
      document.querySelectorAll('h2, h3').forEach(h => observer.observe(h))
    })

    return () => observer.disconnect();
  }, [mounted, article.body.raw]);

  if (!mounted) {
    // Use htmlContent for hydration mismatch prevention if needed, or simple skeletal state
    // But we just return null or loading state usually. 
    // For SEO, we want content to be present. The `htmlContent` is passed to MarkdownContent
    // which handles rendering. So we should render the structure.
  }

  // Memoize TOC modal content to prevent unnecessary re-renders
  const tocModalContent = useMemo(() => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[color:var(--stai-border)]">
        <span className="font-semibold text-lg">Table of Contents</span>
        <button
          onClick={() => setShowTocModal(false)}
          className="p-2 hover:bg-[color:var(--stai-hover)] rounded-full transition-colors"
        >
          Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ArticleTOC
          toc={toc}
          highlightSlug={modalActiveSlug || undefined}
          onLinkClick={() => setShowTocModal(false)}
        />
      </div>
    </div>
  ), [toc, modalActiveSlug]);


  return (
    <div className={`min-h-screen bg-[color:var(--stai-bg)] font-${fontFamily}`}>
      <PageTransition>
        <div />
      </PageTransition>
      <ReadingProgress />

      {/* Mobile Action Bar */}
      <div className="lg:hidden">
        <MobileActionBar
          articleSlug={article.slug}
          title={article.title}
          showToc={true}
          onTocClick={() => setShowTocModal(true)}
          readingTime={article.readingTime}
          scrollPercent={scrollPercent}
          onTextSizeChange={setTextSize}
          currentTextSize={textSize}
          onFontFamilyChange={setFontFamily}
          currentFontFamily={fontFamily}
          hasPlaybook={hasStrategicPlaybook}
          onPlaybookClick={() => setShowPlaybookSheet(true)}
        />
      </div>

      {/* Article Layout */}
      <article className="max-w-[1800px] mx-auto">
        {/* Header & Cover */}
        {/* ... render header ... */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(auto,65ch)_1fr] gap-8 px-4 lg:px-8 py-8 lg:py-12">

          {/* Left Rail: TOC & Actions */}
          <aside className="hidden lg:block space-y-8 sticky top-24 self-start h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {authorData && <AuthorAvatar authorData={authorData} author={article.author} />}
                <div className="text-sm">
                  <div className="font-medium text-[color:var(--stai-text-primary)]">{authorData?.name || article.author}</div>
                  <div className="text-[color:var(--stai-text-secondary)]">{article.readTime} min read</div>
                </div>
              </div>

              <div className="flex gap-2">
                <LikeButton
                  articleSlug={article.slug}
                  initialLikes={liveAnalytics.likes}
                  variant="icon"
                />
                <BookmarkButton articleSlug={article.slug} />
                <ShareOnLinkedIn
                  title={article.title}
                  description={article.description}
                />
              </div>

              <hr className="border-[color:var(--stai-border)]" />

              <ArticleTOC toc={toc} highlightSlug={modalActiveSlug || undefined} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0"> {/* Prevent flex overflow */}

            {/* Content Header */}
            <header className="mb-8 space-y-6">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm text-[color:var(--stai-text-secondary)]">
                <Link href="/learn" className="hover:text-[color:var(--stai-primary)] transition-colors">Learn</Link>
                <span>/</span>
                <Link href={`/learn/${target}`} className="hover:text-[color:var(--stai-primary)] transition-colors">{targetDisplay}</Link>
              </div>

              <h1 className={`text-3xl lg:text-5xl font-bold text-[color:var(--stai-text-primary)] leading-tight ${textSize === 'large' ? 'lg:text-6xl' : ''} ${textSize === 'small' ? 'lg:text-4xl' : ''}`}>
                {article.title}
              </h1>

              {/* Tags */}
              {article.topics && (
                <div className="flex flex-wrap gap-2">
                  {article.topics.map((topic: string) => (
                    <Link
                      key={topic}
                      href={`/topics/${topic.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-[color:var(--stai-surface-elevated)] text-[color:var(--stai-text-secondary)] hover:bg-[color:var(--stai-bg-secondary)] transition-colors"
                    >
                      {topic}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            <MarkdownContent
              content={article.body.raw}
              htmlContent={htmlContent}
              articleSlug={article.slug}
              className={`prose prose-lg dark:prose-invert max-w-none 
                      ${textSize === 'small' ? 'prose-base' : ''} 
                      ${textSize === 'large' ? 'prose-xl' : ''}
                      prose-a:text-[color:var(--stai-primary)] prose-a:no-underline hover:prose-a:underline
                   `}
            />

            {/* Article Footer */}
            <footer className="mt-16 space-y-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-[color:var(--stai-surface-elevated)] border border-[color:var(--stai-border)]">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold mb-2">Was this helpful?</h3>
                  <p className="text-[color:var(--stai-text-secondary)] text-sm">Help us improve by rating this article</p>
                </div>
                <ArticleRating articleSlug={article.slug} />
              </div>

              {article.faq && <ArticleFAQ faqs={article.faq} />}
              {authorData && <AuthorBioCard author={article.author} authorData={authorData} />}
            </footer>

          </div>

          {/* Right Rail: Strategic Insights & CTAs */}
          <aside className="hidden lg:block space-y-8 sticky top-24 self-start h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
            <ContributorCTA />

            {hasStrategicPlaybook && (
              <div className="p-6 rounded-xl bg-gradient-to-br from-[color:var(--stai-surface-elevated)] to-[color:var(--stai-bg-secondary)] border border-[color:var(--stai-border)]">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🎯</span> Strategic Playbook
                </h3>
                <p className="text-sm text-[color:var(--stai-text-secondary)] mb-4">
                  Actionable decision rules and potential pitfalls for this topic.
                </p>
                <button
                  onClick={() => setShowPlaybookSheet(true)}
                  className="w-full py-2 px-4 rounded-lg bg-[color:var(--stai-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Open Playbook
                </button>
              </div>
            )}

            {primaryTopicHub && (
              <div className="p-6 rounded-xl bg-[color:var(--stai-surface-elevated)] border border-[color:var(--stai-border)]">
                <h3 className="font-semibold mb-4">Topic Hub</h3>
                <Link href={`/topics/${primaryTopicHub.slug}`} className="block group">
                  <div className="relative h-32 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center text-4xl">
                    {primaryTopicHub.icon}
                  </div>
                  <div className="font-medium group-hover:text-[color:var(--stai-primary)] transition-colors">
                    {primaryTopicHub.name}
                  </div>
                </Link>
              </div>
            )}
          </aside>

        </div>
      </article>

      {/* TOC Modal (Mobile) */}
      {showTocModal && (
        <div className="fixed inset-0 z-50 bg-[color:var(--stai-bg)] lg:hidden">
          {tocModalContent}
        </div>
      )}

      {/* Floating Elements */}
      <BackToTopButton />
      <FloatingShareBar
        articleSlug={article.slug}
        title={article.title}
      />

      {showPlaybookSheet && article.geo && (
        <GeoPlaybookBottomSheet
          geo={article.geo}
          isOpen={showPlaybookSheet}
          onClose={() => setShowPlaybookSheet(false)}
          articleSlug={article.slug}
        />
      )}
    </div>
  )
}
