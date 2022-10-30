import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

import { git } from '@lib/git'

export const load: PageServerLoad = async ({ params }) => {
	const authors = (await git.loadData()).authors
	if (params.team !== 'member') {
		throw error(404, 'Page not found')
	}
	const author = authors.find((author) => author.slug.toLowerCase() === params.member.toLowerCase())

	if (!author) throw error(404, 'Member not found')
	return {
		author
	}
}
