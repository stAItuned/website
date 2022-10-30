import { browser } from '$app/environment'

if (browser) {
	throw new Error(`posts can only be imported server-side`)
}

import type { Author } from '@lib/interfaces'
import { cms } from '@lib/helpers'

const authors = Object.entries(import.meta.glob('/cms/team/**/*.md', { eager: true }))
	.map(([filepath, member]: [string, any]) => {
		if (!cms.author.isValidAuthor(member.metadata)) {
			return undefined
		}

		const folder = cms.author.getFolderFromPath(filepath)
		const propic: string = `/cms/team/${folder}/propic.jpg`

		const author: Author = {
			...member.metadata,
			propic
		}

		return author
	})
	.filter((author) => author !== undefined) as Author[]

export default authors
