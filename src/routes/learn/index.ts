import { getArticleMetas } from '@lib/notion'

/** @type {import('./__types/[id]').RequestHandler} */
export async function get() {
	// `params.id` comes from [id].js

	const articleMetas = await getArticleMetas()

	return {
		body: { articleMetas }
	}

}
