import type { SvelteComponentTyped } from 'svelte'


export interface BaseProps {
	label: string,
	href?: string
}

export interface SidebarItemProps {
	props: BaseProps,
	foldable?: boolean,
	mobileOnly?: boolean,
	icon: new (...args: any) => SvelteComponentTyped<any>,
	children?: BaseProps[]
}