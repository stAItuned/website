<script lang="ts">
	export let type: 'text' | 'password' = 'text'
	export let label: string = ''
	export let placeholder = ''
	export let name: string
	export let id: string
	export let value: string
	export let handleChange: (e: Event) => any
	export let error: string
</script>

<div class="flex flex-col space-y-2">
	<label for={id}>{label}</label>

	{#if type === 'text'}
		<input
			class={`rounded-lg bg-slate-100 ${error ? 'border-red-500' : 'border-slate-200'}`}
			type="text"
			{name}
			{id}
			{placeholder}
			bind:value
			on:change={handleChange}
		/>
	{:else}
		<input
			class={`rounded-lg bg-slate-100 ${error ? 'border-red-500' : 'border-slate-200'}`}
			type="password"
			{name}
			{id}
			{placeholder}
			bind:value
			on:change={handleChange}
		/>
	{/if}
	<small class="text-red-500 font-semibold">{error}</small>
</div>
