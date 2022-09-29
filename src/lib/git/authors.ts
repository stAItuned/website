import { browser } from '$app/environment'

if (browser) {
	throw new Error(`posts can only be imported server-side`)
}
import type { Author } from './types'

const validAuthorMetadata: Record<keyof Omit<Author, 'propic' | 'articles'>, string> = {
	description: 'string',
	email: 'string',
	linkedin: 'string',
	name: 'string',
	team: 'string[]',
	title: 'string'
}

function isValidAuthor(input: any): input is Omit<Author, 'propic'> {
	const missing_keys = Object.keys(validAuthorMetadata).filter((key) => input[key] === undefined)
	if (missing_keys.length > 0) console.log(`a ${missing_keys}`)
	return missing_keys.length === 0
}

const authors = Object.entries(import.meta.glob('/cms/team/**/*.md', { eager: true }))
	.map(([filepath, member]: [string, any]) => {
		const folderName = filepath.split('/').at(-2) as string
		if (!isValidAuthor(member.metadata)) {
			return undefined
		}
		let propic: string = `/assets/cms/team/${folderName}/propic.jpg`
		const author: Author = {
			...member.metadata,
			propic
		}

		return author
	})
	.filter((a) => a !== undefined) as Author[]
export default authors
