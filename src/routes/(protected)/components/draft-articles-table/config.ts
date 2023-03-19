import { writable } from 'svelte/store'
import type { Action } from './types'

import { CheckBadge, CodeBracket, PencilSquare, Trash, Window } from 'svelte-heros-v2'
import type { ArticleAttributes, BaseData } from '@lib/models'

const baseUrl = (slug: string) => `/articles/draft/${slug}`

export const isLoadingNeeded = writable<boolean>(false)
export const hasDeleteModalCalled = writable<boolean>(false)
export const hasBeenPublishModalCalled = writable<boolean>(false)

export const tableHeadCells = ["Title", "Updated at", "Created at", "Target"]

export const actions = (article: BaseData<ArticleAttributes>): Action[] => [
	{
		label: 'Preview',
		icon: Window,
		href: `${baseUrl(article.attributes.slug)}/preview`
	},
	{
		label: 'Edit',
		icon: PencilSquare,
		href: `${baseUrl(article.attributes.slug)}/edit`
	},
	{
		label: 'Open editor',
		icon: CodeBracket,
		href: `${baseUrl(article.attributes.slug)}/editor`
	},
	{
		label: 'Publish',
		icon: CheckBadge,
		callback: () => hasBeenPublishModalCalled.set(true)
	},
	{
		label: 'Delete',
		icon: Trash,
		callback: () => hasDeleteModalCalled.set(true)
	}
]