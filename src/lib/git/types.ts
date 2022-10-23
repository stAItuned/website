export interface ArticleMetadata {
	title: string
	author: string
	date: string
	topics: string[]
	meta: string
	target: string
	/** absolute path (without base url) to the assets folder containing the cover image */
	cover: string
	language: string
	/**in minutes */
	readingTime: number
}

export interface Article {
	/**
	 * The name of the folder where the post is
	 */
	slug: string
	filename: string
	metadata: ArticleMetadata
	content?: string | undefined
	assets?: string | undefined
	author?: Author | undefined
}

export interface Author {
	name: string
	team: string[]
	title: string
	linkedin: string
	email: string
	description: string
	propic: string
	articles?: Article[] | undefined
}

export interface CMSData {
	authors: Author[]
	articles: Article[]
}
