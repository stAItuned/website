<script lang='ts'>
	import { navigation } from './config'
	import { Sidebar, SidebarCta, SidebarGroup, SidebarWrapper } from 'flowbite-svelte'
	import { LogoutButton, SidebarItem, UserItem } from '@protected/components/sidebar'

	export let closeSidebar: () => void | null = null
</script>


<Sidebar asideClass='h-full'>
	<SidebarWrapper class='!bg-slate-100 border-r rounded-none border-slate-300 h-full'>
		<UserItem />
		<a href='/articles/new' on:click={closeSidebar}>
			<SidebarCta
				label='Write a new article'
				class='bg-gradient-to-br from-indigo-700 to-sky-500 shadow-lg shadow-blue-500/50 !mb-6'
				spanClass='bg-indigo-200 text-indigo-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded'>
				<p class='mb-3 text-sm text-slate-50'>
					Let's start writing your own content!
					<span class='block font-semibold mt-2'>Sharing your knowledge has never been easier!</span>
				</p>
			</SidebarCta>
		</a>
		{#each Object.values(navigation) as group}
			<SidebarGroup border borderClass='pt-4 mt-4 border-t border-slate-300/50'>
				{#each group as item}
					<SidebarItem {item} on:click={closeSidebar} />
				{/each}
			</SidebarGroup>
		{/each}
		<LogoutButton />
	</SidebarWrapper>
</Sidebar>
