<script lang="ts">
	import '../styles/tailwind-output.css'
	import '../styles/style.css'
	import { Header, Footer, HeaderResponsive, Sidebar } from '@features/header/index'

	import { page } from '$app/stores';

	let open = false

	
	export function getBgColor(url:str) {
		if (url == "/")
			return "bg-bgGradient"
		else 
			return ""
	}

	
</script>


<!-- Add gradient background only for the index page -->
<section class="{getBgColor($page.url.pathname)}">

<Sidebar bind:open/>
<HeaderResponsive bind:sidebar={open}/>


<main>
	<slot />
</main>

<Footer />
</section>
