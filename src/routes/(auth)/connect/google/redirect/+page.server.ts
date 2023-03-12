import type { PageServerLoad } from './$types'

import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ url }) => {
	const accessToken = url.searchParams.get('access_token')
	if (accessToken) return { accessToken }
	else throw error(400, 'Access token missed')
}