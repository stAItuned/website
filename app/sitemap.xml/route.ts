import { NextResponse } from 'next/server'
import { allPosts } from '@/lib/contentlayer'

// Helper function to escape XML special characters
function escapeXml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function GET() {
  const baseUrl = 'https://staituned.com'
  
  // Get all published articles
  const publishedPosts = allPosts.filter(post => post.published !== false)
  
  // Get unique authors
  const uniqueAuthors = Array.from(new Set(
    publishedPosts
      .filter(post => post.author)
      .map(post => post.author!)
  ))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/meet/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/learn/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/author/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  ${uniqueAuthors
    .map(authorName => `<url>
    <loc>${baseUrl}/author/${authorName.replaceAll(' ', '-')}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`)
    .join('\n  ')}
  ${publishedPosts
    .map(post => {
      const coverUrl = post.cover 
        ? (post.cover.startsWith('http') 
          ? post.cover 
          : `${baseUrl}/cms/articles/${post.slug}/${post.cover.replace('./', '')}`)
        : null
      
      return `<url>
    <loc>${baseUrl}/learn/${(post.target || 'general').toLowerCase()}/${post.slug}/</loc>
    <lastmod>${new Date(post.date || new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link
      rel="alternate"
      hreflang="${post.language === 'Italian' ? 'it' : 'en'}"
      href="${baseUrl}/learn/${(post.target || 'general').toLowerCase()}/${post.slug}/"
    />
    ${coverUrl ? `<image:image>
      <image:loc>${escapeXml(coverUrl)}</image:loc>
      <image:title>${escapeXml(post.title || '')}</image:title>
    </image:image>` : ''}
  </url>`
    })
    .join('\n  ')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
