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
	if (returnRawSchema) return schema
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
const a = {
	'@context': 'http://schema.org',
	'@type': 'ItemList',
	itemListElement: [
		{
			'@type': 'ListItem',
			position: 0,
			url: 'https://staituned.com/learn/quando-è-nata-l-intelligenza-artificiale',
			item: {
				'@context': 'http://schema.org',
				'@type': 'Article',
				image: [
					'/assets/cms/articles/quando-è-nata-l-intelligenza-artificiale/Storia_dellIntelligenza_Artificiale.jpg'
				],
				url: 'https://staituned.com/learn/quando-è-nata-l-intelligenza-artificiale',
				dateCreated: '2022-10-17T00:00:00.000Z',
				datePublished: '2022-10-17T00:00:00.000Z',
				dateModified: '2022-10-17T00:00:00.000Z',
				headline: 'Storia dell’Intelligenza Artificiale',
				name: 'Storia dell’Intelligenza Artificiale',
				description:
					'1956 data ufficiale della nascita dell’Intelligenza Artificiale, ma bisogna considerare il lungo percorso e le scoperte che ci hanno portato a quella data.',
				articleSection: 'Newbie',
				identifier: 'quando-è-nata-l-intelligenza-artificiale',
				timeRequired: 'PT4M',
				author: { '@type': 'Person', name: 'Roberta Ghidini' },
				creator: { '@type': 'Person', name: 'Roberta Ghidini' },
				publisher: {
					'@context': 'http://schema.org',
					'@type': 'Organization',
					url: 'https://staituned.com',
					name: 'stAItuned',
					description: "stAI tuned per un'intelligenza artificiale alla portata di tutti 🦾",
					logo: {
						'@type': 'ImageObject',
						url: 'https://staituned.com/assets/general/logo.svg',
						width: 512,
						height: 512
					}
				},
				mainEntityOfPage: 'https://staituned.com/learn/quando-è-nata-l-intelligenza-artificiale',
				isAccessibleForFree: 'http://schema.org/True'
			}
		},
		{
			'@type': 'ListItem',
			position: 1,
			url: "https://staituned.com/learn/cos'è-l-intelligenza-artificiale",
			item: {
				'@context': 'http://schema.org',
				'@type': 'Article',
				image: [
					"/assets/cms/articles/cos'è-l-intelligenza-artificiale/Intelligenza_Artificiale.jpg"
				],
				url: "https://staituned.com/learn/cos'è-l-intelligenza-artificiale",
				dateCreated: '2022-10-10T00:00:00.000Z',
				datePublished: '2022-10-10T00:00:00.000Z',
				dateModified: '2022-10-10T00:00:00.000Z',
				headline: 'Cos’è l’Intelligenza Artificiale?',
				name: 'Cos’è l’Intelligenza Artificiale?',
				description:
					'Continui a sentire parlare di Intelligenza Artificiale ma nessuno ti ha ancora spiegato bene che cos’è? Per questo ci siamo noi!',
				articleSection: 'Newbie',
				identifier: "cos'è-l-intelligenza-artificiale",
				timeRequired: 'PT4M',
				author: { '@type': 'Person', name: 'Daniele Moltisanti' },
				creator: { '@type': 'Person', name: 'Daniele Moltisanti' },
				publisher: {
					'@context': 'http://schema.org',
					'@type': 'Organization',
					url: 'https://staituned.com',
					name: 'stAItuned',
					description: "stAI tuned per un'intelligenza artificiale alla portata di tutti 🦾",
					logo: {
						'@type': 'ImageObject',
						url: 'https://staituned.com/assets/general/logo.svg',
						width: 512,
						height: 512
					}
				},
				mainEntityOfPage: "https://staituned.com/learn/cos'è-l-intelligenza-artificiale",
				isAccessibleForFree: 'http://schema.org/True'
			}
		},
		{
			'@type': 'ListItem',
			position: 2,
			url: 'https://staituned.com/learn/cos-è-un-computer',
			item: {
				'@context': 'http://schema.org',
				'@type': 'Article',
				image: ['/assets/cms/articles/cos-è-un-computer/Computer.jpg'],
				url: 'https://staituned.com/learn/cos-è-un-computer',
				dateCreated: '2022-10-04T00:00:00.000Z',
				datePublished: '2022-10-04T00:00:00.000Z',
				dateModified: '2022-10-04T00:00:00.000Z',
				headline: 'Computer: lo strumento che ha trasformato la nostra vita',
				name: 'Computer: lo strumento che ha trasformato la nostra vita',
				description:
					'Il computer è un dispositivo elettronico che si occupa di processare i dati e manipolare informazioni, è automatica e programmabile.',
				articleSection: 'Newbie',
				identifier: 'cos-è-un-computer',
				timeRequired: 'PT2M',
				author: { '@type': 'Person', name: 'Roberta Ghidini' },
				creator: { '@type': 'Person', name: 'Roberta Ghidini' },
				publisher: {
					'@context': 'http://schema.org',
					'@type': 'Organization',
					url: 'https://staituned.com',
					name: 'stAItuned',
					description: "stAI tuned per un'intelligenza artificiale alla portata di tutti 🦾",
					logo: {
						'@type': 'ImageObject',
						url: 'https://staituned.com/assets/general/logo.svg',
						width: 512,
						height: 512
					}
				},
				mainEntityOfPage: 'https://staituned.com/learn/cos-è-un-computer',
				isAccessibleForFree: 'http://schema.org/True'
			}
		},
		{
			'@type': 'ListItem',
			position: 3,
			url: 'https://staituned.com/learn/cos-è-un-algoritmo-e-per-cosa-si-utilizza',
			item: {
				'@context': 'http://schema.org',
				'@type': 'Article',
				image: ['/assets/cms/articles/cos-è-un-algoritmo-e-per-cosa-si-utilizza/cover.png'],
				url: 'https://staituned.com/learn/cos-è-un-algoritmo-e-per-cosa-si-utilizza',
				dateCreated: '2022-09-28T00:00:00.000Z',
				datePublished: '2022-09-28T00:00:00.000Z',
				dateModified: '2022-09-28T00:00:00.000Z',
				headline: 'Cos’è un algoritmo?',
				name: 'Cos’è un algoritmo?',
				description:
					'Un algoritmo è una serie di istruzioni e regole che vengono fornite ad un computer per svolgere e completare delle attività.',
				articleSection: 'Newbie',
				identifier: 'cos-è-un-algoritmo-e-per-cosa-si-utilizza',
				timeRequired: 'PT2M',
				author: { '@type': 'Person', name: 'Roberta Ghidini' },
				creator: { '@type': 'Person', name: 'Roberta Ghidini' },
				publisher: {
					'@context': 'http://schema.org',
					'@type': 'Organization',
					url: 'https://staituned.com',
					name: 'stAItuned',
					description: "stAI tuned per un'intelligenza artificiale alla portata di tutti 🦾",
					logo: {
						'@type': 'ImageObject',
						url: 'https://staituned.com/assets/general/logo.svg',
						width: 512,
						height: 512
					}
				},
				mainEntityOfPage: 'https://staituned.com/learn/cos-è-un-algoritmo-e-per-cosa-si-utilizza',
				isAccessibleForFree: 'http://schema.org/True'
			}
		}
	]
}
