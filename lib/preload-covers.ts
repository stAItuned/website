import { allPosts, type ContentPost } from '@/lib/contentlayer'
import { getContentDateTime } from '@/lib/content-date'

// Extract cover images for preloading
export function getArticleCoversForPreload() {
  // Recent articles
  const recentArticles = allPosts
    .filter(post => post.published !== false)
    .sort((a, b) => {
      return getContentDateTime(b.date, b.updatedAt) - getContentDateTime(a.date, a.updatedAt)
    })
    .slice(0, 4); // Reduced from 8 to 4 to prevent optimizer overload

  // Relevant articles
  const relevantArticleSlugs = [
    'imarena-ai-benchmarking-platform',
    'deepseek-v3-open-source-ai',
    'large-concept-model-meta',
    'google-ai-studio-guide',
    'modernbert-transformer-innovations',
    'gartner-hype-cycle-generative-ai-2024',
    'deep-learning-pytorch-template',
    'ai-for-breast-cancer-diagnosis',
  ];

  const relevantArticles = relevantArticleSlugs
    .map(slug => allPosts.find(post => post.slug.includes(slug)))
    .filter((article): article is ContentPost => Boolean(article))
    .slice(0, 4); // Reduced from 8 to 4

  // Extract valid covers
  const getValidImageSrc = (article: ContentPost) => {
    if (!article.cover) return null
    
    // If it's already a valid absolute URL, return as is
    if (article.cover.startsWith('http://') || article.cover.startsWith('https://')) {
      return article.cover
    }
    
    // If it's already an absolute path, return as is
    if (article.cover.startsWith('/')) {
      return article.cover
    }
    
    // If it's a relative path, convert to absolute path
    return `/content/articles/${article.slug}/${article.cover}`
  }

  const recentCovers = recentArticles
    .map(getValidImageSrc)
    .filter((cover): cover is string => Boolean(cover))
    .slice(0, 3); // Reduced from 6 to 3

  const relevantCovers = relevantArticles
    .map(getValidImageSrc)
    .filter((cover): cover is string => Boolean(cover))
    .slice(0, 3); // Reduced from 6 to 3

  // Combine and deduplicate
  const coversSet = new Set([...recentCovers, ...relevantCovers])
  const allCovers = Array.from(coversSet)
  
  return allCovers.slice(0, 5); // Reduced from 10 to 5 total preloads
}
