<script lang="ts">
	import { page } from '$app/stores'

	import { CONFIG } from '@config'

	export let onClick: () => void = () => {}

	$: active = $page.url.pathname
</script>

<ul class="flex flex-col lg:flex-row py-8 lg:py-0 space-x-0 lg:space-x-16">
	{#each CONFIG.navigation.pages as page}
		<li>
			<a
				on:click={onClick}
				href={page.path}
				class="hover:text-secondary-500 transition"
				class:text-secondary-500={page.path === active}
			>
				{page.name}
			</a>
		</li>
	{/each}
</ul>
