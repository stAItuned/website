<script lang='ts'>
	import { goto } from '$app/navigation'

	import api from '@lib/services'
	import { user } from '@lib/stores'
	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	import { SidebarGroup, SidebarItem } from 'flowbite-svelte'
	import { ArrowLeftOnRectangle } from 'svelte-heros-v2'

	const { addNotification } = getNotificationsContext()

	const handleLogout = () => {
		api.auth.logout()
			.then(() => {
				user.set(null)
				goto('/').then(() => addNotification(notify.success('See you!')))
			})
			.catch((err) => addNotification(notify.error(err)))
	}
</script>

<SidebarGroup>
	<SidebarItem
		label='Logout'
		on:click={handleLogout}
		class='hover:!bg-slate-200'
	>
		<svelte:fragment slot='icon'>
			<svelte:component this={ArrowLeftOnRectangle} />
		</svelte:fragment>
	</SidebarItem>
</SidebarGroup>
