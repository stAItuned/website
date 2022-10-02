import { siteURL } from '$lib/info'
import data from '$lib/git/index'

export async function GET() {
	

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
          <loc>${siteURL}/</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
      </url>
      <url>
      <loc>${siteURL}/keepintouch/</loc>
      <changefreq>weekly</changefreq>
      </url>
      <url>
      <loc>${siteURL}/meet/</loc>
      <changefreq>weekly</changefreq>
      </url>
      <url>
      <loc>${siteURL}/learn/</loc>
      <changefreq>weekly</changefreq>
      </url>
      ${data.articles
				.map(
					(article) => `
      <url>
      <loc>${siteURL}/learn/${article.slug}</loc>
      <lastmod>${new Date(article.metadata.date).toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
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
