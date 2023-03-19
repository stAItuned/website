import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

import { Filters } from '@lib/configs'

export const load: PageLoad = async ({ params, data }) => {
    if (!Filters.TARGETS.map(target => target.toLowerCase()).includes(params.target))
        throw error(404, 'Article not found')
    return data
}