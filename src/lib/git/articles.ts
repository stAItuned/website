import { browser } from '$app/environment'

if (browser) {
	throw new Error(`posts can only be imported server-side`)
}

import type { ArticleMetadata, Article } from '@lib/interfaces'
import { cms } from '@lib/helpers'

const articles = Object.entries(import.meta.glob('/cms/articles/**/*.md', { eager: true }))
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
				cover: cms.article.defineCover(slug, metadata.title, metadata.cover),
				readingTime: cms.article.computeReadingTime(post.default.render().html)
			}
		}

		return article
	})
	.filter((article) => {
		return article && article.metadata.date
	}) as Article[]

export default articles
