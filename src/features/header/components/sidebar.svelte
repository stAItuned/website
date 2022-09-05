<script lang="ts">
	import { CONFIG } from '@config'
	import { fly } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'

	export let open = false
	const close = () => (open = false)
</script>

{#if open}
	<aside
		class="fixed z-20 w-full h-full bg-primary-600 border-r-2 shadow-lg"
		transition:fly={{ duration: 300, easing: backInOut, x: -1000 }}
	>
		<center>
			<nav class="p-12 text-3xl text-white text-bold">
				<a on:click={close} href="/"
					><img class="w-80px h-[40px]" src="/assets/general/logo-text.svg" alt="logo" /></a
				>
				<hr class="text-white  m-10" />
				{#each CONFIG.navigation.pages as page}
					<a on:click={close} href={page.path} class="mb-20 text-bold">{page.name}</a> <br />
				{/each}
			</nav>
		</center>
	</aside>
{/if}

<style>
	aside {
		left: 0;
	}
</style>
