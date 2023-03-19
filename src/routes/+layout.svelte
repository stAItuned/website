<script lang="ts">
	import { BaseLayout } from '@lib/layouts'
	import { onMount } from 'svelte'
	import '../styles/tailwind.css'
	import { trackPageview } from '../lib/hotjar/trackPageView'

	let request: Request;

	onMount(() => {
		trackPageview(request)
	})
</script>

<BaseLayout>
	<slot />
</BaseLayout>
