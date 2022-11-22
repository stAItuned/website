import type { Article,  Author, CMSData } from '@lib/interfaces'

import loadArticles from './articles'
import loadAuthors from './authors'

const loadData = (): Promise<CMSData> => {
	return new Promise((resolve) => {
		Promise.all([loadArticles(), loadAuthors()]).then(([articles, authors]) => {
			// cms.article.loadCovers(publishedArticles).then((covers: Cover[]) => {
			articles.forEach((article: Article) => {
					const author = authors.find((a: Author) => a.name === article.metadata.author)
					// const cover = covers.find((c: Cover) => c.article === article.slug)

					if (author) {
						article.author = author
						// if (Array.isArray(author.articles)) {
						// 	author.articles.push(article)
						// } else {
						// 	author.articles = [article]
						// }
					}

					// if (cover) {
					// 	article.metadata.cover = cover.image
					// }
				})
				
				resolve({ articles, authors } as CMSData);

				})
			// })

		})
	}

export default loadData