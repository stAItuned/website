import { browser } from '$app/environment'

if (browser) {
	throw new Error(`posts can only be imported server-side`)
}

import type { Author } from '@lib/interfaces'
import { cms as cmsHelper } from '@lib/helpers'

const loadAuthors = (): Promise<(Author)[]> => {
	return new Promise((resolve) => {
		resolve(
			Object.entries(import.meta.glob('/cms/team/**/*.md', { eager: true }))
				.map(([filepath, member]: [string, any]) => {
					if (!cmsHelper.author.isValidAuthor(member.metadata)) {
						return undefined
					}

					const folder = cmsHelper.author.getFolderFromPath(filepath)
					const propic: string = `/cms/team/${folder}/propic.jpg`

					const author: Author = {
						...member.metadata,
						slug: folder,
						propic,
						html: member.default.render().html
					}

					return author
				})
				.filter((author: Author | undefined) => author !== undefined) as Author[]
		)
	})
}

export default loadAuthors
