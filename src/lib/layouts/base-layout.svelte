<script lang="ts">
	// @ts-ignore
	import bgGradient from '@assets/general/bg-gradient.png?w=1024?webp'

	import { fade } from 'svelte/transition'

	import { page } from '$app/stores'
	import Base from './base'

	let open_header = false

	$: homepage = $page.url.pathname === '/'
</script>

<Base.Header bind:open_header />
<section class="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
	{#if homepage}
		<img
			transition:fade={{ duration: 300 }}
			srcset={bgGradient}
			alt="bg-gradient"
			class="absolute h-full w-full object-cover -z-50"
		/>
	{/if}

	<main class="h-full flex flex-col justify-center">
		<slot />
	</main>
	<Base.Footer />
</section>
