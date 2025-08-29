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
import nextDynamic from 'next/dynamic'
import { getAuthorData } from '@/lib/authors'

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

export default async function ArticlePage({ params }: { params: { target: string; slug: string } }) {
  // Debug: log on mount
  console.log('[ArticlePage] MOUNTED', params)
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
  const authorData = article.author ? await getAuthorData(article.author) : null
  const ArticlePageClient = nextDynamic(() => import('./ArticlePageClient'), { ssr: false })
  return (
    <ArticlePageClient
      coverImage={coverImage}
      article={article}
      toc={toc}
      target={target}
      targetDisplay={targetDisplay}
      relatedArticles={relatedArticles}
      authorData={authorData}
    />
  )
}
