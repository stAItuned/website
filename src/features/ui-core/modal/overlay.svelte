<script lang="ts">
	import { fly } from 'svelte/transition'

	export let isOpen: boolean
</script>

{#if isOpen}
	<div
		transition:fly={{ duration: 300 }}
		class="z-40 fixed bg-slate-800 opacity-75 w-screen h-screen"
		on:click={() => (isOpen = false)}
	/>
{/if}
