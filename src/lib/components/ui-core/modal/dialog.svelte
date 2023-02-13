<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'

	export let isOpen: boolean
</script>

{#if isOpen}
	<div
		transition:fly={{ duration: 300, easing: backInOut, y: -50 }}
		class="fixed z-50 bg-white max-w-4xl h-fit rounded-lg inset-2 mx-auto mt-32 p-4 lg:p-8 shadow space-y-16 flex flex-col justify-between"
	>
		<slot />
	</div>
{/if}
