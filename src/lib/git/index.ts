import type { Article, Author, CMSData } from '@lib/interfaces'

import articles from '@lib/git/articles'
import authors from '@lib/git/authors'

articles.forEach((article: Article) => {
	const author = authors.find((a: Author) => a.name === article.metadata.author)

	if (author) {
		article.author = author
		if (Array.isArray(author.articles)) {
			author.articles.push(article)
		} else {
			author.articles = [article]
		}
	}
})

export default { articles, authors } as CMSData
