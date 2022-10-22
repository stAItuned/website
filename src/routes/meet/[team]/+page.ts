import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

import { Meet } from '@lib/configs'

export const load: PageLoad = async ({ params, data }) => {
    if (!Meet.TEAMS.map(target => target.toLowerCase()).includes(params.team))
        throw error(404, 'Article not found')
    return data
}