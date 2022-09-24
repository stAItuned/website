import type { PageLoad } from './$types'

export const load: PageLoad = async ({ data }) => {
	const article = data.article
	const component = await import(/* @vite-ignore */`../../../../cms/articles/${article.slug}/${article.filename}.md`)
    return {
        article,
        component: component.default
    }
}
