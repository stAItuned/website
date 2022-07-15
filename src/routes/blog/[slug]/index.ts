import { getArticleBySlug } from '@lib/notion'

/** @type {import('./__types/[slug]').RequestHandler} */
export async function get({ params }) {
	const article = await getArticleBySlug(params.slug)

	return {
		body: { article }
	}
}
