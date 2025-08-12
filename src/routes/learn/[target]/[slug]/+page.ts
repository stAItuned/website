import type { PageLoad } from './$types'

export const load: PageLoad = async ({ data }) => {
    const article = data.article
    const relatedArticles = data.relatedArticles
    const component = await import(/* @vite-ignore */`../../../../assets/content/articles/${article.slug}/${article.filename}.md`)
    return {
        article,
        componentToRender: component.default,
        relatedArticles
        // component: component
    }
}