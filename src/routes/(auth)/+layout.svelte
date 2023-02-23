<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import userStore, { type User } from '@lib/stores/user'

	import api from '@lib/services'

	let loading = true
	onMount(() => {
		// Check if 'token' exists in localStorage
		if (!localStorage.getItem('token')) {
			loading = false
			return
		}

		api.auth
			.me()
			.then((user) => {
				$userStore = user as User
				goto('/')
			})
			.catch((err) => console.error(err))
			.finally(() => (loading = false))
	})
</script>

{#if !loading}
	<div class="h-screen flex flex-col justify-center overflow-x-hidden">
		<slot />
	</div>
{/if}
