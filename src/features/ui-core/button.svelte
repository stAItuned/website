<script lang="ts">
	export let variant: 'primary' | 'secondary' = 'primary'
	export let rounded: 'lg' | 'full' = 'lg'
	export let width: 'fit' | 'full' = 'fit'
	export let type: 'button' | 'submit' | 'reset' = 'button'
    export let onClick = () => {}
	export let className = ''
</script>

{#if variant === 'primary'}
	<button
		{type}
        on:click={onClick}
		class={`p-4 bg-primary-600 hover:bg-primary-500 active:bg-primary-600 transition w-${width} text-white rounded-${rounded} ` +
			className}
	>
		<span class="font-semibold">
			<slot />
		</span>
	</button>
{:else if variant === 'secondary'}
	<button
		{type}
        on:click={onClick}
		class={`p-4 bg-stayYellow-600 hover:bg-stayYellow-500 active:bg-stayYellow-600 transition w-${width} text-primary-600 rounded-${rounded} ` +
			className}
	>
		<span class="font-semibold">
			<slot />
		</span>
	</button>
{/if}
