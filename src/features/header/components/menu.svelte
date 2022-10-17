<script lang="ts">
	import { CONFIG } from '@config'
	import { page } from '$app/stores'

	$: active = $page.url.pathname

	export let onClick: () => void = () => {}
</script>

<ul class="flex flex-col lg:flex-row py-8 lg:py-0 space-x-0 lg:space-x-16">
	{#each CONFIG.navigation.pages as page}
		<li>
			<a
				on:click={onClick}
				href={page.path}
				class="hover:text-stayYellow-500 transition"
				class:text-stayYellow-500={page.path === active}
			>
				{page.name}
			</a>
		</li>
	{/each}
</ul>
