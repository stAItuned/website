<script lang='ts'>
	import { onMount } from 'svelte'
	import type { TargetsResponse, TopicsResponse } from '@lib/models'

	import { Form, type FormProps } from 'svelte-forms-lib'
	import { CreateArticleSchema } from '@lib/validations'
	import { fields } from './fields'

	import { Button } from 'flowbite-svelte'
	import api from '@lib/services'

	export let handleSubmit: (values: Record<string, unknown>, cover?: File) => any
	export let initialValues: {
		title: string,
		description: string,
		target: string,
		topics: string[]
	} = { title: '', description: '', target: '0', topics: [] }

	let loading = true
	let targets: TargetsResponse
	let topics: TopicsResponse
	let formProps: FormProps
	let cover: File | undefined = undefined

	onMount(async () => {
		targets = await api.articles.targets.fetch()
		topics = await api.articles.topics.fetch()

		formProps = {
			initialValues: initialValues,
			validationSchema: CreateArticleSchema({ targets: targets, topics: topics }),
			onSubmit: (values) => handleSubmit(values, cover)
		}

		loading = false
	})

	const handleDropzone = (e: Event) => {
		const { files } = e.currentTarget as HTMLInputElement
		if (files?.length) cover = files[0]
		else cover = undefined
	}
</script>

{#if !loading}
	<Form
		{...formProps}
		class='flex flex-col space-y-8'
		let:errors
		let:updateField
		let:form
		let:handleChange
	>
		<div class='grid grid-cols-2 gap-8'>
			{#each fields({ targets, topics, selectedTopics: initialValues.topics }) as field}
				<svelte:component
					this={field.component}
					{...field.attributes}
					{errors}
					{form}
					file={cover}
					title={initialValues.title}
					on:select={(e) => updateField('topics', e.detail.selected)}
					on:change={(e) => handleChange(e.detail)}
					on:upload={(e) => handleDropzone(e.detail)}
					class={`${
					field.attributes.name === 'target' || field.attributes.name === 'topics'
						? 'col-span-1'
						: 'col-span-2'
				}`} />
			{/each}
		</div>

		<div class='flex flex-col space-y-4'>
			<Button type='submit' size='xl'>Continue</Button>
		</div>
	</Form>
{/if}