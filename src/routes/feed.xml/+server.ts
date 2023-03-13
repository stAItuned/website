import info from '@lib/info'

import { git } from '@lib/git'
import type { CMSData } from '@lib/interfaces'

export async function GET() {
	const data = await git.loadData()
	const body = generateXML(data.articles)

	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=300',
		'Content-Type': 'application/xml'
	}
	return new Response(body, {
		headers
	})
}

const generateXML = (articles: CMSData['articles']) =>
	`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
    <title>${info.siteName}</title>
    <link>${info.basePath}</link>
    <description>${info.longDescription}</description>
	<atom:link rel="self" type="application/rss+xml"> href="${info.basePath}/feed.xml"></atom:link>

    ${articles
			.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
			.map(
				(article) => `\t<item>
    <title>${article.metadata.title}</title>
    <link>${encodeURI(
			`${info.basePath}/learn/${article.metadata.target.toLowerCase()}/${article.slug}`
		)}</link>
	<guid>${encodeURI(
		`${info.basePath}/learn/${article.metadata.target.toLowerCase()}/${article.slug}`
	)}</guid>
	<author>${article.metadata.author}</author>
    <pubDate>${new Date(article.metadata.date).toUTCString()}</pubDate>
    <description>${article.metadata.meta}</description>
	${article.metadata.topics.map((topic) => `<category>${topic}</category>`).join('\n\t')}
	</item>
    `
			)
			.join('')}
</channel>
</rss>`.trim()
