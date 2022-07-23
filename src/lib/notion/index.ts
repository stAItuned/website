import marked from 'marked'
import { CONFIG } from '@config'
import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import type { Article, ArticleMeta } from './types'
export * from './types'

// Initializing a client
const notion = new Client({
	auth: import.meta.env.VITE_NOTION_API_KEY
})

const n2m = new NotionToMarkdown({ notionClient: notion })

export async function getArticleMetas() {
	const rawArticles = await notion.databases.query({
		database_id: CONFIG.notion.articlesDatabaseId
	})

	const articleMetas = Promise.all(
		rawArticles.results.map(async (raw) => {
			const mdblocks = await n2m.pageToMarkdown(raw.id)
			const mdString = n2m.toMarkdownString(mdblocks)
			const parsedContent = marked.parse(mdString)

			//console.log(JSON.stringify(raw, null, 4))

			const authorPage = await notion.pages.retrieve({
				page_id: raw?.properties?.Author?.relation[0].id
			})

			const author = authorPage?.properties?.Name.title[0].plain_text

			//console.log(JSON.stringify(raw, null, 4))

			return {
				author,
				title: raw?.properties?.Name?.title[0]?.plain_text,
				tags: raw?.properties?.Topic.multi_select.map((x) => x.name),
				slug: raw?.properties?.Slug?.rich_text[0]?.plain_text,
				description: raw?.properties?.Description?.rich_text[0]?.plain_text,
				publishDate: raw?.properties['Publish Date'].date?.start
			} as ArticleMeta
		})
	)

	return articleMetas
}

export async function getArticleBySlug(slug: string) {
	const rawArticles = await notion.databases.query({
		database_id: CONFIG.notion.articlesDatabaseId,
		filter: {
			property: 'Slug',
			rich_text: {
				equals: slug
			}
		}
	})

	const raw = rawArticles.results[0]

	const mdblocks = await n2m.pageToMarkdown(raw.id)
	const mdString = n2m.toMarkdownString(mdblocks)
	const parsedContent = marked.parse(mdString)

	const article = {
		meta: {
			title: raw?.properties?.Name?.title[0]?.plain_text,
			tags: raw?.properties?.Topic.multi_select.map((x) => x.name),
			slug: raw?.properties?.Slug?.rich_text[0]?.plain_text,
			description: raw?.properties?.Description?.rich_text[0]?.plain_text
		},
		parsedContent
	} as Article

	return article
}
