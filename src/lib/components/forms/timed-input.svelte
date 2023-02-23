<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { writable } from 'svelte/store'
	import { ErrorMessage } from 'svelte-forms-lib'
	import { Spinner } from 'flowbite-svelte'

	import type { TimedInputProps } from './types'

	interface $$Props extends TimedInputProps {}

	const {
		name,
		id = name,
		label = '',
		placeholder = '',
		errors,
		form,
		callback
	}: TimedInputProps = $$props as TimedInputProps

	let loading = writable(false)
	let isInvalidFromCallback = writable(false)
	let isInvalid = false

	let value = ''

	const dispatch = createEventDispatcher()

	const handleInput = (e: Event) => {
		dispatch('change', e)
		if (value) {
			$loading = true
			$isInvalidFromCallback = false
			const oldValue = value
			setTimeout(() => {
				if (oldValue === value) callback(value, loading, isInvalidFromCallback)
			}, 2000)
		}
	}

	form?.subscribe((fields) => (value = fields[name]))
	errors?.subscribe((fields) => (fields[name] ? (isInvalid = true) : (isInvalid = false)))
</script>

<div class={`flex flex-col space-y-2 ${$$props.class}`}>
	<label for={id}>{label}</label>
	<input
		{id}
		{name}
		{placeholder}
		type="text"
		class={`rounded-lg bg-slate-100 ${
			isInvalid || $isInvalidFromCallback ? 'border-red-500' : 'border-slate-200'
		}`}
		bind:value
		on:change={(e) => dispatch('change', e)}
		on:blur={(e) => dispatch('change', e)}
		on:input={(e) => handleInput(e)}
	/>
	{#if $loading}
		<small>
			<Spinner class="mr-2" size="4" />
			<span class="text-slate-500">Checking for slug availability</span>
		</small>
	{:else if value}
		<slot {value} />
	{/if}
	<ErrorMessage {name} class="text-red-500 font-semibold" />
</div>
