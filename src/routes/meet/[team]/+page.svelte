<script lang="ts">
	import type { PageData } from './$types'

	import { page } from '$app/stores'

	import { Teams } from '@lib/configs'
	import type { Article, Author } from '@lib/interfaces'
	import { Breadcrumb, PageTransition } from '@components/ui-core'
	import { Cards } from '@components/features'
	import { utils } from '@lib/helpers'

	export let data: PageData
	const authors: Author[] = data.authors
	const articles: Article[] = data.articles

	const team = $page.params.team
	const pathname = $page.url.pathname

	let filterAuthors = authors.filter((author) =>
		author.team.map((t) => t.toLowerCase()).includes(team)
	)

	let order: string[] = []

	if (team == 'tech') {
		order = Teams.TECH_ORDER
	} else if (team == 'marketing') {
		order = Teams.MARKETING_ORDER
	}

	if (team == 'tech' || team == 'marketing') {
		let arr: Author[] = []
		order.forEach((name) => {
			const authFound = filterAuthors.find((a) => a.name === name)
			if (authFound) arr.push(authFound)
		})
		filterAuthors = arr
	} else {
		filterAuthors = filterAuthors
			.sort(
				(a, b) =>
					(articles
						.filter((article) => article.author === b)
						.reduce((prev, curr) => prev + curr.metadata.readingTime, 0) ?? 0) -
					(articles
						.filter((article) => article.author === a)
						.reduce((prev, curr) => prev + curr.metadata.readingTime, 0) ?? 0)
			)
	}
</script>

<PageTransition>
	<div class="max-w-7xl mx-auto mb-32 mt-[150px] space-y-16 px-8 xl:px-4">
		<div class="flex flex-col md:flex-row gap-16 items-center justify-between xl:px-8">
			<Breadcrumb tabs={utils.getTabsFromPathname(pathname)} />
			<h1 class="font-bold text-4xl text-center text-primary-500 uppercase">
				{team} team
			</h1>
		</div>
		<div class="flex flex-wrap justify-center">
			{#each filterAuthors as author}
				<Cards.TeamMember {author} />
			{/each}
		</div>
	</div>
</PageTransition>
