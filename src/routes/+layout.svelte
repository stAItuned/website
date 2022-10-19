<script lang="ts">
	import '../styles/tailwind.css'
	import '../styles/style.css'

	import bgGradient from '../assets/general/bg-gradient.svg'

	import { page } from '$app/stores'

	import { Footer, Header } from '@features/ui-core'

	let open_header = false

	$: homepage = $page.url.pathname === '/'
</script>

<Header bind:open_header />
<section class="relative min-h-screen flex flex-col justify-between">
	{#if homepage}
		<img src={bgGradient} alt="bg-gradient" class="absolute h-full w-full object-cover -z-50" />
	{/if}

	<main class="h-full flex flex-col justify-center">
		<slot />
	</main>

	<Footer />
</section>
