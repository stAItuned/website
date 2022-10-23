import type { Article, Cover, Author, CMSData } from '@lib/interfaces'

import loadArticles from './articles'
import authors from './authors'

import { cms } from '@lib/helpers'

const loadData = (): Promise<CMSData> => {
	return new Promise((resolve) => {
		loadArticles().then((articles: (Article | undefined)[]) => {
			const publishedArticles = cms.article.getPublishedArticles(articles)

			cms.article.loadCovers(publishedArticles).then((covers: Cover[]) => {
				publishedArticles.forEach((article: Article, idx) => {
					const author = authors.find((a: Author) => a.name === article.metadata.author)
					const cover = covers.find((c: Cover) => c.article === article.slug)

					if (author) {
						article.author = author
						// if (Array.isArray(author.articles)) {
						// 	author.articles.push(article)
						// } else {
						// 	author.articles = [article]
						// }
					}

					if (cover) {
						article.metadata.cover = cover.image
					}

					if (idx === publishedArticles.length - 1)
						resolve({ articles: publishedArticles, authors } as CMSData)

				})
			})

		})
	})
}

export default loadData