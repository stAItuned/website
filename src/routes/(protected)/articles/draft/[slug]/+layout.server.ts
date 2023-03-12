import type { LayoutServerLoad } from './$types'

import api from '@lib/services'

export const load: LayoutServerLoad = async ({ params }) => ({
	article: await api.articles.fetchBySlug(params.slug, { populate: true })
})