<script lang='ts'>
	import { createEventDispatcher } from 'svelte'
	import { Spinner } from 'flowbite-svelte'

	import { Label, ErrorMessage } from '@shared/components/forms/utils'
	import type { InputProps } from '@shared/components/forms/types'
	import type { ErrorResponse } from '@lib/models'

	import api from '@lib/services'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	interface $$Props extends InputProps {
		title: string
	}

	const {
		name,
		id = name,
		label = '',
		placeholder = '',
		errors,
		form,
		title
	}: $$Props = $$props

	let isInvalid = false
	let isSlugInvalid = false
	let loading = false
	let value = ''
	let slug = ''

	const { addNotification } = getNotificationsContext()

	const dispatch = createEventDispatcher()

	const handleInput = (e: Event) => {
		dispatch('change', e)
		if (value && value !== title) {
			loading = true
			isSlugInvalid = false
			const oldValue = value
			setTimeout(() => {
				if (oldValue === value) {
					slug = oldValue.trim().toLowerCase().replaceAll(' ', '-')
					api.articles.checkSlugAvailability(slug)
						.then(() => isSlugInvalid = false)
						.catch((err: ErrorResponse) => {
							if (err.error.status === 409) isSlugInvalid = true
							else addNotification(notify.error(err.error.message))
						})
						.finally(() => loading = false)
				}
			}, 2000)
		} else {
			loading = false
		}
	}

	form?.subscribe((fields) => (value = fields[name]))
	errors?.subscribe((fields) => (fields[name] ? (isInvalid = true) : (isInvalid = false)))
</script>

<div class={`relative flex flex-col ${$$props.class}`}>
	<Label {id} {label} />
	<input
		{id}
		{name}
		{placeholder}
		type='text'
		class={`p-2 mb-3 text-sm rounded-lg bg-slate-100 ${
			isInvalid || isSlugInvalid ? 'border-red-500' : 'border-slate-200'
		}`}
		bind:value
		on:input={handleInput} />
	{#if loading}
		<small>
			<Spinner class='mr-2' size='4' />
			<span class='text-slate-500'>Checking for slug availability</span>
		</small>
	{:else if slug && !isInvalid && value !== title}
		<small class={`font-semibold ${isSlugInvalid ? 'text-red-500' : 'text-emerald-500'}`}>
			The slug <code class='font-extrabold tracking-wider'
		>{slug}</code
		>
			is {`${isSlugInvalid ? 'already used' : 'available'}`}
		</small>
	{/if}
	<ErrorMessage {name} bind:isInvalid />
</div>