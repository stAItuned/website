<script lang="ts">
	import { onMount } from 'svelte'
	import '../styles/tailwind.css'
	import { page } from '$app/stores'
	import Base from '@lib/layouts/base'

	import userStore from '@lib/stores/user'
	import type { User } from '@lib/stores/user'

	import { PageTransition } from '$lib/components/ui-core'
	import api from '@lib/services'
	let open_header = false

	let loading = true
	onMount(() => {
		// Check if 'token' exists in localStorage
		if (!localStorage.getItem('token')) {
			loading = false
			return { props: { user: null } }
		}
		api.auth
			.me()
			.then((user) => ($userStore = user as User))
			.catch((err) => console.error(err))
			.finally(() => (loading = false))
	})
</script>

{#if !loading}
	<section class="min-h-screen flex flex-col justify-between overflow-x-hidden">
		<Base.Header bind:open_header />
		<main class="h-full flex flex-col justify-center">
			<PageTransition url={$page.url.pathname}>
				<slot />
			</PageTransition>
		</main>
		<Base.Footer />
	</section>
{/if}
