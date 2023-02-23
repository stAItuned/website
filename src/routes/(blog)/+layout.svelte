<script lang="ts">
	import { page } from '$app/stores'
	import Base from '@lib/layouts/base'

	import { PageTransition } from '$lib/components/ui-core'

	let open_header = false
</script>

<section class="flex flex-col justify-between overflow-x-hidden">
	<Base.Header bind:open_header />
	<main class="min-h-screen flex flex-col justify-center">
		<PageTransition url={$page.url.pathname}>
			<slot />
		</PageTransition>
	</main>
	<Base.Footer />
</section>
