import type { Author } from '@lib/interfaces'

const validAuthor: Record<keyof Omit<Author, 'propic' | 'articles' | 'slug'>, string> = {
	name: 'string',
	team: 'string[]',
	title: 'string',
	linkedin: 'string',
	email: 'string',
	description: 'string'
}

const isValidAuthor = (input: any): input is Omit<Author, 'propic' | 'articles' | 'slug'> => {
	const missing_keys = Object.keys(validAuthor).filter((key) => input[key] === undefined)
	return missing_keys.length === 0
}

const getFolderFromPath = (filepath: string): string => {
	return filepath.split('/').at(-2) as string
}

export { isValidAuthor, getFolderFromPath }
