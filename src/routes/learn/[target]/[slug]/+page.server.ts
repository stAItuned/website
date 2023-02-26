import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

import { git } from '@lib/git'

export const load: PageServerLoad = async ({ params }) => {
	const articles = (await git.loadData()).articles
	const article = articles.find((article) => article.slug === params.slug)
	if (!article) throw error(404, 'Article not found')

	// Filter related articles by target excluding same slug
	const target = article.metadata.target
	const slug = article.slug
	const relatedArticlesByTarget = articles.filter(
		(thisArticle) => thisArticle.metadata.target === target && thisArticle.slug !== slug
	)

	// Filter related articles by target and topic
	const topics = article.metadata.topics
	const relatedArticlesByTargetAndTopic = relatedArticlesByTarget.filter((thisArticle) =>
		thisArticle.metadata.topics.filter((topic) => topics.includes(topic))
	)

	// Maximum of 5 related articles
	const relatedArticles =
		relatedArticlesByTargetAndTopic.length > 5
			? relatedArticlesByTargetAndTopic.slice(0, 5)
			: relatedArticlesByTargetAndTopic

	return {
		article,
		relatedArticles
	}
}
