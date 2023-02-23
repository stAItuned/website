<script lang="ts">
	import {
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		SidebarDropdownWrapper,
		SidebarDropdownItem,
		Button,
		Avatar
	} from 'flowbite-svelte'
	let spanClass = 'flex-1 ml-3 whitespace-nowrap'

	import user from '@lib/stores/user'

	import { User, Folder, Squares2x2, Cog6Tooth, ArrowLeftOnRectangle } from 'svelte-heros-v2'

	interface NavigationItem {
		label: string
		url: string
		icon: typeof User
		sublinks?: NavigationItem[]
	}

	const navigation: { main: NavigationItem[]; footer: NavigationItem[] } = {
		main: [
			{ label: 'Dashboard', url: '/dashboard', icon: Squares2x2 },
			{ label: 'Profile', url: '/profile', icon: User },
			{
				label: 'Articles',
				url: '/articles',
				icon: Folder,
				sublinks: [
					{ label: 'Published articles', url: '/articles/published', icon: Folder },
					{ label: 'Draft articles', url: '/articles/draft', icon: Folder }
				]
			}
		],
		footer: [
			{ label: 'Settings', url: '/settings', icon: Cog6Tooth },
			{ label: 'Logout', url: '/', icon: ArrowLeftOnRectangle }
		]
	}
</script>

<Sidebar asideClass="h-full w-1/5">
	<SidebarWrapper
		divClass="bg-slate-50 border-r border-slate-300/50 h-full px-4 py-8 flex flex-col justify-between"
	>
		{#each Object.values(navigation) as group, idx}
			<SidebarGroup border={idx === 1} borderClass="pt-4 mt-4 border-t border-slate-300/50">
				{#if !idx}
					<div class="flex items-center space-x-4 bg-slate-100/75 p-4 rounded-xl mb-8">
						<Avatar
							>{`${$user?.firstname[0].toUpperCase()}${$user?.lastname[0].toUpperCase()}`}</Avatar
						>
						<h6>{`${$user?.firstname} ${$user?.lastname}`}</h6>
					</div>
				{/if}
				{#each group as item}
					{#if item.sublinks}
						<SidebarDropdownWrapper
							label={item.label}
							btnClass="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-slate-100"
						>
							<svelte:fragment slot="icon">
								<svelte:component this={item.icon} />
							</svelte:fragment>
							{#each item.sublinks as sublink}
								<SidebarDropdownItem
									aClass="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-slate-100"
									label={sublink.label}
									href={sublink.url}
								/>
							{/each}
						</SidebarDropdownWrapper>
					{:else}
						<SidebarItem
							label={item.label}
							href={item.url}
							aClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-slate-100"
						>
							<svelte:fragment slot="icon">
								<svelte:component this={item.icon} />
							</svelte:fragment>
						</SidebarItem>
					{/if}
				{/each}
			</SidebarGroup>
		{/each}
	</SidebarWrapper>
</Sidebar>
