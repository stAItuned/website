<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Toggle } from 'flowbite-svelte'

	import { ErrorMessage } from './utils'

	import type { ToggleProps } from './types'

	interface $$Props extends ToggleProps {
		class?: string
	}

	const { name, id = name, label = '', errors }: ToggleProps = $$props as ToggleProps

	const dispatch = createEventDispatcher()

	const handleToggle = (e: Event) => {
		const { checked } = e.target as HTMLInputElement
		dispatch('toggle', { checked })
	}

	let isInvalid = false
	errors?.subscribe((fields) => (fields[name] ? (isInvalid = true) : (isInvalid = false)))
</script>

<div class={`relative flex flex-col ${$$props.class}`}>
	<Toggle {id} {name} class="mb-3" size="small" on:change={handleToggle}>
		{label}
	</Toggle>
	<ErrorMessage {name} bind:isInvalid />
</div>
