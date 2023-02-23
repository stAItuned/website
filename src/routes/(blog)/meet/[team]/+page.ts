import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

import { Teams } from '@lib/configs'

export const load: PageLoad = async ({ params, data }) => {
    if (!Teams.NAMES.map(team => team.toLowerCase()).includes(params.team))
        throw error(404, 'Article not found')
    return data
}