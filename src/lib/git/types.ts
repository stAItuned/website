export interface ArticleMetadata {
	title: string
	author: string
	date: string
	topics: string[]
	meta: string
	target: string
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
