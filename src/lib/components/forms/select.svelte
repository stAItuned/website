<script lang="ts">
	import { Select } from 'svelte-forms-lib'

	import { ErrorMessage, Label } from './utils'

	import type { SelectProps } from './types'

	interface $$Props extends SelectProps {
		class?: string
	}

	const {
		name,
		id = name,
		label = '',
		options,
		defaultOption = { label: 'Select...', value: '0' },
		errors
	}: SelectProps = $$props as SelectProps

	let isInvalid = false

	errors?.subscribe((fields) => (fields[name] ? (isInvalid = true) : (isInvalid = false)))
</script>

<div class={`relative flex flex-col ${$$props.class}`}>
	<Label {id} {label} />
	<Select
		{id}
		{name}
		class={`rounded-lg p-2 mb-3 text-sm bg-slate-100 ${isInvalid ? 'border-red-500' : 'border-slate-200'}`}
	>
		<option value={defaultOption.value} disabled>{defaultOption.label}</option>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</Select>
	<ErrorMessage {name} bind:isInvalid />
</div>
