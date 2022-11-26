import type { Article } from '@lib/interfaces'

import info from '@lib/info'
import type { JsonLdProps } from 'svelte-meta-tags'

export const ORGANIZATION_SCHEMA: JsonLdProps['schema'] = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	url: info.basePath,
	name: info.siteName,
	description: info.longDescription,
	// publishingPrinciples: 'https://policy.medium.com/medium-terms-of-service-9db0094a1e0f',
	logo: {
		'@type': 'ImageObject',
		url: `${info.basePath}${info.logo.relPath}`,
		width: `${info.logo.width}`,
		height: `${info.logo.height}`
	}
}

export const articleSchema = (article: Article): JsonLdProps['schema'] => ({
	'@context': 'https://schema.org',
	'@type': 'TechArticle',
	image: [article.metadata.cover],
	thumbnailUrl: article.metadata.cover,
	url: `${info.basePath}/learn/${article.metadata.target.toLowerCase()}/${article.slug}`,
	dateCreated: `${article.metadata.date}`,
	datePublished: `${article.metadata.date}`,
	dateModified: `${article.metadata.date}`,
	headline: `${article.metadata.title}`,
	name: `${article.metadata.title}`,
	description: `${article.metadata.meta}`,
	articleSection: article.metadata.target,
	identifier: `${article.slug}`,
	timeRequired: `PT${Math.ceil(article.metadata.readingTime)}M`,
	proficiencyLevel: article.metadata.target === 'Newbie' ? 'Beginner' : article.metadata.target,
	keywords: article.metadata.topics.join(),
	inLanguage: article.metadata.language === 'Italian' ? 'it' : 'en',
	author: {
		'@type': 'Person',
		name: `${article.metadata.author}`,
		url: article.author === undefined ? undefined : `/meet/member/${article.author.slug}`
	},
	creator: {
		'@type': 'Person',
		name: `${article.metadata.author}`
	},
	publisher: ORGANIZATION_SCHEMA,
	mainEntityOfPage: `${info.basePath}/learn/${article.metadata.target.toLowerCase()}/${
		article.slug
	}`,
	isAccessibleForFree: 'https://schema.org/True'
})

export const listArticleSchema = (articles: Article[]) => {
	const mapArticleToItemList = (a: Article, index: number): JsonLdProps['schema'] => {
		return {
			'@type': 'ListItem',
			position: index + 1,
			url: `${info.basePath}/learn/${a.metadata.target.toLowerCase()}/${a.slug}`,
			item: articleSchema(a)
		} as const
	}
	const schema: JsonLdProps['schema'] = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		itemListElement: articles.map(mapArticleToItemList)
	} as any as JsonLdProps['schema']
	return schema
}

export const breadcrumbSchema = (
	pages: { title: string; path: string }[]
): JsonLdProps['schema'] => {
	const mapPageToBreadcrumb = (
		p: { title: string; path: string },
		index: number
	): JsonLdProps['schema'] => {
		return {
			'@type': 'ListItem',
			position: index + 1,
			name: p.title,
			item: `${info.basePath}${p.path}`
		} as const
	}
	const schema: JsonLdProps['schema'] = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: pages.map(mapPageToBreadcrumb)
	} as any as JsonLdProps['schema']
	return schema
}
