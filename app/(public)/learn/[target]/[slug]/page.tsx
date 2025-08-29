import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { PageTransition } from '@/components/ui/PageTransition'
import AuthorAvatar from '@/components/AuthorAvatar'
import { MarkdownContent } from '@/components/MarkdownContent'
import { RelatedArticles } from '@/components/RelatedArticles'
import GithubSlugger from 'github-slugger'
import { ArticleTOC } from '@/components/ArticleTOC'
import { LikeButton } from '@/components/LikeButton'
import ArticleAnalyticsStats from '@/components/ArticleAnalyticsStats'
import { BackToTopButton } from '@/components/BackToTopButton'

// Force static generation per articoli
export const dynamic = 'force-static'
export const revalidate = 60*60*6 // ISR ogni 6 ore

export const dynamicParams = false

export async function generateStaticParams() {
  const params: { target: string; slug: string }[] = []
  allPosts.forEach((post) => {
    if (post.target && post.published !== false) {
      params.push({
        target: post.target.toLowerCase(),
        slug: post.slug,
      })
    }
  })
  return params
}

export async function generateMetadata({ params }: { params: { target: string; slug: string } }): Promise<Metadata> {
  const { target, slug } = params
  // Find the article
  const article = allPosts.find((post) => 
    post.slug === slug && post.target?.toLowerCase() === target.toLowerCase()
  )
  if (!article) {
    return {
      title: 'Article Not Found - stAItuned',
      description: 'The requested article could not be found.'
    }
  }
  return {
    title: `${article.title} - stAItuned`,
    description: article.meta || article.title,
    openGraph: {
      title: article.title,
      description: article.meta || article.title,
      type: 'article',
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      images: article.cover ? [{
        url: article.cover.startsWith('http') ? article.cover : `/content/articles/${article.slug}/${article.cover}`,
        alt: article.title
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.meta || article.title,
      images: article.cover ? [article.cover.startsWith('http') ? article.cover : `/content/articles/${article.slug}/${article.cover}`] : undefined,
    }
  }
}

export default function ArticlePage({ params }: { params: { target: string; slug: string } }) {
  const { target, slug } = params
  // Find the article
  const article = allPosts.find((post) => 
    post.slug === slug && post.target?.toLowerCase() === target.toLowerCase()
  )
  if (!article) {
    notFound()
  }
  // Find related articles
  const getRelatedArticles = () => {
    // Filter articles by same target, excluding current article
    let relatedArticlesByTarget = allPosts.filter((post) => 
      post.target?.toLowerCase() === target.toLowerCase() && 
      post.slug !== slug &&
      post.published !== false
    )
    // If we have topics, try to find articles with similar topics
    if (article.topics && article.topics.length > 0) {
      const relatedByTopics = relatedArticlesByTarget.filter((post) =>
        post.topics?.some((topic: string) => article.topics?.includes(topic))
      )
      if (relatedByTopics.length > 0) {
        relatedArticlesByTarget = relatedByTopics
      }
    }
    return relatedArticlesByTarget.slice(0, 5)
  }
  const relatedArticles = getRelatedArticles()
  const targetDisplay = target.charAt(0).toUpperCase() + target.slice(1)
  const getValidImageSrc = (cover?: string) => {
    if (!cover) return null
    if (cover.startsWith('http://') || cover.startsWith('https://')) {
      return cover
    }
    if (cover.startsWith('/')) {
      return cover
    }
    return `/content/articles/${article.slug}/${cover}`
  }
  const coverImage = getValidImageSrc(article.cover)
  // Extract TOC from markdown
  function extractTOC(markdown: string) {
    const lines = markdown.split('\n')
    const toc = []
    const slugger = new GithubSlugger()
    for (const line of lines) {
      const match = /^(##+)\s+(.*)/.exec(line)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const slug = slugger.slug(text)
        toc.push({ level, text, slug })
      }
    }
    return toc
  }
  const toc = extractTOC(article.body.raw)
  return (
    <PageTransition>
      <section className="relative">
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
          <nav className="flex items-center space-x-4 text-primary-500 w-full md:w-fit bg-slate-100 px-8 py-4 rounded-lg font-semibold">
            <Link href="/" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/learn" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
              Learn
            </Link>
            <span>/</span>
            <Link href={`/learn/${target}`} className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
              {targetDisplay}
            </Link>
            <span>/</span>
            <span className="text-base lg:text-xl truncate">{article.title}</span>
          </nav>
        </div>
        {/* 3-column layout */}
        <div className="hidden lg:grid grid-cols-[20rem_1fr_20rem] gap-8 max-w-8xl mx-auto my-8 px-4 min-h-screen items-start">
          {/* Left: TOC Sidebar */}
          <aside className="relative">
            <ArticleTOC toc={toc} />
          </aside>
          {/* Center: Main Article Content */}
          <article className="prose prose-xl max-w-4xl text-base lg:text-lg mx-auto">
            {/* Article Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 not-prose border-b border-gray-200 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto gap-2 sm:gap-8">
                {/* Author */}
                <div className="flex items-center gap-2">
                  {article.author && (
                    <AuthorAvatar author={article.author} />
                  )}
                </div>
                {/* Meta Info Group */}
                <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4 text-gray-600 text-sm divide-x divide-gray-300">
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
              <div className="flex-shrink-0 flex justify-end sm:justify-center mt-2 sm:mt-0">
                <LikeButton articleSlug={article.slug} />
              </div>
            </div>
            {/* Article Analytics */}
            <div className="mb-4">
              <ArticleAnalyticsStats slug={article.slug} />
            </div>
            {/* Article Title */}
            <h1 className="text-4xl font-bold mb-8 text-primary-600">
              {article.title}
            </h1>
            {/* Article Body */}
            <MarkdownContent 
              content={article.body.raw}
              className="prose prose-lg max-w-none"
              articleSlug={article.slug}
            />
          </article>
          {/* Right: Empty for future use or spacing */}
          <div />
        </div>
        {/* Fallback for mobile: stack layout */}
        <div className="lg:hidden flex flex-col gap-8 max-w-2xl mx-auto my-8 px-4">
          <article className="prose prose-xl max-w-2xl w-full mx-auto text-base lg:text-lg rounded-2xl bg-white shadow-lg p-6">
            {/* Article Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 not-prose border-b border-gray-200 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto gap-2 sm:gap-8">
                {/* Author */}
                <div className="flex items-center gap-2">
                  {article.author && (
                    <AuthorAvatar author={article.author} />
                  )}
                </div>
                {/* Meta Info Group */}
                <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4 text-gray-600 text-sm divide-x divide-gray-300">
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
              <div className="flex-shrink-0 flex justify-end sm:justify-center mt-2 sm:mt-0">
                <LikeButton articleSlug={article.slug} />
              </div>
            </div>
            {/* Article Analytics */}
            <div className="mb-4">
              <ArticleAnalyticsStats slug={article.slug} />
            </div>
            {/* Article Title */}
            <h1 className="text-4xl font-bold mb-8 text-primary-600">
              {article.title}
            </h1>
            {/* Article Body */}
            <MarkdownContent 
              content={article.body.raw}
              className="prose prose-lg max-w-none"
              articleSlug={article.slug}
            />
          </article>
        </div>
      </section>
      {/* Back to Top Button (client component) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <BackToTopButton />
      </div>
      {/* Related Articles */}
      <RelatedArticles relatedArticles={relatedArticles.map(post => ({
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
    </PageTransition>
  )
}
