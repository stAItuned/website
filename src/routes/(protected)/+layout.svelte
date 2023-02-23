<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import userStore, { type User } from '@lib/stores/user'

	import api from '@lib/services'

	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte'
	import Navbar from './navbar.svelte'
	import Sidebar from './sidebar.svelte'

	let loading = true
	onMount(() => {
		// Check if 'token' exists in localStorage
		if (!localStorage.getItem('token')) {
			loading = false
			// goto('/') <-- TODO: MUST BE UNCOMMENTED
		}

		api.auth
			.me()
			.then((user) => {
				$userStore = user as User
			})
			// .catch((err) => goto('/')) TODO: MUST BE UNCOMMENTED
			.finally(() => (loading = false))
	})
</script>

{#if !loading}
	<div class="h-screen flex flex-col overflow-hidden">
		<Navbar />
		<div class="flex h-full overflow-hidden">
			<Sidebar />
			<div class="px-4 py-8 w-4/5  overflow-scroll">
				<div class="px-8 flex flex-col space-y-8">
					<Breadcrumb aria-label="Default breadcrumb example">
						<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
					</Breadcrumb>
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}
