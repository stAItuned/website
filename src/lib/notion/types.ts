export interface ArticleMeta {
	title: string
	description: string
	tags: string[]
	slug: string
	author: string
	publishDate: string
}

export interface Article {
	meta: ArticleMeta
	parsedContent: string
}
