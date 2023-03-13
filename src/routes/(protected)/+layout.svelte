<script lang='ts'>
	import { onMount } from 'svelte'

	import { goto } from '$app/navigation'
	import { user } from '@lib/stores'

	import { page } from '$app/stores'

	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte'
	import Navbar from './navbar.svelte'
	import Sidebar from './sidebar.svelte'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	const split = $page.url.pathname.split('/').slice(1)
	const items = split.map((item) => item[0].toUpperCase() + item.slice(1))
	const breadcrumb = items.map((item, idx) => {
		const label = item
		let href = ''
		split.forEach((el, idx2) => {
			if (idx2 <= idx) href = href + '/' + el
		})
		console.log(href)
		return { label, href }
	})

	const { addNotification } = getNotificationsContext()

	onMount(() => {
		if (!$user)
			goto('/login').then(() => addNotification(notify.error("You must be authenticated")))
	})
</script>


{#if $user}
	<div class='h-screen flex flex-col overflow-hidden'>
		<Navbar />
		<div class='flex h-full overflow-hidden'>
			<Sidebar />
			<div class='px-4 py-8 w-4/5  overflow-y-scroll'>
				<div class='px-8 flex flex-col space-y-8'>
					<Breadcrumb>
						{#each breadcrumb as item, idx}
							<BreadcrumbItem href={item.href} home={!idx}>{item.label}</BreadcrumbItem>
						{/each}
					</Breadcrumb>
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}