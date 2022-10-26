<script lang="ts">
	import Icons from './icons'

	export let iconStart: boolean = false
	export let variant: 'solid' | 'transparent' = 'solid'
	export let name: string, placeholder: string
	export let handleInput: (e: Event) => void = () => {}
	export let handleChange: (e: Event) => void = () => {}
</script>

<div
	class={`w-full flex ${
		variant === 'solid' && !iconStart ? '-space-x-16' : 'space-x-0'
	} items-center`}
>
	<input
		on:input|preventDefault={handleInput}
		on:change|preventDefault={handleChange}
		{name}
		{placeholder}
		type="search"
		class={`w-full ${
			variant === 'solid' ? 'bg-slate-100' : 'bg-transparent'
		} py-4 px-8 w-full rounded-full border-0 focus:ring-0 placeholder:text-slate-400`}
	/>

	<div class={`text-slate-500 ${iconStart ? 'order-first' : 'order-last'}`}>
		<Icons.Search class="w-7 h-7" />
	</div>
</div>
