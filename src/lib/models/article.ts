import type { BaseAttributes, EntryResponse, EntriesResponse } from './base'
import type { AuthorResponse } from './author'
import type { FileResponse } from '@lib/models/file'

/* Attributes */

export interface TargetAttributes extends BaseAttributes {
	label: string
}

export interface TopicAttributes extends BaseAttributes {
	label: string
}

export interface ArticleAttributes extends BaseAttributes {
	title: string,
	content: string,
	language: string
	slug: string,
	description: string,
	reviewable: boolean,
	readingTime?: string,
	cover?: FileResponse
	target?: TargetResponse,
	topics?: TopicsResponse,
	author?: AuthorResponse
}

/* Responses */

export type TargetResponse = EntryResponse<TargetAttributes>
export type TargetsResponse = EntriesResponse<TargetAttributes>

export type TopicResponse = EntryResponse<TopicAttributes>
export type TopicsResponse = EntriesResponse<TopicAttributes>

export type ArticleResponse = EntryResponse<ArticleAttributes>
export type ArticlesResponse = EntriesResponse<ArticleAttributes>