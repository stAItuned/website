import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ url }) => {
	const code = url.searchParams.get('code')
	if (code) return { code }
	else throw error(400, 'Code is required')
}