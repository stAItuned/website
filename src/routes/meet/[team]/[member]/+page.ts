import type { PageLoad } from './$types'


export const load: PageLoad = async ({ data }) => {
	const author = data.author
	const component = await import(/* @vite-ignore */`../../../../assets/cms/author/${author.slug}/meta.md`)
	return {
		author,
		componentToRender: component.default,
		component: component,
	}
}
