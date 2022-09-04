import { getArticleBySlug, type Article } from '@lib/notion'
import type { RequestHandler } from './__types'


export const get: RequestHandler<{article: Article}> = async ({ params }) => {
	const article = await getArticleBySlug(params.slug)

	return {
		body: { article }
	}
}
