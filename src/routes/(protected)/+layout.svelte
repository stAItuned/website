<script lang='ts'>
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { getNotificationsContext } from 'svelte-notifications'

	import { Breadcrumb, Navbar, Sidebar, UnlockProfileCTA } from '@protected/components'

	import api from '@lib/services'
	import { user } from '@lib/stores'
	import { notify } from '@lib/hooks'

	const { addNotification } = getNotificationsContext()

	let loading = true

	onMount(() => {
		if (!$user)
			api.auth.me()
				.then((res) => user.set(res))
				.catch(() => {
					goto('/login').then(() => addNotification(notify.error('You must be authenticated')))
					user.set(null)
				})
				.finally(() => loading = false)
		else loading = false
	})

	let hiddenSidebar = true
	const openSidebar = () => hiddenSidebar = false
</script>


{#if !loading && $user}
	<div class='h-screen flex flex-col overflow-hidden'>
		<Navbar {openSidebar} />
		<div class='flex h-full overflow-hidden'>
			<Sidebar bind:hidden={hiddenSidebar} />
			<div class='py-8 xl:w-4/5 overflow-y-scroll mx-auto w-full'>
				<div class='px-6 xl:px-8 flex flex-col space-y-8 w-full'>
					<Breadcrumb />
					<slot />
					{#if !$user.author.unlocked}
						<UnlockProfileCTA />
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}