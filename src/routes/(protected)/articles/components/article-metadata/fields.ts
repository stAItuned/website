import type { TargetsResponse, TopicsResponse } from '@lib/models'

import type { Field, MultiSelectProps, SelectProps } from '@components/forms/types'
import { Dropzone, Input, MultiSelect, Select } from '@components/forms'
import CheckSlugInput from './check-slug-input.svelte'

export const targetField = (targets: TargetsResponse): SelectProps => ({
	name: 'target',
	label: 'Target',
	options: targets.data.map((target) => ({
		label: target.attributes.label,
		value: target.id.toString()
	})),
	defaultOption: { label: 'Select a target...', value: '0' }
})

export const topicsField = (topics: TopicsResponse, selected: string[]): MultiSelectProps => ({
	name: 'topics',
	label: 'Topics',
	options: topics.data.map((topic) => ({
		label: topic.attributes.label,
		value: topic.id.toString()
	})),
	selected
})

export const fields = (
	{ targets, topics, selectedTopics }:
		{ targets: TargetsResponse, topics: TopicsResponse, selectedTopics: string[] }
): Field[] => [
	{
		attributes: {
			name: 'title',
			label: 'Title',
			placeholder: 'A new amazing article'
		},
		// @ts-ignore
		component: CheckSlugInput
	},
	{
		attributes: {
			name: 'description',
			label: 'Description',
			placeholder: 'This article is about...',
			type: 'textarea',
			rows: 5
		},
		// @ts-ignore
		component: Input
	},
	{
		attributes: targetField(targets),
		// @ts-ignore
		component: Select
	},
	{
		attributes: topicsField(topics, selectedTopics),
		// @ts-ignore
		component: MultiSelect
	},
	{
		attributes: {
			name: 'cover',
			label: 'Cover image',
			accept: 'image/*',
			desc: 'SVG, PNG, JPG or GIF'
		},
		// @ts-ignore
		component: Dropzone
	}
]