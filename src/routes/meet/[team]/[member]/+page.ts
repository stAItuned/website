import type { PageLoad } from './$types'


export const load: PageLoad = async ({ data }) => {
	const author = data.author
	const component = await import(/* @vite-ignore */ `./Daniele-Moltisanti/meta.md`
	)
	return {
		author,
		componentToRender: component.default,
		component: component,
	}
}
