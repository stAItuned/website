<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { ErrorMessage } from 'svelte-forms-lib'
	import { Dropdown, Checkbox, Chevron, Button, Search } from 'flowbite-svelte'

	import type { MultiSelectProps, Option } from './types'

	interface $$Props extends MultiSelectProps {}

	const { name, label = '', options }: MultiSelectProps = $$props as MultiSelectProps

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
</script>

<div class={`flex flex-col space-y-2 ${$$props.class}`}>
	<p>{label}</p>
	<Button on:click={handleResetSearch}><Chevron>{label}</Chevron></Button>

	<Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-44">
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
	<ErrorMessage {name} class="text-red-500 font-semibold" />
</div>
