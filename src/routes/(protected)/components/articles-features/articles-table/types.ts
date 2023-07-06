import type { SvelteComponentTyped } from 'svelte'

export interface Action {
	label: string,
	icon: new (...args: any) => SvelteComponentTyped<any>,
	href?: string
	callback?: () => void,
}