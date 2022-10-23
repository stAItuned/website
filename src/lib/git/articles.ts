import { browser } from '$app/environment'

if (browser) {
	throw new Error(`posts can only be imported server-side`)
}

import type { ArticleMetadata, Article } from '@lib/interfaces'
import { cms } from '@lib/helpers'

const loadArticles = (): Promise<(Article | undefined)[]> => {
	return new Promise((resolve) => {
		resolve(Object.entries(import.meta.glob('/cms/articles/**/*.md', { eager: true }))
			.map(([filepath, post]: [string, any]) => {
				if (!cms.article.isValidMetadata(post.metadata)) {
					return undefined
				}

				const [slug, filename] = cms.article.getInfoFromPath(filepath);
				const metadata: ArticleMetadata = post.metadata

				const article: Article = {
					slug,
					filename,
					metadata: {
						...metadata,
						cover: metadata.cover,
						readingTime: cms.article.computeReadingTime(post.default.render().html)
					}
				}
				return article
			}))
	})
}

export default loadArticles;