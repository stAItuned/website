import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import GithubSlugger from 'github-slugger'
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
  const { target, slug } = params;
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
