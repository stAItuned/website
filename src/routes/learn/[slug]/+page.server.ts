import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import data from '@lib/git/index'

export const load: PageServerLoad = async ({ params }) => {
	const articles = data.articles
	const article = articles.find((article) => article.slug === params.slug)
	if (article === undefined) {
		throw error(404, 'Article not found')
	}
	return {
		article
	}
}
