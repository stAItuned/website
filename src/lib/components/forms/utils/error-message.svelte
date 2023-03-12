<script lang="ts">
	import { fly } from 'svelte/transition'
	import { ErrorMessage } from 'svelte-forms-lib'

	export let name: string
    export let isInvalid = false
</script>

{#if isInvalid}
	<div transition:fly={{ duration: 300, y: -10 }} class="absolute -bottom-3">
		<ErrorMessage {name} class=" text-red-500 font-semibold text-xs" />
	</div>
{/if}
