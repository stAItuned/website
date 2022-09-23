import { getAllArticles } from '@lib/git/articles'
import type { Article } from '@lib/git/types'
import type { RequestHandler } from './__types'

export const get: RequestHandler<{ articles: Article[] }> = async () => {
	return {
		body: {
			articles: (await getAllArticles()).filter((article) => article !== undefined) as Article[]
		}
	}
}
