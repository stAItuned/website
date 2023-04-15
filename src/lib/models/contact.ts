import type { BaseAttributes, EntryResponse, EntriesResponse } from './base'

/* Attributes */

export interface ContactAttributes extends BaseAttributes {
	name: string,
	subject: string,
	text: string
	email: string
}

/* Responses */

export type ContactResponse = EntryResponse<ContactAttributes>