<script lang='ts'>
	import { onMount } from 'svelte'

	import { goto } from '$app/navigation'
	import { user } from '@lib/stores'

	import { CursorArrowRays } from 'svelte-heros-v2'
	import { Breadcrumb, Navbar, Sidebar } from '@protected/components'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'


	const { addNotification } = getNotificationsContext()

	onMount(() => {
		if (!$user)
			goto('/login').then(() => addNotification(notify.error('You must be authenticated')))
	})

	let hiddenSidebar = true
	const openSidebar = () => hiddenSidebar = false
</script>


{#if $user}
	<div class='h-screen flex flex-col overflow-hidden'>
		<Navbar {openSidebar} />
		<div class='flex h-full overflow-hidden'>
			<Sidebar bind:hidden={hiddenSidebar} />
			<div class='py-8 xl:w-4/5  overflow-y-scroll'>
				<div class='px-6 xl:px-8 flex flex-col space-y-8'>
					<Breadcrumb />
					<slot />
					{#if $user.completed}
						<div class='fixed bottom-0 left-0 py-4 px-2 w-full hover:cursor-pointer scale-95 hover:scale-100 transition'>
							<div class='flex items-center p-4 text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-xl'>
								<CursorArrowRays class='mr-3' />
								<span class='text-sm'>Complete your profile to unlock all the functionalities</span>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}