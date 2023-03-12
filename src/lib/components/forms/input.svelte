<script lang="ts">
	import { Field, Textarea } from 'svelte-forms-lib'
	import type { InputProps } from './types'

	import { ErrorMessage, Label } from './utils'

	interface $$Props extends InputProps {
		class?: string
	}

	const {
		name,
		id = name,
		label = '',
		placeholder = '',
		type = 'text',
		rows,
		errors
	}: InputProps = $$props as InputProps

	let isInvalid = false

	errors?.subscribe((fields) => (fields[name] ? (isInvalid = true) : (isInvalid = false)))
	const component = type === 'textarea' ? Textarea : Field
</script>

<div class={`relative flex flex-col ${$$props.class}`}>
	<Label {id} {label} />
	<svelte:component
		this={component}
		{id}
		{name}
		{placeholder}
		{type}
		{rows}
		class={`p-2 mb-3 text-sm rounded-lg bg-slate-100 ${
			isInvalid ? 'border-red-500' : 'border-slate-200'
		}`}
	/>

	<ErrorMessage {name} bind:isInvalid />
</div>
