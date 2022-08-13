<script lang="ts">
	import '../styles/tailwind-output.css'
	import '../styles/style.css'
	import { Header, Footer } from '@features/header/index.ts'
</script>

<Header />

<main>
	<slot />
</main>

<Footer />
