import articles from '@lib/git/articles'
import authors from '@lib/git/authors'
import type { CMSData } from './types'

articles.forEach((article) => {
	let author = authors.find((a) => a.name === article.metadata.author)
	if (author) {
		article.author = author
		if (Array.isArray(author.articles)) {
			author.articles.push(article)
		} else {
			author.articles = [article]
		}
	}
})

export default {
	articles,
	authors
} as CMSData
