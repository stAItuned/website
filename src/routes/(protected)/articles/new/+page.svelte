<script lang="ts">
	import { Form, type FormProps } from 'svelte-forms-lib'
	import { CreateArticleSchema } from '@lib/validations'
	import { goto } from '$app/navigation'

	import api from '@lib/services'

	import Header from './header.svelte'
	import { Input, Select, MultiSelect, TimedInput, Dropzone } from '@lib/components/forms'
	import { Button } from '@lib/components/ui-core'

	import type { Response } from './+page.server'
	import type { Field } from '@lib/components/forms/types'
	import type { Writable } from 'svelte/store'

	/** @type {import('./$types').PageData} */
	export let data: Response

	let cover: File | null = null

	let slugText = ''
	let showSlug = false
	let slugError = false

	const formProps: FormProps = {
		initialValues: { title: '', description: '', target: '0', topics: [] },
		validationSchema: CreateArticleSchema({ targets: data.targets, topics: data.topics }),
		onSubmit: (values) => {
			api.articles
				.create({ data: { ...values }, cover })
				.then((res) => goto(`/articles/draft/${res.id}/editor`))
				.catch((err) => console.log(err))
		}
	}

	const handleDropzone = (e: Event) => {
		const { files } = e.currentTarget as HTMLInputElement
		if (files?.length) cover = files[0]
		else cover = null
	}

	const fields: Field[] = [
		{
			attributes: {
				name: 'title',
				label: 'Title',
				placeholder: 'A new amazing article'
			},
			component: TimedInput
		},
		{
			attributes: {
				name: 'description',
				label: 'Description',
				placeholder: 'This article is about...',
				type: 'textarea',
				rows: 5
			},
			component: Input
		},
		{
			attributes: {
				name: 'target',
				label: 'Target',
				placeholder: 'Select a target',
				options: data.targets,
				defaultOption: { label: 'Select a target...', value: '0' }
			},
			component: Select
		},
		{
			attributes: {
				name: 'topics',
				label: 'Topics',
				options: data.topics,
				selected: []
			},
			component: MultiSelect
		},
		{
			attributes: {
				name: 'cover',
				label: 'Cover image',
				accept: 'image/*',
				desc: 'SVG, PNG, JPG or GIF'
			},
			component: Dropzone
		}
	]

	const checkUniqueSlug = (
		title: string,
		loading: Writable<boolean>,
		isInvalid: Writable<boolean>
	) => {
		if (title) {
			const slug = title.trim().toLowerCase().replaceAll(' ', '-')
			slugText = slug
			api.articles
				.fetchBySlug(slug)
				.then(() => {
					slugError = true
					isInvalid.set(true)
				})
				.catch((err) => {
					if (err.response.status === 404) slugError = false
					else console.log(err)
				})
				.finally(() => {
					showSlug = true
					loading.set(false)
				})
		} else showSlug = false
	}
</script>

<Header />
<Form
	{...formProps}
	class="flex flex-col space-y-8"
	let:errors
	let:updateField
	let:form
	let:handleChange
>
	<div class="grid grid-cols-2 gap-8">
		{#each fields as field}
			<svelte:component
				this={field.component}
				{...field.attributes}
				{errors}
				{form}
				on:select={(e) => updateField('topics', e.detail.selected)}
				on:change={(e) => handleChange(e.detail)}
				on:upload={(e) => handleDropzone(e.detail)}
				let:value
				callback={checkUniqueSlug}
				class={`${
					field.attributes.name === 'target' || field.attributes.name === 'topics'
						? 'col-span-1'
						: 'col-span-2'
				}`}
			>
				{#if field.attributes.name === 'title' && showSlug}
					<small class={`font-semibold ${slugError ? 'text-red-500' : 'text-emerald-500'}`}>
						The slug <code class="font-extrabold tracking-wider"
							>{value.trim().toLowerCase().replaceAll(' ', '-')}</code
						>
						is {`${slugError ? 'already used' : 'available'}`}
					</small>
				{/if}
			</svelte:component>
		{/each}
	</div>

	<div class="flex flex-col space-y-4">
		<Button type="submit" width="full">Continue</Button>
	</div>
</Form>
