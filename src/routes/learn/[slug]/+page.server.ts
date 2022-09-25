import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'
import articles from '@lib/git/articles'

export const load: PageServerLoad = async ({ params }) => {
	const article = articles.find((article) => article.slug === params.slug)
	if (article === undefined) {
		throw error(404, "Article not found")
		
	}
	return {
		article
	}
}
