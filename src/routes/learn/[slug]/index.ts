import type { RequestHandler } from './__types'
import {getSingleArticle} from '@lib/git/index'
import type { Article } from '@lib/git/types'

export const get: RequestHandler<{article: Article | undefined}> = async ({ params }) => {
	const article = getSingleArticle(params.slug)
	console.log(`Opening ${params.slug} - ${article?.metadata.title}`)

	return {
		body: { article }
	}
}
