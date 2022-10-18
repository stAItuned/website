import { browser } from '$app/environment'

if (browser) {
	throw new Error(`posts can only be imported server-side`)
}

import type { ArticleMetadata, Article } from './types'

const validMetadata: Record<keyof Omit<ArticleMetadata, 'cover' | 'readingTime'>, string> = {
	author: 'string',
	title: 'string',
	date: 'string',
	topics: 'array',
	meta: 'string',
	target: 'string',
	language: 'string'
}

function isValidMetadata(input: any): input is Omit<ArticleMetadata, 'cover'> {
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

function calculateReadingTime(html: string) {
	const wordsPerMinute = 250 as const
	const words = html.trim().split(/\s+/).length
	return Math.ceil(words / wordsPerMinute)
}



const articles = Object.entries(import.meta.glob('/cms/articles/**/*.md', { eager: true }))
	.map(([filepath, post]: [string, any]) => {
		const slug = filepath.split('/').at(-2) as string
		const filename = (filepath.split('/').at(-1) as string).slice(0, -3)
		// console.log(slug)
		if (!isValidMetadata(post.metadata)) {
			return undefined
		}
		const metadata: ArticleMetadata = post.metadata


		let cover: string | undefined
		if (isValidUrl(metadata.cover)) {
			cover = metadata.cover
		} else if (metadata.cover !== undefined) {
			cover = `/assets/cms/articles/${slug}/${metadata.cover}`
			// console.log(cover)
		} else {
			cover = `https://og-image.vercel.app/${encodeURI(
				post.metadata.title
			)}.png?theme=dark&fontSize=150px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-bw-logo.svg&&images=https://i.imgur.com/YAKfI5F.png&widths=0&heights=0`
		}
		const article: Article = {
			slug,
			filename,

			metadata: {
				...metadata,
				cover,
				readingTime: calculateReadingTime(post.default.render().html)
			}
		}
		return article
	})
	.filter((article) => {
		if (article === undefined) return false
		const date = new Date(article.metadata.date)
		const lowerThreshold = new Date('1970-01-01')
		return date.getTime() > lowerThreshold.getTime()
	})
	.filter((article) => article !== undefined) as Article[]

export default articles
