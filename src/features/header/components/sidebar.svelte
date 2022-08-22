<script>
	import { CONFIG } from '@config'
	export let open = false
</script>

<aside class="absolute w-full h-full bg-primary-600 border-r-2 shadow-lg" class:open>
	<center>
		
		<nav class="p-12 text-3xl text-white text-bold">
			<img class="w-80px h-[40px]" src="/assets/general/logo-text.svg" alt="logo" />
			<hr class="text-white  m-10" />
			{#each CONFIG.navigation.pages as page}
			<a href={page.path} class="mb-20 text-bold">{page.name}</a> <br />
			{/each}
		</nav>
	</center>
</aside>

<style>
	aside {
		left: -100%;
		transition: left 0.3s ease-in-out
	}
	
	.open {
		left: 0
	}
</style>