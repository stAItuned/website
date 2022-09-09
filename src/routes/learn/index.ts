import { getAllArticles } from '@lib/git'
export async function get() {
	// `params.id` comes from [id].js

	const articles = getAllArticles()
	console.log(`Loaded /learn - Read ${articles.length} articles`)
	return {
		body: { articles: articles }
	}

}
