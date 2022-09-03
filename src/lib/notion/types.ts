export interface ArticleMeta {
	title: string
	description: string
	tags: string[]
	slug: string
	author: string
	publishDate: string
	readingTime: number
}

export interface Article {
	meta: ArticleMeta
	parsedContent: string
}
