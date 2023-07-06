import * as yup from 'yup'

import type { TargetsResponse, TopicsResponse } from '@lib/models'

const CreateArticleSchemaBase = yup.object().shape({
	title: yup.string().required('Title is required'),
	description: yup.string().required('Description is required')
})

export const CreateArticleSchema = (
	{ targets, topics }:
		{ targets: TargetsResponse, topics: TopicsResponse }) =>
	CreateArticleSchemaBase.shape({
		target: yup
			.string()
			.oneOf(
				targets.data!.map((target) => target.id.toString()),
				'Invalid Target'
			)
			.required('Target is required'),
		topics: yup
			.array()
			.min(1, 'Pick at least 1 topic')
			.of(yup.string()
				.oneOf(
					topics.data!.map(topic => topic.id.toString()),
					'Invalid topic')
			)
	})