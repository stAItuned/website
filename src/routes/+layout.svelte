<script lang="ts">
	import '../styles/tailwind.css'
	import '../styles/style.css'
	import { Footer, HeaderResponsive } from '@features/header/index'

	import { page } from '$app/stores'

	let openedSidebar = false

	export function getBgColor(url: string) {
		if (url == '/') return 'bg-bgGradient'
		else return ''
	}
</script>

<!-- Add gradient background only for the index page -->
<section class={getBgColor($page.url.pathname) + ' min-h-screen flex flex-col justify-between'}>
	<HeaderResponsive bind:openedSidebar />

	<main class="h-full">
		<slot />
	</main>

	<Footer />
</section>
