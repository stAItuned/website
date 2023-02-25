import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

import { git } from '@lib/git'

export const load: PageServerLoad = async ({ params }) => {
	const articles = (await git.loadData()).articles
	const article = articles.find((article) => article.slug === params.slug)
	if (!article) throw error(404, 'Article not found')

	// filter related articles by target
	const target = article.metadata.target
	const relatedArticlesByTarget = articles.filter(
		(thisArticle) => thisArticle.metadata.target === target
	)

	// filter related articles by target and topic
	const topics = article.metadata.topics
	const relatedArticlesByTargetAndTopic = relatedArticlesByTarget.filter((thisArticle) =>
		thisArticle.metadata.topics.filter((topic) => topics.includes(topic))
	)

	// maximum of 5 related articles
	const relatedArticles =
		relatedArticlesByTargetAndTopic.length > 5
			? relatedArticlesByTargetAndTopic.slice(0, 5)
			: relatedArticlesByTargetAndTopic

	console.log(relatedArticles)
	console.log(target)

	return {
		article,
		relatedArticles
	}
}
