<script lang="ts">
	import Base from './base'
	import { PageTransition } from '$lib/components/ui-core'
	export let url: string
	let open_header = false
</script>

<Base.Header bind:open_header />
<section class="min-h-screen flex flex-col justify-between overflow-x-hidden">
	<main class="h-full w-full flex flex-col justify-center">
		<PageTransition {url}>
			<slot />
		</PageTransition>
	</main>
	<Base.Footer />
</section>
