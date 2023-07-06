import type { BaseAttributes, EntriesResponse, EntryResponse } from './base'
import type { FileResponse } from '@lib/models/file'

export interface AuthorAttributes extends Omit<BaseAttributes, 'publishedAt'> {
	unlocked: boolean
	firstname?: string,
	lastname?: string,
	job?: string,
	bio?: string,
	overview?: string,
	linkedin?: string,
	avatar?: FileResponse,
}

export type AuthorResponse = EntryResponse<AuthorAttributes>
export type AuthorsResponse = EntriesResponse<AuthorAttributes>