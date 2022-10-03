<script lang="ts">
	import '../styles/tailwind.css'
	import '../styles/style.css'
	import bgGradient from '../assets/general/bg-gradient.svg'
	import { Footer, HeaderResponsive } from '@features/header/index'
	import { page } from '$app/stores'

	$: homepage = $page.url.pathname === '/'

	let openedSidebar = false
</script>

<!-- Add gradient background only for the index page -->
<section class="relative min-h-screen flex flex-col justify-between">
	{#if homepage}
		<img src={bgGradient} alt="bg-gradient" class="absolute h-full w-full object-cover -z-50" />
	{/if}

	<HeaderResponsive bind:openedSidebar />

	<main class="h-full">
		<slot />
	</main>

	<Footer />
</section>
