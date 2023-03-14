<script lang='ts'>
	import { createEventDispatcher } from 'svelte'
	import { page } from '$app/stores'
	import type { SidebarItemProps } from '@protected/components/sidebar/types'
	import { SidebarDropdownItem, SidebarDropdownWrapper, SidebarItem } from 'flowbite-svelte'

	export let item: SidebarItemProps

	const dispatch = createEventDispatcher()

	$: active = $page.url.pathname === item?.props.href
	const sidebarItem = item?.foldable ? SidebarDropdownWrapper : SidebarItem
</script>

<svelte:component
	this={sidebarItem}
	{...item.props}
	{active}
	class={`${item.mobileOnly ? "xl:hidden" : null} hover:!bg-slate-200`}
	activeClass='flex items-center p-2 text-base font-normal text-slate-900 bg-slate-200 rounded-lg hover:bg-slate-200'
	on:click={() => dispatch('click')}
>
	<svelte:fragment slot='icon'>
		<svelte:component this={item.icon} />
	</svelte:fragment>
	{#if item.foldable && item.children}
		{#each item.children as child}
			<SidebarDropdownItem
				on:click={() => dispatch('click')}
				class='hover:!bg-slate-200'
				{...child}
			/>
		{/each}
	{/if}
</svelte:component>