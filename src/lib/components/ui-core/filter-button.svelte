<script lang="ts">
	export let handleClick = () => {}
	export let active: boolean = false
	export let label: string
</script>

<button
	class={`rounded-lg p-2 text-xs lg:text-sm font-semibold ${
		active ? 'bg-primary-500' : 'bg-gray-200'
	}  transition ${active ? 'text-white' : 'text-primary-500'} ${
		active ? 'opacity-100' : 'opacity-50'
	}`}
	on:click={handleClick}
>
	<span>{label}</span>
</button>
