<script lang="ts">
	import '../styles/tailwind-output.css'
	import { Header } from '@features/header/index.ts'
</script>

<Header />

<main>
	<slot />
</main>

<footer />
