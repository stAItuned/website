import type { SidebarItemProps } from '@protected/components/sidebar/types'
import { Cog6Tooth, Folder, Newspaper, Squares2x2, User, ChartPie } from 'svelte-heros-v2'

interface SidebarNavigation {
	main: SidebarItemProps[],
	footer: SidebarItemProps[]
}

export const navigation: SidebarNavigation = {
	main: [
		{
			props: { label: 'Dashboard', href: '/dashboard' },
			icon: Squares2x2
		},
		{
			props: { label: 'Profile', href: '/profile' },
			icon: User
		},
		{
			props: { label: 'Articles' },
			foldable: true,
			icon: Folder,
			children: [
				{ label: 'Published articles', href: '/articles/published' },
				{ label: 'Draft articles', href: '/articles/draft' }
			]
		},
	],
	footer: [
		{
			props: { label: 'Blog', href: '/' },
			icon: Newspaper,
			mobileOnly: true
		},
		{
			props: { label: 'Settings', href: '/settings' },
			icon: Cog6Tooth
		}
	]
}