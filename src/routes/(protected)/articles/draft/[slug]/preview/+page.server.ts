import type { PageServerLoad } from './$types'
import { compile } from 'mdsvex'

import type { ArticleResponse } from '@lib/models'

export const load: PageServerLoad = async ({ parent }) => {
	const { article }: { article: ArticleResponse } = await parent()
	const content = await compile(article.data.attributes.content)
	return { content: content?.code }
}