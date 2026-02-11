
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { extractTOC } from '@/lib/markdown-headings'
import { getAuthorData } from '@/lib/authors'
import { fetchArticleAnalytics } from '@/lib/analytics-server'
import ArticlePageClient from '@/app/(public)/learn/[target]/[slug]/ArticlePageClient'
import { renderMarkdownToHtml } from '@/lib/markdown-server'
import { isValidPreviewToken } from '@/lib/config/preview-config'

// SEO Structured Data
import { JsonLd } from '@/components/seo/JsonLd'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/seo-schemas'

// Force dynamic rendering (no caching)
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params, searchParams }: { params: Promise<{ target: string; slug: string }>, searchParams: Promise<{ token?: string }> }): Promise<Metadata> {
    const { target, slug } = await params;
    const { token } = await searchParams;

    // No indexing for preview pages
    return {
        title: 'Preview Article - stAItuned',
        robots: {
            index: false,
            follow: false,
        }
    };
}

export default async function PreviewArticlePage({ params, searchParams }: { params: Promise<{ target: string; slug: string }>, searchParams: Promise<{ token?: string }> }) {
    const { target, slug } = await params
    const { token } = await searchParams

    // Validate token
    if (!isValidPreviewToken(token || null)) {
        return notFound()
    }

    // Find the article - NOTE: We do NOT filter by published status here
    const article = allPosts.find((post) =>
        post.slug === slug && post.target?.toLowerCase() === target.toLowerCase()
    )

    if (!article) {
        notFound()
    }

    // Find related articles (only published ones for related)
    const getRelatedArticles = () => {
        let relatedArticlesByTarget = allPosts.filter((post) =>
            post.target?.toLowerCase() === target.toLowerCase() &&
            post.slug !== slug &&
            post.published !== false
        )
        if (article.topics && article.topics.length > 0) {
            const relatedByTopics = relatedArticlesByTarget.filter((post) =>
                post.topics?.some((topic: string) => article.topics?.includes(topic)) // Fixed: explicitly type topic as string
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
    const toc = extractTOC(article.body.raw)
    const htmlContent = renderMarkdownToHtml(article.body.raw)
    const authorData = article.author ? await getAuthorData(article.author) : null
    const analytics = await fetchArticleAnalytics(slug)

    // Generate Article JSON-LD (even for preview)
    const articleSchema = generateArticleSchema({
        title: article.seoTitle ?? article.title,
        description: article.seoDescription ?? article.meta ?? article.title,
        slug: article.slug,
        author: article.author ?? 'stAItuned',
        datePublished: article.date,
        dateModified: article.date,
        image: coverImage || undefined,
        section: article.target,
        keywords: article.topics,
        readingTime: article.readTime,
    })

    // Breadcrumb schema
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Learn', url: '/learn' },
        { name: targetDisplay, url: `/learn/${target}` },
        { name: `[PREVIEW] ${article.title}`, url: `/preview/${target}/${slug}` },
    ])

    return (
        <>
            <JsonLd data={articleSchema} />
            <JsonLd data={breadcrumbSchema} />
            {article.structuredData && <JsonLd data={article.structuredData} />}

            <ArticlePageClient
                coverImage={coverImage}
                article={article}
                toc={toc}
                target={target}
                targetDisplay={targetDisplay}
                relatedArticles={relatedArticles}
                authorData={authorData}
                analytics={analytics}
                htmlContent={htmlContent}
                isPreview={true}
            />
        </>
    )
}
