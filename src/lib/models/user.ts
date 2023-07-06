import type { BaseAttributes, EntryResponse } from './base'
import type { AuthorAttributes } from '@lib/models/author'
import type { FileAttributes } from '@lib/models/file'

export interface UserAttributes extends Omit<BaseAttributes, 'publishedAt'> {
	id: number,
	email: string,
	provider: string,
	confirmed: boolean,
	blocked: boolean,
	username: string,
	author: AuthorAttributes & { id: string, avatar: FileAttributes }
}

export type UserResponse = EntryResponse<Omit<UserAttributes, 'id'>>

export interface AuthResponse {
	jwt: string,
	user: UserAttributes
}