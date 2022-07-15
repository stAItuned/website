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
	console.log(import.meta.env.VITE_NOTION_API_KEY)

	const rawArticles = await notion.databases.query({
		database_id: CONFIG.notion.articlesDatabaseId
	})

	const articleMetas = Promise.all(
		rawArticles.results.map(async (raw) => {
			const mdblocks = await n2m.pageToMarkdown(raw.id)
			const mdString = n2m.toMarkdownString(mdblocks)
			const parsedContent = marked.parse(mdString)

			return {
				title: raw?.properties?.Name?.title[0]?.plain_text,
				tags: raw?.properties?.Tags.multi_select.map((x) => x.name),
				slug: raw?.properties?.Slug?.rich_text[0]?.plain_text,
				description: raw?.properties?.Description?.rich_text[0]?.plain_text
			} as ArticleMeta
		})
	)

	return articleMetas
}

export async function getArticleBySlug(slug: string) {
	console.log(import.meta.env.VITE_NOTION_API_KEY)

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
		title: raw?.properties?.Name?.title[0]?.plain_text,
		tags: raw?.properties?.Tags.multi_select.map((x) => x.name),
		slug: raw?.properties?.Slug?.rich_text[0]?.plain_text,
		description: raw?.properties?.Description?.rich_text[0]?.plain_text,
		parsedContent
	} as Article

	return article
}
