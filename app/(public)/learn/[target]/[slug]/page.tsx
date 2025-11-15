import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { extractTOC } from '@/lib/markdown-headings'
import { getAuthorData } from '@/lib/authors'
import ArticlePageClient from './ArticlePageClient'

// Force static generation per articoli
export const dynamic = 'force-static'
export const revalidate = 21600 // ISR ogni 6 ore (60*60*6)

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

export async function generateMetadata({ params }: { params: Promise<{ target: string; slug: string }> }): Promise<Metadata> {
  const { target, slug } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com';
  // Find the article
  const article = allPosts.find((post) => 
    post.slug === slug && post.target?.toLowerCase() === target.toLowerCase()
  );
  if (!article) {
    return {
      title: 'Article Not Found - stAItuned',
      description: 'The requested article could not be found.'
    };
  }
  const url = `${base}/learn/${article.target}/${article.slug}`;
  
  // Use actual cover image if available, otherwise generated OG image
  // Note: article.imagePath contains the correct path to the article directory
  const ogImage = article.cover 
    ? `${base}${article.imagePath}/${article.cover}`
    : `${base}/api/og/article/${article.slug}.png`;
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.meta ?? article.title,
    alternates: { canonical: url },
    openGraph: {
      url,
      type: 'article',
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.meta ?? article.title,
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      images: [{ 
        url: ogImage, 
        alt: article.title,
        width: 1200,
        height: 630,
        type: 'image/png'
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.meta ?? article.title,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ target: string; slug: string }> }) {
  const { target, slug } = await params
  // Debug: log on mount
  console.log('[ArticlePage] MOUNTED', { target, slug })
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
  // Extract TOC from markdown using shared function
  const toc = extractTOC(article.body.raw)
  const authorData = article.author ? await getAuthorData(article.author) : null
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
