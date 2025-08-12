import { MetadataRoute } from 'next'
import { allPosts } from '@/lib/contentlayer'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://staituned.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/meet`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/author`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic article pages
  const articlePages = allPosts
    .filter(post => post.published !== false)
    .map(post => ({
      url: `${baseUrl}/learn/${(post.target || 'general').toLowerCase()}/${post.slug}`,
      lastModified: new Date(post.date || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  // Dynamic author pages
  const uniqueAuthors = Array.from(new Set(
    allPosts
      .filter(post => post.published !== false && post.author)
      .map(post => post.author!)
  ))
  
  const authorPages = uniqueAuthors.map(authorName => ({
    url: `${baseUrl}/author/${authorName.replaceAll(' ', '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...articlePages, ...authorPages]
}
