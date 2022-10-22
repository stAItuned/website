<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'

	export let className = ''
	export let open: boolean
</script>

{#if open}
	<aside
		class={'fixed w-full h-full z-20 ' + className}
		transition:fly={{ duration: 300, easing: backInOut, x: 200 }}
	>
		<slot />
	</aside>
{/if}
