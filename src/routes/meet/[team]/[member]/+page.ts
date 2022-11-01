import type { PageLoad } from './$types'

export const load: PageLoad = async ({ data }) => {
	const author = data.author
	try {
		const component = await import(
			/* @vite-ignore */ `../../../../assets/cms/team/${author.slug}/meta.md`
		)
		return {
			author,
			componentToRender: component.default,
			component: component
		}
	} catch {}
}
