import { browser } from '$app/environment'

if (browser) {
	throw new Error(`posts can only be imported server-side`)
}

import type { ArticleMetadata, Article } from './types'

const validMetadata: Record<keyof Omit<ArticleMetadata, "cover">, string> = {
	author: 'string',
	title: 'string',
	date: 'string',
	topics: 'array',
	meta: 'string',
	target: 'string',
	language: 'string'
}

function isValidMetadata(input: any): input is Omit<ArticleMetadata, "cover"> {
	const missing_keys = Object.keys(validMetadata).filter((key) => input[key] === undefined)
	if (missing_keys.length > 0) console.log(missing_keys)
	return missing_keys.length === 0
}
function isValidUrl(url: string): boolean {
	try {
		new URL(url)
	} catch {
		return false
	}
	return true
}

const articles = Object.entries(import.meta.glob('/cms/articles/**/*.md', { eager: true }))
	.map(([filepath, post]: [string, any]) => {
		const slug = filepath.split('/').at(-2) as string
		const filename = (filepath.split('/').at(-1) as string).slice(0, -3)
		console.log(slug)
		// const html: string = post.default.render().html
		if (!isValidMetadata(post.metadata)) {
			return undefined
		}

		let cover: string | undefined
		if (post.metadata.cover === undefined) {
			cover = ""
		} else if (isValidUrl(post.metadata.cover)) {
			cover = post.metadata.cover
		} else {
			cover = `/cms/articles/${slug}/${post.metadata.cover}`
		}
		const article: Article = {
			slug,
			filename,
			metadata: {
				...post.metadata,
				cover
			}
		}
		return article
	})
	.filter((article) => article !== undefined) as Article[]

export default articles
