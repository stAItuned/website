import type { EntryResponse, BaseAttributes } from '@lib/models'

export interface FileMetadata {
	hash: string,
	mime: string,
	ext: string,
	name: string,
	path?: string
	url: string,
	height: number,
	width: number,
	size: number,
}

export interface FileAttributes extends BaseAttributes, Omit<FileMetadata, 'path'> {
	id: number,
	formats: {
		medium: FileMetadata,
		small: FileMetadata,
		thumbnail: FileMetadata
	},
	provider: string,
	provider_metadata?: string,
	previewUrl?: string,
	alternativeText?: string,
	caption?: string,
}

export type FileResponse = EntryResponse<Omit<FileAttributes, 'id'>>