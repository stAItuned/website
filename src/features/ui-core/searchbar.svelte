<script lang="ts">
	import Button from './button.svelte'

	export let handleSubmit = () => {}
	export let handleInput: (e: Event) => void = () => {}
	export let handleChange: (e: Event) => void = () => {}
</script>

<form on:submit|preventDefault={handleSubmit} class="w-full flex lg:px-16 -space-x-16">
	<input
		on:input|preventDefault={handleInput}
		on:change|preventDefault={handleChange}
		name="search"
		placeholder="Search by titles or authors..."
		type="search"
		class="bg-slate-100 py-4 px-8 w-full rounded-full border-0 focus:ring-0"
	/>

	<Button type="submit" variant="transparent" rounded="full" className="text-slate-500">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
			<path
				fill-rule="evenodd"
				d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
				clip-rule="evenodd"
			/>
		</svg>
	</Button>
</form>
