import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

import { git } from '@lib/git'

export const load: PageServerLoad = async ({ params }) => {
    const articles = (await git.loadData()).articles
    const article = articles.find((article) => article.slug === params.slug)
    if (!article)
        throw error(404, 'Article not found')

    return {
        article
    }
}