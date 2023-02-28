import type { PageLoad } from './$types'

export const load: PageLoad = async ({ data }) => {
    const article = data.article
    const relatedArticles = data.relatedArticles
    const component = await import(/* @vite-ignore */`./understanding-how-recommendation-suggestions-work/recommender system.md`)
    // const component = await import(/* @vite-ignore */`../../../../assets/cms/articles/${article.slug}/${article.filename}.md`)
    return {
        article,
        relatedArticles,
        componentToRender: component.default,
        // component: component
    }
}