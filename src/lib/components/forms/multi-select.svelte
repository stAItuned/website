<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Dropdown, Checkbox, Chevron, Button, Search } from 'flowbite-svelte'

	import { ErrorMessage, Label } from './utils'

	import type { MultiSelectProps, Option } from './types'

	interface $$Props extends MultiSelectProps {}

	const {
		name,
		id = name,
		label = '',
		options,
		errors
	}: MultiSelectProps = $$props as MultiSelectProps

	let { selected = [] } = $$props as MultiSelectProps

	let searchValue = ''
	let filteredOptions: Option[] = options

	const dispatch = createEventDispatcher()

	const handleSelect = (e: MouseEvent) => {
		const { value } = e.currentTarget as HTMLInputElement
		if (selected.includes(value)) selected = selected.filter((option) => option !== value)
		else selected.push(value)
		dispatch('select', { selected })
	}

	const handleSearch = () => {
		if (!searchValue) filteredOptions = options
		else
			filteredOptions = options.filter((option) =>
				option.label.toLowerCase().includes(searchValue.toLowerCase())
			)
	}

	const handleResetSearch = () => {
		searchValue = ''
		filteredOptions = options
	}

	let isInvalid = false
	errors?.subscribe((fields) => (fields[name] ? (isInvalid = true) : (isInvalid = false)))
</script>

<div class={`relative flex flex-col ${$$props.class}`}>
	<Label {id} {label} />
	<Button on:click={handleResetSearch}><Chevron>{label}</Chevron></Button>

	<Dropdown {id} class="overflow-y-auto px-3 pb-3 text-sm h-44">
		<div slot="header" class="p-3">
			<Search size="md" bind:value={searchValue} on:input={handleSearch} />
		</div>

		{#each filteredOptions as option}
			<li class="rounded p-2 hover:bg-gray-100">
				<Checkbox
					checked={selected.includes(option.value)}
					on:click={handleSelect}
					value={option.value}>{option.label}</Checkbox
				>
			</li>
		{/each}
	</Dropdown>
	<ErrorMessage {name} bind:isInvalid />
</div>
