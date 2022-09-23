<script lang="ts">
	import '../styles/tailwind-output.css'
	import '../styles/style.css'
	import { Header, Footer, HeaderResponsive, Sidebar } from '@features/header/index'

	let open = false
</script>


<Sidebar bind:open/>
<HeaderResponsive bind:sidebar={open}/>


<main>
	<slot />
</main>

<Footer />
