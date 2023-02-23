<script lang="ts">
	import { Select, ErrorMessage } from 'svelte-forms-lib'

	import type { SelectProps } from './types'

	interface $$Props extends SelectProps {}

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

<div class={`flex flex-col space-y-2 ${$$props.class}`}>
	<label for={id}>{label}</label>
	<Select
		{id}
		{name}
		class={`rounded-lg bg-slate-100 ${isInvalid ? 'border-red-500' : 'border-slate-200'}`}
	>
		<option value={defaultOption.value} disabled>{defaultOption.label}</option>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</Select>
	<ErrorMessage {name} class="text-red-500 font-semibold" />
</div>
