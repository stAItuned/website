import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { PageTransition } from '@/components/ui/PageTransition'
import AuthorAvatar from '@/components/AuthorAvatar'
import { MarkdownContent } from '@/components/MarkdownContent'
import { RelatedArticles } from '@/components/RelatedArticles'
import { LikeButton } from '@/components/LikeButton'
import ArticleAnalyticsStats from '@/components/ArticleAnalyticsStats'

// Force static generation per articoli
export const dynamic = 'force-static'
export const revalidate = 60*60*6 // ISR ogni 6 ore

interface ArticlePageProps {
  params: {
    target: string
    slug: string
  }
}

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

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
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

export default function ArticlePage({ params }: ArticlePageProps) {
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
      
      // Use topic-based if we have enough, otherwise fall back to target-based
      if (relatedByTopics.length > 0) {
        relatedArticlesByTarget = relatedByTopics
      }
    }

    // Return maximum of 5 related articles
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

        {/* Article Content */}
        <article className="prose prose-xl max-w-4xl text-base lg:text-lg mx-auto my-8 px-4">
          {/* Article Header */}
          <div className="flex justify-between items-center mb-8 not-prose gap-4 flex-wrap">
            <div className="flex items-center flex-wrap"
                 style={{ gap: '7.5rem' }}>
              {/* Author */}
              <div className="flex items-center gap-2">
                {article.author && (
                  <AuthorAvatar author={article.author} />
                )}
              </div>
              {/* Date */}
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                <p>{new Date(article.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              {/* Reading time */}
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{article.readingTime}m</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <LikeButton articleSlug={article.slug} />
            </div>
          </div>


          {/* Article Analytics */}
          <div className="mb-4">
            <ArticleAnalyticsStats slug={article.slug} hideBounceRate />
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
      </section>

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
