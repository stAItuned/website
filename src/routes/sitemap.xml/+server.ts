import info from '$lib/info'

import { git } from '@lib/git'
import type { CMSData } from '@lib/interfaces'

export async function GET() {

  const data: CMSData = await git.loadData()

  return new Response(
    `
      <?xml version="1.0" encoding="UTF-8" ?>
      <urlset
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
      >
      <url>
          <loc>${info.basePath}/</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
      </url>
      <url>
      <loc>${info.basePath}/keepintouch/</loc>
      <changefreq>weekly</changefreq>
      </url>
      <url>
      <loc>${info.basePath}/meet/</loc>
      <changefreq>weekly</changefreq>
      </url>
      <url>
      <loc>${info.basePath}/learn/</loc>
      <changefreq>weekly</changefreq>
      </url>
      ${data.articles
        .map(
          (article) => `
      <url>
      <loc>${info.basePath}/learn/${article.metadata.target.toLowerCase()}/${article.slug}</loc>
      <lastmod>${new Date(article.metadata.date).toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <xhtml:link rel="alternate" hreflang="${article.metadata.language === 'Italian' ? 'it' : 'en'}" href="${info.basePath}/learn/${article.metadata.target.toLowerCase()}/${article.slug}"/>
      </url>
      `
        )
        .join('')}
      </urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  )
}
