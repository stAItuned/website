<script lang="ts">
	export let title: string = ''
</script>

<div class="space-y-4">
	{#if title}
		<h1 class="font-bold text-primary-600 text-2xl">{title}</h1>
	{/if}
	<p class="text-slate-800">
		<slot />
	</p>
</div>
