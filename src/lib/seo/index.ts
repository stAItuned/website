import type { Article } from '@lib/git/types'
import info from '@lib/info'

const ORGANIZATION_SCHEMA = {
	'@context': 'http://schema.org',
	'@type': 'Organization',
	url: info.basePath,
	name: info.siteName,
	description: info.longDescription,
	// publishingPrinciples: 'https://policy.medium.com/medium-terms-of-service-9db0094a1e0f',
	logo: {
		'@type': 'ImageObject',
		url: `${info.basePath}${info.logo.relPath}`,
		width: info.logo.width,
		height: info.logo.height
	}
} as const

export const getHomeSchema = (): string => {
	return `<script type="application/ld+json">${JSON.stringify(ORGANIZATION_SCHEMA)}</script>`
}

export const getArticleSchema = (article: Article, returnRawSchema: boolean = false) => {
	const schema = {
		'@context': 'http://schema.org',
		'@type': 'Article',
		image: [article.metadata.cover],
		url: `${info.basePath}/learn/${article.slug}`,
		dateCreated: `${article.metadata.date}`,
		datePublished: `${article.metadata.date}`,
		dateModified: `${article.metadata.date}`,
		headline: `${article.metadata.title}`,
		name: `${article.metadata.title}`,
		description: `${article.metadata.meta}`,
		articleSection: article.metadata.target,
		identifier: `${article.slug}`,
		timeRequired: `PT${Math.ceil(article.metadata.readingTime)}M`,
		author: {
			'@type': 'Person',
			name: `${article.metadata.author}`
		},
		creator: {
			'@type': 'Person',
			name: `${article.metadata.author}`
		},
		publisher: ORGANIZATION_SCHEMA,
		mainEntityOfPage: `${info.basePath}/learn/${article.slug}`,
		isAccessibleForFree: 'http://schema.org/True'
	} as const
	if(returnRawSchema) return schema
	return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}

export const getListArticleSchema = (articles: Article[]) => {
	const mapArticleToItemList = (a: Article, index: number) => {
		return {
			'@type': 'ListItem',
			position: index,
			url: `${info.basePath}/learn/${a.slug}`,
			item: getArticleSchema(a, true)
		}
	}
	const schema = {
		'@context': 'http://schema.org',
		'@type': 'ItemList',
		itemListElement: articles.map(mapArticleToItemList)
	}
	return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}
